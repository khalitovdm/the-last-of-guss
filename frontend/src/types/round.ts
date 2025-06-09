import { User } from '@/store/authStore';

export type RoundStatus = 'COOLDOWN' | 'ACTIVE' | 'COMPLETED';

export interface PlayerScore {
  userId: number;
  score: number;
}

export interface Round {
  id: number;
  name?: string;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
  totalScore: number;
  winnerId?: number;
  winner?: User;
  playerScores: PlayerScore[];
  createdBy: User;
}

export interface PaginatedRounds {
  items: Round[];
  total: number;
  page: number;
  totalPages: number;
} 