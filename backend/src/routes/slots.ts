import { Router, Request, Response } from 'express';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import tz from 'dayjs/plugin/timezone.js';
import { eventTypes, bookings, owner } from '../store.js';
import { Slot } from '../types.js';

dayjs.extend(utc);
dayjs.extend(tz);

export const slotsRouter = Router({ mergeParams: true });

slotsRouter.get('/', (req: Request, res: Response) => {
  const { eventTypeId } = req.params;
  const { from, to } = req.query as { from?: string; to?: string };

  if (!from || !to) {
    res.status(400).json({ code: 'BAD_REQUEST', message: 'Query params "from" and "to" are required' });
    return;
  }

  const eventType = eventTypes.find((e) => e.id === eventTypeId);
  if (!eventType) {
    res.status(404).json({ code: 'NOT_FOUND', message: 'Event type not found' });
    return;
  }

  const ownerTz = owner.timezone;
  const fromDay = dayjs(from).tz(ownerTz).startOf('day');
  const toDay = dayjs(to).tz(ownerTz).endOf('day');

  if (!fromDay.isValid() || !toDay.isValid()) {
    res.status(400).json({ code: 'BAD_REQUEST', message: 'Invalid date format for "from" or "to"' });
    return;
  }

  const slots: Slot[] = [];
  let current = fromDay;

  while (current.isBefore(toDay)) {
    const dow = current.day(); // 0=Sun, 6=Sat
    if (dow !== 0 && dow !== 6) {
      let slotStart = current.hour(9).minute(0).second(0).millisecond(0);
      const dayEnd = current.hour(18).minute(0).second(0).millisecond(0);

      while (slotStart.isBefore(dayEnd)) {
        const slotEnd = slotStart.add(eventType.durationMinutes, 'minute');
        if (slotEnd.isAfter(dayEnd)) break;

        const startIso = slotStart.toISOString();
        const endIso = slotEnd.toISOString();

        const booking = bookings.find(
          (b) => b.eventTypeId === eventTypeId && b.startAt === startIso,
        );

        slots.push({
          startAt: startIso,
          endAt: endIso,
          available: !booking,
          ...(booking ? { bookingId: booking.id } : {}),
        });

        slotStart = slotEnd;
      }
    }
    current = current.add(1, 'day');
  }

  res.json(slots);
});
