import { Paper, Typography, Box, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Round } from '@/types/round';

const getRoundStatusText = (round: Round): string => {
  const now = new Date();
  const startsAt = new Date(round.startsAt);
  const endsAt = new Date(round.endsAt);
  if (now > endsAt) return 'Завершен';
  if (now >= startsAt && now <= endsAt) return 'Активен';
  return 'Cooldown';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(',', '');
};

export const RoundListItem = ({ round }: { round: Round }) => {
  const status = getRoundStatusText(round);

  return (
    <Paper
      component={RouterLink}
      to={`/rounds/${round.id}`}
      sx={{
        p: 3,
        textDecoration: 'none',
        border: '1px solid rgba(76, 175, 80, 0.4)',
        backgroundColor: 'rgba(0, 20, 0, 0.3)',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: 'text.primary',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 20px rgba(76, 175, 80, 0.4)',
          backgroundColor: 'rgba(0, 20, 0, 0.5)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%' }} />
        <Typography variant="body1">
          Round ID: {round.id}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ ml: 3, opacity: 0.8 }}>
        Start: {formatDate(round.startsAt)}
      </Typography>
      <Typography variant="body2" sx={{ ml: 3, opacity: 0.8, mb: 1 }}>
        End: {formatDate(round.endsAt)}
      </Typography>
      <Divider sx={{ my: 1, borderColor: 'rgba(76, 175, 80, 0.2)' }} />
      <Typography variant="body1" sx={{ mt: 1 }}>
        Статус: {status}
      </Typography>
    </Paper>
  );
}; 