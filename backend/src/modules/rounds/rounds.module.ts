import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Round } from '@domain/entities/round.entity';
import { PlayerScore } from '@domain/entities/player-score.entity';
import { RoundsService } from './rounds.service';
import { RoundsController } from './rounds.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Round, PlayerScore]),
  ],
  providers: [RoundsService],
  controllers: [RoundsController],
})
export class RoundsModule {} 