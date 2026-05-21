import { Request, Response } from 'express';
import { query } from '../config/db';
import { fetchLatestEmails, getEmailContent } from '../services/zohoService';
import { extractRFQFromEmail } from '../services/geminiService';

export const getAllRFQs = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await query('SELECT * FROM rfqs ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createRFQ = async (req: Request, res: Response): Promise<void> => {
  try {
    const { client_name, company, delivery_location, contact_number, items, required_by, special_requirements, status, source, raw_email } = req.body;
    const rfq_number = 'RFQ-' + Date.now();
    
    const result = await query(
      `INSERT INTO rfqs (rfq_number, client_name, company, delivery_location, contact_number, items, required_by, special_requirements, status, source, raw_email) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [rfq_number, client_name, company, delivery_location, contact_number, JSON.stringify(items || []), required_by || null, special_requirements, status || 'New', source || 'manual', raw_email]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getRFQById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM rfqs WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'RFQ not found' });
      return;
    }
    
    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const importFromEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { accountId, messages } = await fetchLatestEmails();
    const createdRFQs = [];

    for (const msg of messages) {
      const content = await getEmailContent(accountId, msg.folderId, msg.messageId);
      const extractedData = await extractRFQFromEmail(content);
      
      const rfq_number = 'RFQ-' + Date.now();
      const requiredByDate = extractedData.required_by && extractedData.required_by.trim() !== '' ? new Date(extractedData.required_by) : null;
      
      const insertResult = await query(
        `INSERT INTO rfqs (rfq_number, client_name, company, delivery_location, contact_number, items, required_by, special_requirements, source, raw_email, rfq_type, approved_makes, certifications, confidence_score, payment_terms, delivery_terms) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
        [
          rfq_number, 
          extractedData.client_name, 
          extractedData.company,
          extractedData.delivery_location,
          extractedData.contact_number, 
          JSON.stringify(extractedData.items || []), 
          requiredByDate, 
          extractedData.special_requirements, 
          'email', 
          content,
          extractedData.rfq_type || 'Simple RFQ',
          JSON.stringify(extractedData.approved_makes || []),
          JSON.stringify(extractedData.certifications || []),
          extractedData.confidence_score || 80,
          extractedData.payment_terms || null,
          extractedData.delivery_terms || null
        ]
      );
      
      createdRFQs.push(insertResult.rows[0]);
    }
    
    res.json(createdRFQs);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
