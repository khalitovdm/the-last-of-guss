import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Box, Typography, Divider, Button, keyframes } from '@mui/material';
import { PageLayout } from '@/components/PageLayout';
import { Round, RoundStatus, PlayerScore } from '@/types/round';
import { User } from '@/store/authStore';
import gooseImage from '@/assets/guss.png'; // <-- Импортируем PNG

// Компонент для отображения статистики
const StatsRow = ({ label, value }: { label: React.ReactNode, value: React.ReactNode }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
    <Typography variant="body1">{label}</Typography>
    <Box sx={{ flexGrow: 1, borderBottom: '1px dashed rgba(76, 175, 80, 0.4)', mx: 2, transform: 'translateY(-4px)' }} />
    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{value}</Typography>
  </Box>
);

const CompletedRoundView = ({ round, currentUser }: { round: Round, currentUser: User | null }) => {
  const myScore = round.playerScores.find((p: PlayerScore) => p.userId === currentUser?.id)?.score || 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, textAlign: 'center' }}>
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={gooseImage} alt="Guss" style={{ width: 'auto', height: '80%', maxHeight: '300px' }} />
      </Box>
      <Divider sx={{ bgcolor: 'rgba(76, 175, 80, 0.4)', my: 2 }} />
      <Box sx={{ fontFamily: '"Press Start 2P", monospace', textAlign: 'left', minHeight: '110px' }}>
        <StatsRow label="Всего" value={round.totalScore} />
        {round.winner && (
           <StatsRow label={<>Победитель - {round.winner.username}</>} value={round.playerScores.find((p: PlayerScore) => p.userId === round.winnerId)?.score || 'N/A'} />
        )}
        <StatsRow label="Мои очки" value={myScore} />
      </Box>
    </Box>
  );
};

const CooldownView = ({ round }: { round: Round }) => {
  const calculateRemainingTime = useCallback(() => {
    const now = new Date().getTime();
    const startsAt = new Date(round.startsAt).getTime();
    return Math.max(0, startsAt - now);
  }, [round.startsAt]);

  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(calculateRemainingTime());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateRemainingTime]);

  const formatTime = useCallback((ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={gooseImage} alt="Guss" style={{ width: 'auto', height: '80%', maxHeight: '300px' }} />
      </Box>
      <Divider sx={{ bgcolor: 'rgba(76, 175, 80, 0.4)', my: 2 }} />
      <Box sx={{ fontFamily: '"Press Start 2P", monospace', textAlign: 'center', minHeight: '110px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography sx={{ fontSize: '1.2rem', textTransform: 'uppercase' }}>
          Cooldown
        </Typography>
        <Typography sx={{ fontSize: '1rem', color: 'text.secondary', mt: 1 }}>
          до начала раунда {formatTime(remainingTime)}
        </Typography>
      </Box>
    </Box>
  );
};

const tapAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
`;

const ActiveRoundView = ({ round, currentUser, onTap }: { round: Round; currentUser: User | null; onTap: () => void; }) => {
  const formatTime = useCallback((ms: number) => {
    const totalSeconds = Math.floor(Math.max(0, ms) / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, []);

  const myScore = useMemo(() => {
    return round.playerScores.find(p => p.userId === currentUser?.id)?.score || 0;
  }, [round.playerScores, currentUser?.id]);

  const [remainingTime, setRemainingTime] = useState(new Date(round.endsAt).getTime() - new Date().getTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(new Date(round.endsAt).getTime() - new Date().getTime());
    }, 1000);
    return () => clearInterval(timer);
  }, [round.endsAt]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, textAlign: 'center' }}>
      <Box 
        sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', '&:active': { animation: `${tapAnimation} 0.1s ease-out` } }}
        onClick={onTap}
      >
        <img src={gooseImage} alt="Tap Guss" style={{ width: 'auto', height: '100%', maxHeight: '300px' }} />
      </Box>
      <Divider sx={{ bgcolor: 'rgba(76, 175, 80, 0.4)', my: 2 }} />
      <Box sx={{ fontFamily: '"Press Start 2P", monospace', textAlign: 'center', minHeight: '110px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant="h6" sx={{ textTransform: 'uppercase', color: 'secondary.main', mb: 1 }}>Раунд активен!</Typography>
        <Typography>До конца осталось: {formatTime(remainingTime)}</Typography>
        <Typography>Мои очки - {myScore}</Typography>
      </Box>
    </Box>
  );
};

interface RoundDetailsPageViewProps {
  round: Round;
  currentUser: User | null;
  status: RoundStatus;
  onGoBack: () => void;
  onTap: () => void;
}

// Основной компонент View
export const RoundDetailsPageView = ({ round, currentUser, status, onGoBack, onTap }: RoundDetailsPageViewProps) => {
  const getTitleByStatus = (status: RoundStatus): string => {
    switch (status) {
      case 'ACTIVE': return 'Раунды';
      case 'COOLDOWN': return 'Cooldown';
      case 'COMPLETED': return 'Раунд завершен';
      default: return `Раунд #${round.id}`;
    }
  };
  
  const title = getTitleByStatus(status);
  
  const headerContent = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography>{currentUser?.username}</Typography>
      <Button variant="outlined" onClick={onGoBack} size="small" sx={{ borderColor: 'primary.main', color: 'text.primary', '&:hover': { borderColor: 'text.primary', backgroundColor: 'rgba(76, 175, 80, 0.1)' } }}>
        Назад
      </Button>
    </Box>
  );

  const renderContent = () => {
    switch (status) {
      case 'COMPLETED':
        return <CompletedRoundView round={round} currentUser={currentUser} />;
      case 'ACTIVE':
        return <ActiveRoundView round={round} currentUser={currentUser} onTap={onTap} />;
      case 'COOLDOWN':
        return <CooldownView round={round} />;
      default:
        return null;
    }
  };

  return (
    <PageLayout title={title} titleAlign="center" headerContent={headerContent}>
      {renderContent()}
    </PageLayout>
  );
}; 