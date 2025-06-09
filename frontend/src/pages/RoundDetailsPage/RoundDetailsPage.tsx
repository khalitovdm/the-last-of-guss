import { useParams, useNavigate } from 'react-router-dom';
import { useRound } from '@/hooks/useRound';
import { useAuth } from '@/hooks/useAuth';
import { RoundDetailsPageView } from './RoundDetailsPageView';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { PageLayout } from '@/components/PageLayout';

export const RoundDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { round, isLoading, error, status, handleTap } = useRound(id);
  const { user } = useAuth();

  const handleGoBack = () => {
    navigate('/rounds');
  };

  const headerContent = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography>{user?.username}</Typography>
      <Button variant="outlined" onClick={handleGoBack} size="small">Назад</Button>
    </Box>
  );

  if (isLoading || !status) {
    return (
      <PageLayout title="Загрузка..." headerContent={headerContent}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress sx={{ color: 'primary.main' }} />
          <Typography sx={{ ml: 2, color: 'text.primary' }}>Загрузка данных раунда...</Typography>
        </Box>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Ошибка" headerContent={headerContent}>
        <Typography sx={{ color: 'error.main' }}>{error}</Typography>
      </PageLayout>
    );
  }

  if (!round) {
    return (
      <PageLayout title="Не найдено" headerContent={headerContent}>
        <Typography>Раунд не найден.</Typography>
      </PageLayout>
    );
  }

  return <RoundDetailsPageView round={round} currentUser={user} status={status} onGoBack={handleGoBack} onTap={handleTap} />;
}; 