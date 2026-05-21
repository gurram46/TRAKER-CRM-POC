import { query } from '../config/db';
import { fetchLatestEmails, getEmailContent } from './zohoService';
import { extractRFQFromEmail } from './geminiService';
import { EventEmitter } from 'events';

export const rfqEventEmitter = new EventEmitter();

// Store the last checked timestamp in memory
// Initialize to Date.now() minus a small buffer so it doesn't miss immediately arriving ones, or just Date.now()
let lastCheckedTime = Date.now();

export const startEmailPolling = () => {
  console.log('Email polling service started. Last checked time:', new Date(lastCheckedTime).toISOString());
  
  // Runs every 2 minutes (120,000 ms)
  setInterval(async () => {
    console.log('Polling for new emails...');
    try {
      const { accountId, messages } = await fetchLatestEmails();

      for (const msg of messages) {
        // Zoho's receivedTime is usually a numeric string representing milliseconds since epoch
        const msgTime = Number(msg.receivedTime || msg.createdTime || 0);
        
        if (msgTime > lastCheckedTime) {
          console.log(`Processing new email received at ${new Date(msgTime).toISOString()}`);
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
          
          const createdRfq = insertResult.rows[0];
          console.log(`Created RFQ ${createdRfq.rfq_number} automatically from polling.`);
          
          // Emit SSE notification to frontend
          rfqEventEmitter.emit('new_rfq', createdRfq);
          
          // Update lastCheckedTime
          lastCheckedTime = Math.max(lastCheckedTime, msgTime);
        }
      }
    } catch (error) {
      console.error('Error during email polling:', error);
    }
  }, 15 * 1000); // 15 seconds
};
