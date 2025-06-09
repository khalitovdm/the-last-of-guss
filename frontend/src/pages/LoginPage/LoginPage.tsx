import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { LoginPageView } from './LoginPageView';

export const loginSchema = z.object({
  username: z.string().min(3, { message: 'Имя пользователя должно быть не менее 3 символов' }),
  password: z.string().min(6, { message: 'Пароль должен быть не менее 6 символов' }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { login, isLoading, error } = useAuth();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    await login(data);
  };

  return (
    <LoginPageView
      form={form}
      onSubmit={onSubmit}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default LoginPage; 