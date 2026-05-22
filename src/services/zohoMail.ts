/**
 * Zoho Mail API Service Layer
 * ─────────────────────────────
 * This module provides a clean interface for Zoho Mail integration.
 *
 * ARCHITECTURE:
 * ┌──────────┐     ┌──────────────┐     ┌────────────────┐
 * │  CRM UI  │ ──▶ │  Backend API  │ ──▶ │  Zoho Mail API │
 * │ (React)  │     │  (Express/   │     │  (OAuth 2.0)   │
 * │          │ ◀── │   FastAPI)   │ ◀── │                │
 * └──────────┘     └──────────────┘     └────────────────┘
 *
 * WHY A BACKEND IS NEEDED:
 * 1. OAuth tokens (Client Secret) cannot be exposed in frontend code
 * 2. CORS — Zoho API doesn't allow browser-origin requests
 * 3. Token refresh logic must be handled server-side
 *
 * CURRENT STATE: Using mock implementations that simulate API responses.
 * TO GO LIVE: Replace the mock functions with real fetch() calls to YOUR backend.
 *
 * ZOHO MAIL API ENDPOINTS:
 * ─ Read Inbox:  GET  https://mail.zoho.in/api/accounts/{accountId}/messages?folderId={inboxId}
 * ─ Get Message: GET  https://mail.zoho.in/api/accounts/{accountId}/messages/{messageId}
 * ─ Send Email:  POST https://mail.zoho.in/api/accounts/{accountId}/messages
 * ─ Reply:       PUT  https://mail.zoho.in/api/accounts/{accountId}/messages/{messageId}
 *
 * REQUIRED OAUTH SCOPES:
 * ─ ZohoMail.messages.READ   (read inbox)
 * ─ ZohoMail.messages.CREATE (send email)
 * ─ ZohoMail.accounts.READ   (get account ID)
 *
 * ZOHO DATA CENTER DOMAINS:
 * ─ India: mail.zoho.in
 * ─ US:    mail.zoho.com
 * ─ EU:    mail.zoho.eu
 */

// ── Types ──

export interface ZohoEmail {
  messageId: string;
  folderId: string;
  from: string;
  fromAddress: string;
  to: string;
  toAddress: string;
  subject: string;
  content: string;        // HTML body
  summary: string;        // Plain text preview
  receivedTime: number;   // Unix timestamp (ms)
  sentDateInGMT: number;
  isRead: boolean;
  hasAttachment: boolean;
  flagid: string;         // "0" = none, "1" = starred
}

export interface ZohoSendPayload {
  fromAddress: string;
  toAddress: string;
  ccAddress?: string;
  bccAddress?: string;
  subject: string;
  content: string;        // HTML or plain text body
  mailFormat?: 'html' | 'plaintext';
  askReceipt?: 'yes' | 'no';
  attachments?: {
    fileName: string;
    contentType?: string;
    base64: string;
  }[];
}

export interface ZohoApiResponse<T> {
  status: { code: number; description: string };
  data: T;
}

// ── Configuration ──
// These would come from environment variables in production

const ZOHO_CONFIG = {
  // Your backend proxy URL — all Zoho API calls go through here
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api',

  // Zoho OAuth credentials (stored on backend, NOT here)
  // clientId: 'YOUR_ZOHO_CLIENT_ID',
  // clientSecret: 'YOUR_ZOHO_CLIENT_SECRET',

  // Zoho account details
  accountEmail: 'info@omniasteels.com',

  // Data center (India)
  zohoMailDomain: 'https://mail.zoho.in',
};

// ── API Service ──

/**
 * Check if we're in demo mode (no backend configured)
 */
const isDemoMode = (): boolean => {
  return !import.meta.env.VITE_BACKEND_URL;
};

const isEmailSendDemoMode = (): boolean => {
  return import.meta.env.VITE_EMAIL_SEND_DEMO === 'true';
};

/**
 * GET inbox emails from Zoho Mail
 * Backend endpoint: GET /api/zoho/inbox
 * Zoho API: GET /api/accounts/{accountId}/messages?folderId={inboxFolderId}&limit=25
 */
export async function fetchInbox(limit = 25): Promise<ZohoEmail[]> {
  if (isDemoMode()) {
    // Return mock data in demo mode
    return getMockInbox();
  }

  const res = await fetch(`${ZOHO_CONFIG.backendUrl}/zoho/inbox?limit=${limit}`);
  if (!res.ok) throw new Error(`Failed to fetch inbox: ${res.status}`);
  const json = await res.json();
  return json.data;
}

/**
 * GET a single email by ID
 * Backend endpoint: GET /api/zoho/messages/:messageId
 * Zoho API: GET /api/accounts/{accountId}/messages/{messageId}
 */
export async function fetchMessage(messageId: string): Promise<ZohoEmail> {
  if (isDemoMode()) {
    const inbox = getMockInbox();
    return inbox.find(e => e.messageId === messageId) || inbox[0];
  }

  const res = await fetch(`${ZOHO_CONFIG.backendUrl}/zoho/messages/${messageId}`);
  if (!res.ok) throw new Error(`Failed to fetch message: ${res.status}`);
  const json = await res.json();
  return json.data;
}

