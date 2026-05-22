import { fetchLatestEmails, getEmailContent } from './zohoService';
import { extractRFQFromEmail } from './geminiService';
import { EventEmitter } from 'events';
import {
  createRFQFromEmail,
  findLegacyRFQByRawEmail,
  findRFQBySourceMessageId,
  getEmailSourceMessageId,
  getMessageReceivedDate,
  updateRFQSourceMetadata,
} from './rfqEmailImportService';

export const rfqEventEmitter = new EventEmitter();

const POLL_INTERVAL_MS = 15 * 1000;
const STARTUP_LOOKBACK_MS = 30 * 60 * 1000;

// Start 30 minutes back so a backend restart does not miss recent RFQs.
let lastCheckedTime = Date.now() - STARTUP_LOOKBACK_MS;
let pollingTimer: NodeJS.Timeout | null = null;

export const pollZohoEmails = async () => {
  console.log(`Polling Zoho... ${new Date().toISOString()} lastChecked=${new Date(lastCheckedTime).toISOString()}`);
  try {
    const { accountId, messages } = await fetchLatestEmails();
    console.log(`Zoho returned ${messages.length} message(s).`);

    for (const msg of messages) {
      // Zoho's receivedTime is usually a numeric string representing milliseconds since epoch
      const msgTime = Number(msg.receivedTime || msg.createdTime || 0);
      const msgDate = msgTime > 0 ? new Date(msgTime).toISOString() : 'unknown';

      if (msgTime <= lastCheckedTime) {
        console.log(`Skipping old email ${msg.messageId}; received=${msgDate}.`);
        continue;
      }

      try {
        const sourceMessageId = getEmailSourceMessageId(accountId, msg);
        if (!sourceMessageId) {
          console.log('Skipping email without a Zoho messageId.');
          lastCheckedTime = Math.max(lastCheckedTime, msgTime);
          continue;
        }

            const existingRFQ = await findRFQBySourceMessageId(sourceMessageId);
            if (existingRFQ) {
              await updateRFQSourceMetadata(existingRFQ.id, msg);
              console.log(`Skipping already imported email ${msg.messageId} (${existingRFQ.rfq_number}).`);
              lastCheckedTime = Math.max(lastCheckedTime, msgTime);
              continue;
        }

        console.log(`Processing new email ${msg.messageId}; received=${msgDate}.`);
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
              sourceReceivedAt,
              msg
            );

        if (!createdRfq) {
          console.log(`Email ${msg.messageId} was already imported by another request.`);
          lastCheckedTime = Math.max(lastCheckedTime, msgTime);
          continue;
        }

        console.log(`Created RFQ ${createdRfq.rfq_number} automatically from polling.`);
        rfqEventEmitter.emit('new_rfq', createdRfq);
      } catch (error) {
        console.error(`Failed to process email ${msg.messageId}; skipping until a newer email arrives.`, error);
      } finally {
        lastCheckedTime = Math.max(lastCheckedTime, msgTime);
      }
    }
  } catch (error) {
    console.error('Error during email polling:', error);
  }
};

export const startEmailPolling = () => {
  if (pollingTimer) return;

  console.log('Email polling service started. Last checked time:', new Date(lastCheckedTime).toISOString());
  void pollZohoEmails();
  pollingTimer = setInterval(() => {
    void pollZohoEmails();
  }, POLL_INTERVAL_MS);
};
