import { useQuery } from '@tanstack/react-query';
import { listSlots } from '../api/slots';

export function useSlots(eventTypeId: string, from: string, to: string) {
  return useQuery({
    queryKey: ['slots', eventTypeId, from, to],
    queryFn: () => listSlots(eventTypeId, from, to),
    enabled: !!eventTypeId && !!from && !!to,
  });
}