/**
 * SEND an email via Zoho Mail
 * Backend endpoint: POST /api/zoho/send
 * Zoho API: POST /api/accounts/{accountId}/messages
 */
export async function sendEmail(payload: ZohoSendPayload): Promise<{ messageId: string; success: boolean }> {
  if (isEmailSendDemoMode()) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return { messageId: `MOCK-${Date.now()}`, success: true };
  }

  const res = await fetch(`${ZOHO_CONFIG.backendUrl}/zoho/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to send email: ${res.status} ${errorText}`);
  }
  const json = await res.json();
  return {
    messageId: json.data?.messageId || json.data?.response?.data?.messageId || `ZOHO-${Date.now()}`,
    success: true,
  };
}

/**
 * REPLY to an email via Zoho Mail
 * Backend endpoint: PUT /api/zoho/messages/:messageId/reply
 * Zoho API: PUT /api/accounts/{accountId}/messages/{messageId}
 */
export async function replyToEmail(
  messageId: string,
  payload: ZohoSendPayload
): Promise<{ messageId: string; success: boolean }> {
  if (isDemoMode()) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { messageId: `MOCK-REPLY-${Date.now()}`, success: true };
  }

  const res = await fetch(`${ZOHO_CONFIG.backendUrl}/zoho/messages/${messageId}/reply`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Failed to reply: ${res.status}`);
  const json = await res.json();
  return json.data;
}

// ── Mock Data (for demo mode) ──

function getMockInbox(): ZohoEmail[] {
  const now = Date.now();
  return [
    {
      messageId: 'zm-001',
      folderId: 'inbox',
      from: 'Rajesh Gupta',
      fromAddress: 'rajesh@megabuilders.in',
      to: 'Omnia Steels',
      toAddress: 'info@omniasteels.com',
      subject: 'RE: Quotation for HR Coil — 50MT',
      content: '<p>Dear Sir,</p><p>Thank you for sharing the quotation. The rates look competitive. However, we would like to negotiate on the freight charges. Can we discuss this over a call?</p><p>Also, please confirm if you can deliver within 10 days of order confirmation.</p><p>Regards,<br/>Rajesh Gupta<br/>Mega Builders Pvt Ltd</p>',
      summary: 'Thank you for sharing the quotation. The rates look competitive...',
      receivedTime: now - 25 * 60 * 1000,
      sentDateInGMT: now - 25 * 60 * 1000,
      isRead: false,
      hasAttachment: false,
      flagid: '0',
    },
    {
      messageId: 'zm-002',
      folderId: 'inbox',
      from: 'Priya Sharma',
      fromAddress: 'procurement@shantiinfra.com',
      to: 'Omnia Steels',
      toAddress: 'info@omniasteels.com',
      subject: 'RE: TMT Bars — Order Confirmation',
      content: '<p>Hi Ram,</p><p>We are happy to confirm the order for 100 MT of TMT Bars at the agreed price of ₹58,000/MT.</p><p>Please share the proforma invoice and bank details for advance payment.</p><p>Delivery to: Plot 45, Shamshabad Industrial Area, Hyderabad.</p><p>Thanks,<br/>Priya Sharma<br/>Shanti Infrastructure Ltd</p>',
      summary: 'We are happy to confirm the order for 100 MT of TMT Bars...',
      receivedTime: now - 60 * 60 * 1000,
      sentDateInGMT: now - 60 * 60 * 1000,
      isRead: false,
      hasAttachment: false,
      flagid: '1',
    },
    {
      messageId: 'zm-003',
      folderId: 'inbox',
      from: 'Venkat Rao',
      fromAddress: 'venkat@sristeels.co.in',
      to: 'Omnia Steels',
      toAddress: 'info@omniasteels.com',
      subject: 'Urgent — CR Sheet delivery delay?',
      content: '<p>Namaskar,</p><p>We were expecting delivery of 30 MT CR Sheet by today but haven\'t received any update from the transporter. The project site is waiting for the material.</p><p>Can you please check and update us immediately?</p><p>Thanks,<br/>Venkat Rao</p>',
      summary: 'We were expecting delivery of 30 MT CR Sheet by today...',
      receivedTime: now - 3 * 60 * 60 * 1000,
      sentDateInGMT: now - 3 * 60 * 60 * 1000,
      isRead: true,
      hasAttachment: false,
      flagid: '0',
    },
    {
      messageId: 'zm-004',
      folderId: 'inbox',
      from: 'Anand Kumar',
      fromAddress: 'anand.k@nagarconstructions.in',
      to: 'Omnia Steels',
      toAddress: 'info@omniasteels.com',
      subject: 'Payment done — UTR attached',
      content: '<p>Dear Omnia Team,</p><p>We have transferred ₹3,67,500 via NEFT against invoice INV-2024-0079.</p><p>UTR Number: HDFC20241218004532</p><p>Please confirm receipt.</p><p>Regards,<br/>Anand Kumar<br/>Nagar Constructions</p>',
      summary: 'We have transferred ₹3,67,500 via NEFT against invoice...',
      receivedTime: now - 5 * 60 * 60 * 1000,
      sentDateInGMT: now - 5 * 60 * 60 * 1000,
      isRead: true,
      hasAttachment: true,
      flagid: '0',
    },
  ];
}

export { ZOHO_CONFIG };
