import { registerAs } from '@nestjs/config';

export interface GameConfig {
  roundDuration: number; // in minutes
  cooldownDuration: number; // in seconds
}

export const gameConfig = registerAs('game', (): GameConfig => {
  const roundDuration = parseInt(process.env.ROUND_DURATION || '60', 10);
  const cooldownDuration = parseInt(process.env.COOLDOWN_DURATION || '30', 10);

  if (isNaN(roundDuration) || roundDuration <= 0) {
    throw new Error('ROUND_DURATION must be a positive number');
  }

  if (isNaN(cooldownDuration) || cooldownDuration <= 0) {
    throw new Error('COOLDOWN_DURATION must be a positive number');
  }

  return {
    roundDuration,
    cooldownDuration,
  };
}); 