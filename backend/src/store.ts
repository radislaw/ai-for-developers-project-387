import { Booking, EventType, Owner } from './types.js';

export const owner: Owner = {
  id: 'owner-1',
  name: 'Tota',
  title: 'Host',
  timezone: 'Europe/Moscow',
};

export const eventTypes: EventType[] = [
  {
    id: 'evt-15min',
    title: 'Встреча 15 минут',
    description: 'Короткая встреча для быстрого обсуждения.',
    durationMinutes: 15,
  },
  {
    id: 'evt-30min',
    title: 'Встреча 30 минут',
    description: 'Стандартная встреча для подробного обсуждения.',
    durationMinutes: 30,
  },
];

export const bookings: Booking[] = [];
