import { UserRole } from '../entities/user.entity';

export interface IUser {
  id: number;
  username: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserWithPassword extends IUser {
  password: string;
} 