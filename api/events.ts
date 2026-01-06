import { apiClient } from './client';
import { Event, PaginatedResponse } from '../types';

export const fetchEvents = async (params: { page?: number; limit?: number; q?: string; filter?: string; sort?: string }) => {
  const { data } = await apiClient.get<PaginatedResponse<Event>>('/events', { params });
  return data;
};

export const fetchEventById = async (id: string) => {
  const { data } = await apiClient.get<Event>(`/events/${id}`);
  return data;
};

export const registerForEvent = async (eventId: string, payload: { studentName: string; email: string; className: string }) => {
  const { data } = await apiClient.post(`/events/${eventId}/register`, payload);
  return data;
};