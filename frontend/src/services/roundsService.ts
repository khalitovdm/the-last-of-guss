import apiClient from './api';
import { Round, PaginatedRounds, PlayerScore } from '@/types/round';

export const getRounds = async (signal?: AbortSignal): Promise<PaginatedRounds> => {
  const { data } = await apiClient.get<PaginatedRounds>('/rounds', { signal });
  return data;
};

export const getRoundById = async (id: string, signal?: AbortSignal): Promise<Round> => {
  const { data } = await apiClient.get<Round>(`/rounds/${id}`, { signal });
  return data;
};

export const createRound = async (name?: string): Promise<Round> => {
  const { data } = await apiClient.post<Round>('/rounds', { name, useDefaultTiming: true });
  return data;
};

export const tap = async (roundId: string): Promise<PlayerScore> => {
  const { data } = await apiClient.post<PlayerScore>('/rounds/tap', { roundId });
  return data;
}; 