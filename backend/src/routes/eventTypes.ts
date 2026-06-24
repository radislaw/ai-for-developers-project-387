import { Router, Request, Response } from 'express';
import { eventTypes } from '../store.js';
import { EventType } from '../types.js';

export const eventTypesRouter = Router();

eventTypesRouter.get('/', (_req, res) => {
  res.json(eventTypes);
});

eventTypesRouter.get('/:eventTypeId', (req: Request, res: Response) => {
  const et = eventTypes.find((e) => e.id === req.params.eventTypeId);
  if (!et) {
    res.status(404).json({ code: 'NOT_FOUND', message: 'Event type not found' });
    return;
  }
  res.json(et);
});

eventTypesRouter.post('/', (req: Request, res: Response) => {
  const body = req.body as EventType;
  if (!body.id || !body.title || !body.description || !body.durationMinutes) {
    res.status(400).json({ code: 'BAD_REQUEST', message: 'Missing required fields' });
    return;
  }
  if (eventTypes.find((e) => e.id === body.id)) {
    res.status(409).json({ code: 'CONFLICT', message: 'Event type with this id already exists' });
    return;
  }
  const newEventType: EventType = {
    id: body.id,
    title: body.title,
    description: body.description,
    durationMinutes: Number(body.durationMinutes),
  };
  eventTypes.push(newEventType);
  res.status(201).json(newEventType);
});
