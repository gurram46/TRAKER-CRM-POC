import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rfqRoutes from './routes/rfq';
import quotationRoutes from './routes/quotation';

import { startEmailPolling, rfqEventEmitter } from './services/pollingService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// SSE endpoint
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send initial connected message
  res.write('data: {"type":"connected"}\n\n');

  const onNewRfq = (rfq: any) => {
    res.write(`data: ${JSON.stringify({ type: 'new_rfq', payload: rfq })}\n\n`);
  };

  rfqEventEmitter.on('new_rfq', onNewRfq);

  req.on('close', () => {
    rfqEventEmitter.off('new_rfq', onNewRfq);
  });
});

app.use('/api/rfqs', rfqRoutes);
app.use('/api/quotations', quotationRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  startEmailPolling();
});
