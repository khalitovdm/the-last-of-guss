import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { UseFormReturn, SubmitHandler } from 'react-hook-form';
import { LoginSchema } from './LoginPage';
import { PageLayout } from '@/components/PageLayout';
import gooseImage from '@/assets/guss.png';

interface LoginPageViewProps {
  form: UseFormReturn<LoginSchema>;
  onSubmit: SubmitHandler<LoginSchema>;
  isLoading: boolean;
  error: string | null;
}

export const LoginPageView = ({ form, onSubmit, isLoading, error }: LoginPageViewProps) => {
  const { register, handleSubmit, formState: { errors } } = form;

  return (
    <PageLayout title="Вход в систему" titleAlign="center">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img src={gooseImage} alt="Guss" style={{ width: '60px', height: '60px', margin: '8px' }} />
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Имя пользователя"
            autoComplete="username"
            autoFocus
            disabled={isLoading}
            {...register('username')}
            error={!!errors.username}
            helperText={errors.username?.message || ' '}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Пароль"
            type="password"
            id="password"
            autoComplete="current-password"
            disabled={isLoading}
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message || ' '}
          />
          <Alert
            severity="error"
            sx={{
              width: '100%',
              visibility: error ? 'visible' : 'hidden',
            }}
          >
            {error || ' '}
          </Alert>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 1 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Войти'}
          </Button>
        </Box>
      </Box>
    </PageLayout>
  );
}; 