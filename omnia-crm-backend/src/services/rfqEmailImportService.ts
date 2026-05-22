import { query } from '../config/db';
import { ExtractedEmailData } from '../types';

export interface ZohoMessageRef {
  messageId?: string;
  folderId?: string;
  receivedTime?: string | number;
  createdTime?: string | number;
  subject?: string;
  sender?: string;
  fromAddress?: string;
  summary?: string;
}

let schemaReady: Promise<void> | null = null;

export const ensureEmailImportSchema = async () => {
  if (!schemaReady) {
    schemaReady = (async () => {
      await query(`
        ALTER TABLE rfqs
        ADD COLUMN IF NOT EXISTS source_message_id TEXT,
        ADD COLUMN IF NOT EXISTS source_received_at TIMESTAMP,
        ADD COLUMN IF NOT EXISTS source_subject TEXT,
        ADD COLUMN IF NOT EXISTS source_sender TEXT,
        ADD COLUMN IF NOT EXISTS source_from_address TEXT,
        ADD COLUMN IF NOT EXISTS source_summary TEXT
      `);

      await query(`
        CREATE UNIQUE INDEX IF NOT EXISTS rfqs_source_message_id_unique
        ON rfqs (source_message_id)
        WHERE source_message_id IS NOT NULL
      `);
    })();
  }

  return schemaReady;
};

export const getEmailSourceMessageId = (accountId: string, msg: ZohoMessageRef) => {
  if (!msg.messageId) return null;
  return `zoho:${accountId}:${msg.folderId || 'unknown'}:${msg.messageId}`;
};

export const getMessageReceivedDate = (msg: ZohoMessageRef) => {
  const timestamp = Number(msg.receivedTime || msg.createdTime || 0);
  return timestamp > 0 ? new Date(timestamp) : null;
};

export const findRFQBySourceMessageId = async (sourceMessageId: string) => {
  await ensureEmailImportSchema();
  const result = await query('SELECT * FROM rfqs WHERE source_message_id = $1 LIMIT 1', [sourceMessageId]);
  return result.rows[0] || null;
};

export const updateRFQSourceMetadata = async (rfqId: number, message: ZohoMessageRef) => {
  await ensureEmailImportSchema();
  const result = await query(
    `UPDATE rfqs
     SET source_subject = COALESCE(source_subject, $1),
         source_sender = COALESCE(source_sender, $2),
         source_from_address = COALESCE(source_from_address, $3),
         source_summary = COALESCE(source_summary, $4)
     WHERE id = $5
     RETURNING *`,
    [
      message.subject || null,
      message.sender || null,
      message.fromAddress || null,
      message.summary || null,
      rfqId,
    ]
  );

  return result.rows[0] || null;
};

export const findLegacyRFQByRawEmail = async (
  rawEmail: string,
  sourceMessageId: string,
  sourceReceivedAt: Date | null
) => {
  await ensureEmailImportSchema();
  const result = await query('SELECT * FROM rfqs WHERE raw_email = $1 LIMIT 1', [rawEmail]);
  const existingRFQ = result.rows[0];

  if (!existingRFQ) return null;
  if (existingRFQ.source_message_id) return existingRFQ;

  const updatedResult = await query(
    `UPDATE rfqs
     SET source_message_id = $1, source_received_at = COALESCE(source_received_at, $2)
     WHERE id = $3
     RETURNING *`,
    [sourceMessageId, sourceReceivedAt, existingRFQ.id]
  );

  return updatedResult.rows[0] || existingRFQ;
};

export const createRFQFromEmail = async (
  extractedData: ExtractedEmailData,
  rawEmail: string,
  sourceMessageId: string,
  sourceReceivedAt: Date | null,
  message?: ZohoMessageRef
) => {
  await ensureEmailImportSchema();

  const rfqNumber = `RFQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const requiredByDate =
    extractedData.required_by && extractedData.required_by.trim() !== ''
      ? new Date(extractedData.required_by)
      : null;

  const insertResult = await query(
    `INSERT INTO rfqs (
      rfq_number, client_name, company, delivery_location, contact_number,
      items, required_by, special_requirements, source, raw_email,
      rfq_type, approved_makes, certifications, confidence_score,
      payment_terms, delivery_terms, source_message_id, source_received_at,
      source_subject, source_sender, source_from_address, source_summary
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
    ON CONFLICT (source_message_id) WHERE source_message_id IS NOT NULL DO NOTHING
    RETURNING *`,
    [
      rfqNumber,
      extractedData.client_name,
      extractedData.company,
      extractedData.delivery_location,
      extractedData.contact_number,
      JSON.stringify(extractedData.items || []),
      requiredByDate,
      extractedData.special_requirements,
      'email',
      rawEmail,
      extractedData.rfq_type || 'Simple RFQ',
      JSON.stringify(extractedData.approved_makes || []),
      JSON.stringify(extractedData.certifications || []),
      extractedData.confidence_score || 80,
      extractedData.payment_terms || null,
      extractedData.delivery_terms || null,
      sourceMessageId,
      sourceReceivedAt,
      message?.subject || null,
      message?.sender || null,
      message?.fromAddress || null,
      message?.summary || null,
    ]
  );

  return insertResult.rows[0] || null;
};
