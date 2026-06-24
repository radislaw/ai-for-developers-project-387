import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listEventTypes, getEventType, createEventType } from '../api/eventTypes';

export function useEventTypes() {
  return useQuery({
    queryKey: ['eventTypes'],
    queryFn: listEventTypes,
    staleTime: 5 * 60 * 1000,
  });
}

export function useEventType(eventTypeId: string) {
  return useQuery({
    queryKey: ['eventType', eventTypeId],
    queryFn: () => getEventType(eventTypeId),
    enabled: !!eventTypeId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateEventType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEventType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventTypes'] });
    },
  });
}