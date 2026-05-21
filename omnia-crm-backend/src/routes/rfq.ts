import { Router } from 'express';
import { getAllRFQs, createRFQ, getRFQById, importFromEmail } from '../controllers/rfqController';

const router = Router();

router.get('/', getAllRFQs);
router.post('/', createRFQ);
router.get('/:id', getRFQById);
router.post('/import-email', importFromEmail);

export default router;
