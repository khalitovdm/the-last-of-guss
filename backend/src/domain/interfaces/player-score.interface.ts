import { IUser } from './user.interface';
import { IRound } from './round.interface';

export interface IPlayerScore {
  id: number;
  user: IUser;
  round: IRound;
  score: number;
  tapCount: number;
  createdAt: Date;
  updatedAt: Date;
} 