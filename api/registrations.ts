import { apiClient } from './client';
import { PaginatedResponse, Registration, Stats } from '../types';

export const fetchRegistrations = async (params: { eventId?: string; page?: number; limit?: number; q?: string }) => {
  const { data } = await apiClient.get<PaginatedResponse<Registration>>('/registrations', { params });
  return data;
};

export const fetchStats = async () => {
  const { data } = await apiClient.get<Stats>('/stats');
  return data;
};

export const checkInUser = async (qrCode: string) => {
  const { data } = await apiClient.post(`/checkin/${qrCode}`);
  return data;
};
