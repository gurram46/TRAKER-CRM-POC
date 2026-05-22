import { fetchLatestEmails, getEmailContent } from './zohoService';
import { extractRFQFromEmail } from './geminiService';
import { EventEmitter } from 'events';
import {
  createRFQFromEmail,
  findLegacyRFQByRawEmail,
  findRFQBySourceMessageId,
  getEmailSourceMessageId,
  getMessageReceivedDate,
} from './rfqEmailImportService';

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
          const sourceMessageId = getEmailSourceMessageId(accountId, msg);
          if (!sourceMessageId) {
            console.log('Skipping email without a Zoho messageId.');
            lastCheckedTime = Math.max(lastCheckedTime, msgTime);
            continue;
          }

          const existingRFQ = await findRFQBySourceMessageId(sourceMessageId);
          if (existingRFQ) {
            console.log(`Skipping already imported email ${msg.messageId} (${existingRFQ.rfq_number}).`);
            lastCheckedTime = Math.max(lastCheckedTime, msgTime);
            continue;
          }

          console.log(`Processing new email received at ${new Date(msgTime).toISOString()}`);
          const content = await getEmailContent(accountId, msg.folderId, msg.messageId);
          const sourceReceivedAt = getMessageReceivedDate(msg);
          const legacyRFQ = await findLegacyRFQByRawEmail(content, sourceMessageId, sourceReceivedAt);
          if (legacyRFQ) {
            console.log(`Skipping previously imported legacy email ${msg.messageId} (${legacyRFQ.rfq_number}).`);
            lastCheckedTime = Math.max(lastCheckedTime, msgTime);
            continue;
          }

          const extractedData = await extractRFQFromEmail(content);

          const createdRfq = await createRFQFromEmail(
            extractedData,
            content,
            sourceMessageId,
            sourceReceivedAt
          );

          if (!createdRfq) {
            console.log(`Email ${msg.messageId} was already imported by another request.`);
            lastCheckedTime = Math.max(lastCheckedTime, msgTime);
            continue;
          }

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
