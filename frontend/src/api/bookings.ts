import { api } from './client';
import type { Booking, CreateBookingPayload } from '../types';

export const createBooking = async (payload: CreateBookingPayload): Promise<Booking> => {
  const response = await api.post<Booking>('/bookings', payload);
  return response.data;
};

export const listUpcomingBookings = async (): Promise<Booking[]> => {
  const response = await api.get<Booking[]>('/bookings/upcoming');
  return response.data;
};