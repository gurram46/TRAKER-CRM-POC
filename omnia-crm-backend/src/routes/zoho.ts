import { Router, Request, Response } from 'express';
import { sendZohoEmail } from '../services/zohoService';

const router = Router();

router.post('/send', async (req: Request, res: Response): Promise<void> => {
  try {
    const { toAddress, subject, content } = req.body;

    if (!toAddress || !subject || !content) {
      res.status(400).json({
        success: false,
        error: 'toAddress, subject, and content are required',
      });
      return;
    }

    const result = await sendZohoEmail(req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Zoho send failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send Zoho email',
    });
  }
});

export default router;
