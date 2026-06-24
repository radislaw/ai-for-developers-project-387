import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { bookings, eventTypes } from '../store.js';
import { Booking, CreateBookingBody } from '../types.js';

export const bookingsRouter = Router();

bookingsRouter.get('/upcoming', (_req, res) => {
  const now = new Date().toISOString();
  const upcoming = bookings
    .filter((b) => b.startAt >= now)
    .sort((a, b) => a.startAt.localeCompare(b.startAt));
  res.json(upcoming);
});

bookingsRouter.post('/', (req: Request, res: Response) => {
  const body = req.body as CreateBookingBody;

  if (!body.eventTypeId || !body.guestName || !body.guestEmail || !body.slotStartAt) {
    res.status(400).json({ code: 'BAD_REQUEST', message: 'Missing required fields' });
    return;
  }

  const eventType = eventTypes.find((e) => e.id === body.eventTypeId);
  if (!eventType) {
    res.status(404).json({ code: 'NOT_FOUND', message: 'Event type not found' });
    return;
  }

  const startAt = dayjs(body.slotStartAt).toISOString();
  const endAt = dayjs(body.slotStartAt).add(eventType.durationMinutes, 'minute').toISOString();

  const conflict = bookings.find(
    (b) => b.eventTypeId === body.eventTypeId && b.startAt === startAt,
  );
  if (conflict) {
    res.status(409).json({ code: 'CONFLICT', message: 'This slot is already booked' });
    return;
  }

  const booking: Booking = {
    id: uuidv4(),
    eventTypeId: body.eventTypeId,
    guestName: body.guestName,
    guestEmail: body.guestEmail,
    ...(body.guestNotes ? { guestNotes: body.guestNotes } : {}),
    startAt,
    endAt,
    createdAt: new Date().toISOString(),
  };

  bookings.push(booking);
  res.status(201).json(booking);
});
