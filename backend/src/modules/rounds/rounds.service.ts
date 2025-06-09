import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, LessThanOrEqual } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Round } from '@domain/entities/round.entity';
import { PlayerScore } from '@domain/entities/player-score.entity';
import { User, UserRole } from '@domain/entities/user.entity';
import { CreateRoundDto } from './dto/create-round.dto';
import { IRoundStatus } from '@domain/interfaces/round.interface';
import { Interval } from '@nestjs/schedule';
import { GameConfig } from '@config/game.config';

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedRounds {
  items: Round[];
  total: number;
  page: number;
  totalPages: number;
}

@Injectable()
export class RoundsService {
  constructor(
    @InjectRepository(Round)
    private roundsRepository: Repository<Round>,
    @InjectRepository(PlayerScore)
    private playerScoresRepository: Repository<PlayerScore>,
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {}

  private calculateRoundTiming(): { startsAt: Date; endsAt: Date } {
    const config = this.configService.get<GameConfig>('game');
    const now = new Date();

    const startsAt = new Date(now.getTime() + config.cooldownDuration * 1000);

    const endsAt = new Date(startsAt.getTime() + config.roundDuration * 60 * 1000);
    
    return { startsAt, endsAt };
  }

  async create(createRoundDto: CreateRoundDto, user: User): Promise<Round> {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can create rounds');
    }

    let timing: { startsAt: Date; endsAt: Date };
    
    if (createRoundDto.useDefaultTiming) {
      timing = this.calculateRoundTiming();
    } else if (createRoundDto.startsAt && createRoundDto.endsAt) {
      timing = {
        startsAt: createRoundDto.startsAt,
        endsAt: createRoundDto.endsAt,
      };

      // Validate that end time is after start time
      if (timing.endsAt <= timing.startsAt) {
        throw new BadRequestException('End time must be after start time');
      }
    } else {
      throw new BadRequestException('Either provide both start and end times or set useDefaultTiming to true');
    }

    const round = this.roundsRepository.create({
      ...createRoundDto,
      ...timing,
      createdById: user.id,
      createdBy: user,
    });

    return this.roundsRepository.save(round);
  }

  private getRoundStatus(round: Round): IRoundStatus {
    const now = new Date();
    const status: IRoundStatus = {
      isActive: false,
      hasStarted: now >= round.startsAt,
      hasEnded: now >= round.endsAt,
    };

    status.isActive = status.hasStarted && !status.hasEnded;

    if (!status.hasStarted) {
      status.timeUntilStart = round.startsAt.getTime() - now.getTime();
    }
    if (!status.hasEnded) {
      status.timeUntilEnd = round.endsAt.getTime() - now.getTime();
    }

    return status;
  }

  async tap(roundId: string, user: User): Promise<PlayerScore> {
    const round = await this.roundsRepository.findOne({
      where: { id: roundId },
      relations: ['playerScores'],
    });

    if (!round) {
      throw new BadRequestException('Round not found');
    }

    const status = this.getRoundStatus(round);
    if (!status.isActive) {
      throw new BadRequestException('Round is not active');
    }

    return this.dataSource.transaction(async (manager) => {
      let playerScore = await manager.findOne(PlayerScore, {
        where: {
          userId: user.id,
          roundId: round.id,
        },
      });

      if (!playerScore) {
        playerScore = manager.create(PlayerScore, {
          userId: user.id,
          roundId: round.id,
          score: 0,
          tapCount: 0,
        });
      }

      playerScore.tapCount++;

      let additionalPoints = 0;
      if (user.role === UserRole.NIKITA) {
        playerScore.score = 0; // Никита не получает очков, см. требования
      } else {
        // Каждые 11 нажатий дают 10 очков, остальные 1
        additionalPoints = playerScore.tapCount % 11 === 0 ? 10 : 1;
        playerScore.score += additionalPoints;
      }

      await manager.save(PlayerScore, playerScore);

      await manager.increment(Round, { id: roundId }, 'totalScore', additionalPoints);

      return playerScore;
    });
  }

  private async determineWinner(round: Round): Promise<void> {
    const scores = await this.playerScoresRepository.find({
      where: { roundId: round.id },
      relations: ['user'],
      order: { score: 'DESC' },
    });

    if (scores.length > 0) {
      const winner = scores[0];
      round.winnerId = winner.userId;
      await this.roundsRepository.save(round);
    }
  }

  @Interval(10000)
  async checkFinishedRounds() {
    const now = new Date();

    const finishedRounds = await this.roundsRepository.find({
      where: {
        endsAt: LessThanOrEqual(now),
        winnerId: null,
      },
    });

    for (const round of finishedRounds) {
      await this.determineWinner(round);
    }
  }

  async findOne(id: string): Promise<Round> {
    const round = await this.roundsRepository.findOne({
      where: { id },
      relations: [
        'winner',
        'createdBy',
        'playerScores',
        'playerScores.user',
      ],
    });

    if (!round) {
      throw new BadRequestException('Round not found');
    }

    // Если раунд завершен, но победитель еще не определен,
    // ОДИН РАЗ пытаемся его определить и перезагружаем данные, чтобы избежать рекурсии.
    if (this.getRoundStatus(round).hasEnded && !round.winnerId) {
      await this.determineWinner(round);
      
      const updatedRound = await this.roundsRepository.findOne({
          where: { id },
          relations: [
              'winner',
              'createdBy',
              'playerScores',
              'playerScores.user',
          ],
      });
      // Возвращаем обновленные данные, или исходные, если что-то пошло не так
      return updatedRound || round;
    }

    return round;
  }

  async findAll(options: PaginationOptions = {}): Promise<PaginatedRounds> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const [items, total] = await this.roundsRepository.findAndCount({
      relations: ['winner', 'createdBy'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getStatus(id: string): Promise<IRoundStatus> {
    const round = await this.roundsRepository.findOne({
      where: { id },
    });

    if (!round) {
      throw new BadRequestException('Round not found');
    }

    return this.getRoundStatus(round);
  }
} 