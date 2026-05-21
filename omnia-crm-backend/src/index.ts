import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rfqRoutes from './routes/rfq';
import quotationRoutes from './routes/quotation';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.use('/api/rfqs', rfqRoutes);
app.use('/api/quotations', quotationRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
