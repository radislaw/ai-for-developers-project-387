import { Router } from 'express';
import { owner } from '../store.js';

export const ownerRouter = Router();

ownerRouter.get('/', (_req, res) => {
  res.json(owner);
});
