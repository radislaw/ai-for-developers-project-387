import { api } from './client';
import type { EventType } from '../types';

export const listEventTypes = async (): Promise<EventType[]> => {
  const response = await api.get<EventType[]>('/event-types');
  return response.data;
};

export const getEventType = async (eventTypeId: string): Promise<EventType> => {
  const response = await api.get<EventType>(`/event-types/${eventTypeId}`);
  return response.data;
};

export const createEventType = async (eventType: Omit<EventType, 'id'>): Promise<EventType> => {
  const id = crypto.randomUUID();
  const response = await api.post<EventType>('/event-types', { ...eventType, id });
  return response.data;
};