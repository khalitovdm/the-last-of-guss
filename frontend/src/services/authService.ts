import apiClient from './api';
import { useAuthStore, User } from '@/store/authStore';

export interface AuthCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

const login = async (credentials: AuthCredentials): Promise<User> => {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', credentials);
  const token = data.access_token;

  const userPayload = JSON.parse(atob(token.split('.')[1]));
  const user: User = {
    id: userPayload.sub,
    username: userPayload.username,
    role: userPayload.role,
  };

  useAuthStore.getState().setToken(token);
  useAuthStore.getState().setUser(user);
  
  return user;
};

// smartLogin теперь просто синоним для login.
export const smartLogin = login;

export const logout = () => {
  useAuthStore.getState().logout();
}; 