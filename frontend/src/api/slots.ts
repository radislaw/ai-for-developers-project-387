import { api } from './client';
import type { Slot } from '../types';

export const listSlots = async (
  eventTypeId: string,
  from: string,
  to: string
): Promise<Slot[]> => {
  const response = await api.get<Slot[]>(`/event-types/${eventTypeId}/slots`, {
    params: { from, to },
  });
  return response.data;
};