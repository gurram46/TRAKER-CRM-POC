/**
 * Zoho Mail Backend Proxy — Express.js Blueprint
 * ────────────────────────────────────────────────
 * This is the backend server you need to run alongside your CRM.
 * It handles OAuth token management and proxies requests to Zoho Mail API.
 *
 * SETUP STEPS:
 * 1. Go to https://api-console.zoho.in/ → Create "Server-based Application"
 * 2. Set Authorized Redirect URI: http://localhost:3001/auth/zoho/callback
 * 3. Copy Client ID and Client Secret into .env
 * 4. Run: npm install express cors axios dotenv
 * 5. Run: node server/zohoProxy.js
 * 6. Visit http://localhost:3001/auth/zoho to authorize
 * 7. Set VITE_BACKEND_URL=http://localhost:3001/api in your CRM's .env
 *
 * ENVIRONMENT VARIABLES (.env):
 *   ZOHO_CLIENT_ID=1000.XXXXXXXXXX
 *   ZOHO_CLIENT_SECRET=XXXXXXXXXX
 *   ZOHO_REDIRECT_URI=http://localhost:3001/auth/zoho/callback
 *   ZOHO_ACCOUNT_ID=<your zoho account id>
 *   ZOHO_MAIL_DOMAIN=https://mail.zoho.in
 *   ZOHO_AUTH_DOMAIN=https://accounts.zoho.in
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:5174' }));
app.use(express.json());

// ── Token Storage (in production, use Redis/DB) ──
let tokens = {
  accessToken: null,
  refreshToken: null,
  expiresAt: 0,
};

const ZOHO = {
  clientId: process.env.ZOHO_CLIENT_ID,
  clientSecret: process.env.ZOHO_CLIENT_SECRET,
  redirectUri: process.env.ZOHO_REDIRECT_URI || 'http://localhost:3001/auth/zoho/callback',
  accountId: process.env.ZOHO_ACCOUNT_ID,
  mailDomain: process.env.ZOHO_MAIL_DOMAIN || 'https://mail.zoho.in',
  authDomain: process.env.ZOHO_AUTH_DOMAIN || 'https://accounts.zoho.in',
};

// ── OAuth Flow ──

// Step 1: Redirect user to Zoho authorization page
app.get('/auth/zoho', (req, res) => {
  const scopes = 'ZohoMail.messages.READ,ZohoMail.messages.CREATE,ZohoMail.accounts.READ';
  const authUrl = `${ZOHO.authDomain}/oauth/v2/auth?` +
    `scope=${scopes}&client_id=${ZOHO.clientId}&response_type=code` +
    `&redirect_uri=${encodeURIComponent(ZOHO.redirectUri)}&access_type=offline&prompt=consent`;
  res.redirect(authUrl);
});

// Step 2: Handle callback and exchange code for tokens
app.get('/auth/zoho/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: 'No authorization code' });

  try {
    const tokenRes = await axios.post(`${ZOHO.authDomain}/oauth/v2/token`, null, {
      params: {
        grant_type: 'authorization_code',
        client_id: ZOHO.clientId,
        client_secret: ZOHO.clientSecret,
        redirect_uri: ZOHO.redirectUri,
        code,
      },
    });

    tokens.accessToken = tokenRes.data.access_token;
    tokens.refreshToken = tokenRes.data.refresh_token;
    tokens.expiresAt = Date.now() + (tokenRes.data.expires_in * 1000);

    res.send('✅ Zoho Mail connected! You can close this tab and use the CRM.');
  } catch (err) {
    console.error('Token exchange failed:', err.response?.data || err.message);
    res.status(500).json({ error: 'Token exchange failed' });
  }
});

// ── Token Refresh ──
async function getValidToken() {
  if (Date.now() < tokens.expiresAt - 60000) {
    return tokens.accessToken; // Still valid
  }

  // Refresh the token
  const refreshRes = await axios.post(`${ZOHO.authDomain}/oauth/v2/token`, null, {
    params: {
      grant_type: 'refresh_token',
      client_id: ZOHO.clientId,
      client_secret: ZOHO.clientSecret,
      refresh_token: tokens.refreshToken,
    },
  });

  tokens.accessToken = refreshRes.data.access_token;
  tokens.expiresAt = Date.now() + (refreshRes.data.expires_in * 1000);
  return tokens.accessToken;
}

// ── Zoho API Helper ──
async function zohoRequest(method, path, data = null) {
  const token = await getValidToken();
  const url = `${ZOHO.mailDomain}/api/accounts/${ZOHO.accountId}${path}`;

  const config = {
    method,
    url,
    headers: { Authorization: `Zoho-oauthtoken ${token}` },
  };

  if (data) {
    config.headers['Content-Type'] = 'application/json';
    config.data = data;
  }

  const res = await axios(config);
  return res.data;
}

// ── API Endpoints (consumed by CRM frontend) ──

// GET /api/zoho/inbox — Fetch inbox emails
app.get('/api/zoho/inbox', async (req, res) => {
  try {
    const limit = req.query.limit || 25;
    // First get the inbox folder ID
    const folders = await zohoRequest('GET', '/folders');
    const inbox = folders.data.find(f => f.folderName === 'Inbox');
    if (!inbox) return res.status(404).json({ error: 'Inbox folder not found' });

    // Fetch messages from inbox
    const messages = await zohoRequest('GET', `/messages?folderId=${inbox.folderId}&limit=${limit}`);
    res.json({ data: messages.data });
  } catch (err) {
    console.error('Inbox fetch failed:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch inbox' });
  }
});

// GET /api/zoho/messages/:id — Fetch single message
app.get('/api/zoho/messages/:id', async (req, res) => {
  try {
    const message = await zohoRequest('GET', `/messages/${req.params.id}`);
    res.json({ data: message.data });
  } catch (err) {
    console.error('Message fetch failed:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
});

// POST /api/zoho/send — Send a new email
app.post('/api/zoho/send', async (req, res) => {
  try {
    const { fromAddress, toAddress, ccAddress, bccAddress, subject, content } = req.body;
    const result = await zohoRequest('POST', '/messages', {
      fromAddress: fromAddress || 'info@omniasteels.com',
      toAddress,
      ccAddress: ccAddress || '',
      bccAddress: bccAddress || '',
      subject,
      content,
      mailFormat: 'html',
    });
    res.json({ data: { messageId: result.data?.messageId, success: true } });
  } catch (err) {
    console.error('Send failed:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// PUT /api/zoho/messages/:id/reply — Reply to an email
app.put('/api/zoho/messages/:id/reply', async (req, res) => {
  try {
    const { toAddress, subject, content } = req.body;
    const result = await zohoRequest('PUT', `/messages/${req.params.id}`, {
      toAddress,
      subject,
      content,
      mailFormat: 'html',
      mode: 'reply',
    });
    res.json({ data: { messageId: result.data?.messageId, success: true } });
  } catch (err) {
    console.error('Reply failed:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to reply' });
  }
});

// GET /api/zoho/status — Check connection status
app.get('/api/zoho/status', (req, res) => {
  res.json({
    connected: !!tokens.accessToken,
    tokenValid: Date.now() < tokens.expiresAt,
    accountEmail: 'info@omniasteels.com',
  });
});

// ── Start Server ──
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 Zoho Mail Proxy running at http://localhost:${PORT}`);
  console.log(`📧 Connect Zoho Mail: http://localhost:${PORT}/auth/zoho\n`);
});
