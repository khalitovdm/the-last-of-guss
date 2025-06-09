import { useState, useEffect, useCallback } from 'react';
import { getRoundById, tap as apiTap } from '@/services/roundsService';
import { Round, RoundStatus } from '@/types/round';
import axios from 'axios';

export const useRound = (roundId: string | undefined) => {
  const [round, setRound] = useState<Round | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTapping, setIsTapping] = useState(false);
  const [status, setStatus] = useState<RoundStatus | null>(null);

  useEffect(() => {
    if (!roundId) {
      setIsLoading(false);
      return;
    }

    const abortController = new AbortController();

    const fetchRound = async () => {
      setIsLoading(true);
      const minDelay = new Promise(resolve => setTimeout(resolve, 500));
      try {
        const roundData = await getRoundById(roundId, abortController.signal);
        setRound(roundData);
      } catch (err: any) {
        if (!axios.isCancel(err)) {
          setError(err.message || `Не удалось загрузить раунд ${roundId}`);
        }
      } finally {
        await minDelay;
        if (!abortController.signal.aborted) {
            setIsLoading(false);
        }
      }
    };

    (async () => {
      await fetchRound();
    })();

    return () => {
        abortController.abort();
    };
  }, [roundId]);

  useEffect(() => {
    if (!round) return;

    const getStatus = (): RoundStatus => {
        const now = new Date().getTime();
        const startsAt = new Date(round.startsAt).getTime();
        const endsAt = new Date(round.endsAt).getTime();
        if (now > endsAt) return 'COMPLETED';
        if (now >= startsAt) return 'ACTIVE';
        return 'COOLDOWN';
    }

    setStatus(getStatus());

    const interval = setInterval(() => {
        const newStatus = getStatus();
        if (newStatus !== status) {
            setStatus(newStatus);
        }
    }, 1000);

    return () => clearInterval(interval);
  }, [round, status]);

  const handleTap = useCallback(async () => {
    if (!roundId || isTapping || status !== 'ACTIVE') return;

    setIsTapping(true);
    try {
      const updatedPlayerScore = await apiTap(roundId);
      setRound(prevRound => {
        if (!prevRound) return null;
        
        const newPlayerScores = prevRound.playerScores.map(ps => 
          ps.userId === updatedPlayerScore.userId ? updatedPlayerScore : ps
        );

        if (!prevRound.playerScores.some(ps => ps.userId === updatedPlayerScore.userId)) {
          newPlayerScores.push(updatedPlayerScore);
        }
        
        const newTotalScore = newPlayerScores.reduce((acc, ps) => acc + ps.score, 0);

        return { 
          ...prevRound,
          playerScores: newPlayerScores,
          totalScore: newTotalScore,
        };
      });
    } catch (err: any) {
      console.error("Tap failed:", err);
      // Если раунд закончился, сервер вернет ошибку. Обновим статус.
      if (err.response?.data?.message === 'Round is not active') {
        setStatus('COMPLETED');
      }
    } finally {
      setIsTapping(false);
    }
  }, [roundId, isTapping, status]);

  return { round, isLoading, error, status, handleTap };
}; 