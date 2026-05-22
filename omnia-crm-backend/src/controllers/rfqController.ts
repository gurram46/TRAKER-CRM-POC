import { Request, Response } from 'express';
import { query } from '../config/db';
import { fetchLatestEmails, getEmailContent } from '../services/zohoService';
import { extractRFQFromEmail } from '../services/geminiService';
import {
  createRFQFromEmail,
  findLegacyRFQByRawEmail,
  findRFQBySourceMessageId,
  getEmailSourceMessageId,
  getMessageReceivedDate,
} from '../services/rfqEmailImportService';

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
    const skipped = [];

    for (const msg of messages) {
      const sourceMessageId = getEmailSourceMessageId(accountId, msg);
      if (!sourceMessageId) {
        skipped.push({ reason: 'missing_message_id', message: msg });
        continue;
      }

      const existingRFQ = await findRFQBySourceMessageId(sourceMessageId);
      if (existingRFQ) {
        skipped.push({
          reason: 'already_imported',
          messageId: msg.messageId,
          rfq_number: existingRFQ.rfq_number,
        });
        continue;
      }

      const content = await getEmailContent(accountId, msg.folderId, msg.messageId);
      const sourceReceivedAt = getMessageReceivedDate(msg);
      const legacyRFQ = await findLegacyRFQByRawEmail(content, sourceMessageId, sourceReceivedAt);
      if (legacyRFQ) {
        skipped.push({
          reason: 'already_imported_legacy_match',
          messageId: msg.messageId,
          rfq_number: legacyRFQ.rfq_number,
        });
        continue;
      }

      const extractedData = await extractRFQFromEmail(content);
      const createdRFQ = await createRFQFromEmail(
        extractedData,
        content,
        sourceMessageId,
        sourceReceivedAt
      );

      if (createdRFQ) {
        createdRFQs.push(createdRFQ);
      } else {
        skipped.push({ reason: 'already_imported', messageId: msg.messageId });
      }
    }
    
    res.json({
      success: true,
      createdCount: createdRFQs.length,
      skippedCount: skipped.length,
      data: createdRFQs,
      skipped,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
