import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { PlayerScore } from './player-score.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

@Entity('rounds')
export class Round {
  @ApiProperty({ description: 'Unique identifier', example: '...-...' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiPropertyOptional({ 
    description: 'Optional round name',
    example: 'Morning Rush'
  })
  @Column({ nullable: true })
  name?: string;

  @ApiProperty({ 
    description: 'Round start time. Must be after creation time + cooldown period',
    example: '2024-01-01T10:00:00Z'
  })
  @Column()
  @Type(() => Date)
  startsAt: Date;

  @ApiProperty({ 
    description: 'Round end time. Must be after start time',
    example: '2024-01-01T11:00:00Z'
  })
  @Column()
  @Type(() => Date)
  endsAt: Date;

  @ApiProperty({ 
    description: 'List of player scores in this round',
    type: () => [PlayerScore]
  })
  @OneToMany(() => PlayerScore, (playerScore) => playerScore.round)
  playerScores: PlayerScore[];

  @ApiPropertyOptional({ 
    description: 'ID of the winning player (set when round ends)',
    example: 1
  })
  @Column({ nullable: true })
  winnerId?: number;

  @ApiPropertyOptional({ 
    description: 'Winner details',
    type: () => User
  })
  @OneToOne(() => User)
  @JoinColumn()
  winner?: User;

  @ApiProperty({ 
    description: 'ID of the admin who created this round',
    example: 1
  })
  @Column()
  createdById: number;

  @ApiProperty({ 
    description: 'Total score of all players in this round',
    example: 100,
    default: 0
  })
  @Column({ default: 0 })
  totalScore: number;

  @ApiProperty({ 
    description: 'Admin who created this round',
    type: () => User
  })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @ApiProperty({ 
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00Z'
  })
  @CreateDateColumn()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ 
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00Z'
  })
  @UpdateDateColumn()
  @Type(() => Date)
  updatedAt: Date;
} 