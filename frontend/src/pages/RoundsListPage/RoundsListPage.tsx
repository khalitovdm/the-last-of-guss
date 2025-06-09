import { useRounds } from '@/hooks/useRounds';
import { useAuth } from '@/hooks/useAuth';
import { RoundsListPageView } from './RoundsListPageView';

const RoundsListPage = () => {
  const { rounds, isLoading, error, createRound } = useRounds();
  const { user, logout } = useAuth();

  return (
    <RoundsListPageView
      rounds={rounds}
      isLoading={isLoading}
      error={error}
      user={user}
      onCreateRound={createRound}
      onLogout={logout}
    />
  );
};

export default RoundsListPage; 