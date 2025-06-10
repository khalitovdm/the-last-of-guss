import React, { useMemo } from 'react';
import { Box, Button, CircularProgress, Typography, Alert } from '@mui/material';
import { PageLayout } from '@/components/PageLayout';
import { RoundListItem } from '@/components/RoundListItem';
import { Round } from '@/types/round';
import { User } from '@/store/authStore';

interface RoundsListPageViewProps {
  rounds: Round[];
  isLoading: boolean;
  error: string | null;
  user: User | null;
  onCreateRound: () => void;
  onLogout: () => void;
}

export const RoundsListPageView = ({
  rounds, isLoading, error, user, onCreateRound, onLogout
}: RoundsListPageViewProps) => {
    const isAdmin = user?.role === 'ADMIN';

    const headerContent = useMemo(() => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.primary',
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}
            >
              {user?.username}
            </Typography>
            <Button 
              variant="outlined" 
              onClick={onLogout} 
              size="small"
              sx={{
                borderColor: 'primary.main',
                color: 'text.primary',
                '&:hover': {
                  borderColor: 'text.primary',
                  backgroundColor: 'rgba(76, 175, 80, 0.1)',
                },
                fontFamily: 'inherit',
                textTransform: 'uppercase',
              }}
            >
                Выйти
            </Button>
        </Box>
    ), [user?.username, onLogout]);

  return (
    <PageLayout title="Список Раундов" headerContent={headerContent}>
      {isLoading ? (
         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress sx={{ color: 'primary.main' }} />
            <Typography sx={{ ml: 2, color: 'text.primary' }}>Загрузка раундов...</Typography>
         </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box>
          {isAdmin && (
            <Box sx={{ mb: 3 }}>
              <Button 
                variant="contained" 
                onClick={onCreateRound} 
                disabled={isLoading}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  fontFamily: 'inherit',
                  textTransform: 'uppercase',
                }}
              >
                  Создать раунд
              </Button>
            </Box>
          )}

          {rounds.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {rounds.map((round) => <RoundListItem key={round.id} round={round} />)}
            </Box>
          ) : (
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 4,
                border: '1px dashed rgba(76, 175, 80, 0.3)',
                borderRadius: 1,
                backgroundColor: 'rgba(76, 175, 80, 0.05)',
              }}
            >
              <Typography 
                align="center" 
                sx={{ 
                  color: 'text.secondary',
                  fontFamily: 'inherit',
                  textTransform: 'uppercase',
                  fontSize: '0.9rem',
                }}
              >
                Нет доступных раундов
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </PageLayout>
  );
}; 