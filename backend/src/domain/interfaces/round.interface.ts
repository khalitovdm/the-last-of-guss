import { IPlayerScore } from './player-score.interface';
import { IUser } from './user.interface';


export interface IRound {
  id: number;
  name?: string;
  startsAt: Date;
  endsAt: Date;
  playerScores: IPlayerScore[];
  winner?: IUser;
  createdBy: IUser;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRoundStatus {
  isActive: boolean;
  hasStarted: boolean;
  hasEnded: boolean;
  timeUntilStart?: number; // milliseconds
  timeUntilEnd?: number; // milliseconds
} 