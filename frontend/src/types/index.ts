export interface Owner {
  id: string;
  name: string;
  title: string;
  timezone: string;
}

export interface EventType {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
}

export interface Slot {
  startAt: string;
  endAt: string;
  available: boolean;
  bookingId?: string;
}

export interface Booking {
  id: string;
  eventTypeId: string;
  guestName: string;
  guestEmail: string;
  guestNotes?: string;
  startAt: string;
  endAt: string;
  createdAt: string;
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: string;
}

export interface CreateBookingPayload {
  eventTypeId: string;
  guestName: string;
  guestEmail: string;
  guestNotes?: string;
  slotStartAt: string;
}