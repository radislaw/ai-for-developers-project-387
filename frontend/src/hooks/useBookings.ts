import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createBooking, listUpcomingBookings } from '../api/bookings';
import type { CreateBookingPayload } from '../types';

export function useUpcomingBookings() {
  return useQuery({
    queryKey: ['upcomingBookings'],
    queryFn: listUpcomingBookings,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => createBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['upcomingBookings'] });
      queryClient.invalidateQueries({ queryKey: ['slots'] });
    },
  });
}