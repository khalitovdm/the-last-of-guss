import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Unique } from 'typeorm';
import { User } from './user.entity';
import { Round } from './round.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('player_scores')
@Unique(['userId', 'roundId'])
export class PlayerScore {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ 
    description: 'ID of the player',
    example: 1
  })
  @Column()
  userId: number;

  @ApiProperty({ 
    description: 'ID of the round',
    example: '...'
  })
  @Column()
  roundId: string;

  @ApiProperty({ 
    description: 'Player details',
    type: () => User
  })
  @ManyToOne(() => User, (user) => user.playerScores)
  user: User;

  @ApiProperty({ 
    description: 'Round details',
    type: () => Round
  })
  @ManyToOne(() => Round, (round) => round.playerScores)
  round: Round;

  @ApiProperty({ 
    description: 'Total score in this round. Regular tap = 1 point, every 11th tap = 10 points. Always 0 for Никита',
    example: 25,
    default: 0
  })
  @Column({ default: 0 })
  score: number;

  @ApiProperty({ 
    description: 'Number of taps in this round',
    example: 15,
    default: 0
  })
  @Column({ default: 0 })
  tapCount: number;

  @ApiProperty({ 
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00Z'
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ 
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00Z'
  })
  @UpdateDateColumn()
  updatedAt: Date;
} 