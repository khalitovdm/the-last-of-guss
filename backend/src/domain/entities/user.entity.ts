import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { PlayerScore } from './player-score.entity';

export enum UserRole {
  SURVIVOR = 'SURVIVOR',
  NIKITA = 'NIKITA',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class User {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ 
    description: 'Unique username. If username is "admin", role will be ADMIN. If username is "Никита", role will be NIKITA',
    example: 'player1'
  })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ 
    description: 'Hashed password',
    example: '$2b$10$...',
    writeOnly: true
  })
  @Column()
  password: string;

  @ApiProperty({ 
    description: 'User role that determines permissions',
    enum: UserRole,
    example: UserRole.SURVIVOR,
    default: UserRole.SURVIVOR
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.SURVIVOR,
  })
  role: UserRole;

  @ApiProperty({ 
    description: 'List of player scores in different rounds',
    type: () => [PlayerScore]
  })
  @OneToMany(() => PlayerScore, (playerScore) => playerScore.user)
  playerScores: PlayerScore[];

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