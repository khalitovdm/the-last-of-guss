import { useState, useEffect, useCallback } from 'react';
import { getRounds as apiGetRounds, createRound as apiCreateRound } from '@/services/roundsService';
import { Round } from '@/types/round';
import axios from 'axios';

export const useRounds = () => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAndSetRounds = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    try {
      const paginatedResult = await apiGetRounds(signal);
      setRounds(paginatedResult.items);
    } catch (err: any) {
      if (!axios.isCancel(err)) {
        setError(err.message || 'Не удалось загрузить раунды');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    (async () => {
      await fetchAndSetRounds(abortController.signal);
    })();
    return () => abortController.abort();
  }, [fetchAndSetRounds]);

  const createRound = useCallback(async () => {
    setIsLoading(true);
    try {
      await apiCreateRound();
      await fetchAndSetRounds();
    } catch (err: any) {
      setError('Не удалось создать раунд');
    } finally {
      setIsLoading(false);
    }
  }, [fetchAndSetRounds]);

  return { rounds, isLoading, error, createRound };
}; 