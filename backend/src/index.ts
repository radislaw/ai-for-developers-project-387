import express from 'express';
import cors from 'cors';
import path from 'path';
import { ownerRouter } from './routes/owner.js';
import { eventTypesRouter } from './routes/eventTypes.js';
import { slotsRouter } from './routes/slots.js';
import { bookingsRouter } from './routes/bookings.js';

const app = express();
const PORT = process.env.PORT || 4010;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
}));
app.use(express.json());

app.use('/owner', ownerRouter);
app.use('/event-types', eventTypesRouter);
app.use('/event-types/:eventTypeId/slots', slotsRouter);
app.use('/bookings', bookingsRouter);

// In production, serve the bundled frontend (copied to ../public by Docker build).
// Dev uses the Vite dev server, so this block is skipped.
if (process.env.NODE_ENV === 'production') {
  const publicDir = path.join(__dirname, '..', 'public');
  app.use(express.static(publicDir));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
}

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Booking API running on port ${PORT}`);
});
