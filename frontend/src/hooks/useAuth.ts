import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { smartLogin, logout as logoutService, AuthCredentials } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const navigate = useNavigate();
  const { isAuthenticated: isAuth, user, logout: logoutFromStore } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: AuthCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      await smartLogin(credentials);
      navigate('/rounds');
    } catch (err: any) {
      setError(err.message || 'Произошла неизвестная ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    logoutService();
    logoutFromStore();
    navigate('/login');
  };

  return {
    login,
    logout,
    isLoading,
    error,
    isAuthenticated: isAuth(),
    user,
  };
}; 