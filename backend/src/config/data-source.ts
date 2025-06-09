import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../domain/entities/user.entity';
import { Round } from '../domain/entities/round.entity';
import { PlayerScore } from '../domain/entities/player-score.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: [User, Round, PlayerScore],
  migrations: [__dirname + '/../migrations/*.{js,ts}'],
  subscribers: [],
}); 