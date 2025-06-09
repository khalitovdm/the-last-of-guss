import { Test, TestingModule } from '@nestjs/testing';
import { RoundsService } from './rounds.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Round } from '@domain/entities/round.entity';
import { PlayerScore } from '@domain/entities/player-score.entity';
import { DataSource, Repository } from 'typeorm';
import { UserRole } from '@domain/entities/user.entity';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

describe('RoundsService', () => {
  let service: RoundsService;
  let roundsRepository: Repository<Round>;
  let playerScoresRepository: Repository<PlayerScore>;
  let dataSource: DataSource;

  const mockDataSource = {
    transaction: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      switch (key) {
        case 'game':
          return {
            roundDuration: 60,
            cooldownDuration: 30,
          };
        default:
          return null;
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoundsService,
        {
          provide: getRepositoryToken(Round),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(PlayerScore),
          useClass: Repository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<RoundsService>(RoundsService);
    roundsRepository = module.get<Repository<Round>>(getRepositoryToken(Round));
    playerScoresRepository = module.get<Repository<PlayerScore>>(getRepositoryToken(PlayerScore));
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw ForbiddenException if user is not admin', async () => {
      const user = { id: 1, role: UserRole.SURVIVOR };
      const dto = { name: 'Test Round', useDefaultTiming: true };

      await expect(service.create(dto, user as any)).rejects.toThrow(ForbiddenException);
    });

    it('should create round with default timing', async () => {
      const user = { id: 1, role: UserRole.ADMIN };
      const dto = { name: 'Test Round', useDefaultTiming: true };

      jest.spyOn(roundsRepository, 'create').mockReturnValue({} as Round);
      jest.spyOn(roundsRepository, 'save').mockResolvedValue({} as Round);

      await service.create(dto, user as any);

      expect(roundsRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Test Round',
        createdById: 1,
      }));
    });
  });

  describe('tap', () => {
    it('should throw BadRequestException if round is not found', async () => {
      jest.spyOn(roundsRepository, 'findOne').mockResolvedValue(null);
      const roundId = uuidv4();
      await expect(service.tap(roundId, { id: 1 } as any)).rejects.toThrow(BadRequestException);
    });

    it('should handle Никита role correctly', async () => {
      const user = { id: 1, role: UserRole.NIKITA };
      const roundId = uuidv4();
      const round = {
        id: roundId,
        startsAt: new Date(Date.now() - 1000),
        endsAt: new Date(Date.now() + 1000),
      };

      jest.spyOn(roundsRepository, 'findOne').mockResolvedValue(round as Round);
      mockDataSource.transaction.mockImplementation(cb => cb({ 
        findOne: () => null,
        create: () => ({ userId: 1, roundId: roundId, score: 0, tapCount: 0 }),
        save: (entity: any) => entity,
        increment: jest.fn(),
      }));

      const result = await service.tap(roundId, user as any);

      expect(result.score).toBe(0);
      expect(result.tapCount).toBe(1);
    });

    it('should give bonus points for 11th tap', async () => {
      const user = { id: 1, role: UserRole.SURVIVOR };
      const roundId = uuidv4();
      const round = {
        id: roundId,
        startsAt: new Date(Date.now() - 1000),
        endsAt: new Date(Date.now() + 1000),
      };

      jest.spyOn(roundsRepository, 'findOne').mockResolvedValue(round as Round);
      mockDataSource.transaction.mockImplementation(cb => cb({ 
        findOne: () => ({ userId: 1, roundId: roundId, score: 9, tapCount: 10 }),
        save: (entity: any) => entity,
        increment: jest.fn(),
      }));

      const result = await service.tap(roundId, user as any);

      expect(result.score).toBe(19); // 9 + 10 (bonus points)
      expect(result.tapCount).toBe(11);
    });
  });
}); 