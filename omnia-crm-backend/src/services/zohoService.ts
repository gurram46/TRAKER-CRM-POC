let cachedAccessToken: string | null = null;
let tokenExpiry: number = 0;

interface ZohoSendPayload {
  fromAddress?: string;
  toAddress: string;
  ccAddress?: string;
  bccAddress?: string;
  subject: string;
  content: string;
  mailFormat?: 'html' | 'plaintext';
  askReceipt?: 'yes' | 'no';
  attachments?: {
    fileName: string;
    contentType?: string;
    base64: string;
  }[];
}

export const getAccessToken = async () => {
  if (cachedAccessToken && Date.now() < tokenExpiry) {
    return cachedAccessToken;
  }

  const { ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN } = process.env;
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: ZOHO_CLIENT_ID || '',
    client_secret: ZOHO_CLIENT_SECRET || '',
    refresh_token: ZOHO_REFRESH_TOKEN || ''
  });
  
  const response = await fetch(`https://accounts.zoho.in/oauth/v2/token?${params.toString()}`, {
    method: 'POST'
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('getAccessToken Error:', response.status, errorText);
    throw new Error(`Failed to get access token: ${response.status} ${errorText}`);
  }
  
  const data = await response.json();
  cachedAccessToken = data.access_token;
  tokenExpiry = Date.now() + ((data.expires_in || 3600) * 1000) - 60000;
  return cachedAccessToken;
};

export const fetchLatestEmails = async () => {
  const token = await getAccessToken();
  const domain = 'https://mail.zoho.in/api';
  const headers = { Authorization: `Zoho-oauthtoken ${token}` };

  const accountsRes = await fetch(`${domain}/accounts`, { headers });
  if (!accountsRes.ok) {
    const errorText = await accountsRes.text();
    console.error('fetchAccounts Error:', accountsRes.status, errorText);
    throw new Error(`Failed to fetch accounts: ${accountsRes.status} ${errorText}`);
  }
  
  const accountsData = await accountsRes.json();
  if (!accountsData.data || accountsData.data.length === 0) {
    throw new Error('No Zoho mail accounts found.');
  }
  
  const accountId = accountsData.data[0].accountId;

  const messagesRes = await fetch(`${domain}/accounts/${accountId}/messages/view?limit=5`, { headers });
  if (!messagesRes.ok) {
    const errorText = await messagesRes.text();
    console.error('fetchMessages Error:', messagesRes.status, errorText);
    throw new Error(`Failed to fetch messages: ${messagesRes.status} ${errorText}`);
  }
  
  const messagesData = await messagesRes.json();
  return { accountId, messages: messagesData.data || [] };
};

const getPrimaryAccount = async () => {
  const token = await getAccessToken();
  const domain = 'https://mail.zoho.in/api';
  const headers = { Authorization: `Zoho-oauthtoken ${token}` };

  const accountsRes = await fetch(`${domain}/accounts`, { headers });
  if (!accountsRes.ok) {
    const errorText = await accountsRes.text();
    console.error('fetchAccounts Error:', accountsRes.status, errorText);
    throw new Error(`Failed to fetch accounts: ${accountsRes.status} ${errorText}`);
  }

  const accountsData = await accountsRes.json();
  if (!accountsData.data || accountsData.data.length === 0) {
    throw new Error('No Zoho mail accounts found.');
  }

  return accountsData.data[0];
};

export const sendZohoEmail = async (payload: ZohoSendPayload) => {
  const token = await getAccessToken();
  const account = await getPrimaryAccount();
  const accountId = account.accountId;
  const domain = 'https://mail.zoho.in/api';
  const headers = {
    Authorization: `Zoho-oauthtoken ${token}`,
    'Content-Type': 'application/json',
  };

  const fromAddress =
    process.env.ZOHO_SEND_FROM ||
    account.primaryEmailAddress ||
    account.mailboxAddress ||
    account.emailAddress ||
    payload.fromAddress;

  if (!fromAddress) {
    throw new Error('No Zoho from address available. Set ZOHO_SEND_FROM in .env.');
  }

  const uploadedAttachments = [];
  for (const attachment of payload.attachments || []) {
    const fileBuffer = Buffer.from(attachment.base64, 'base64');
    if (fileBuffer.length === 0) {
      throw new Error(`Attachment ${attachment.fileName} is empty before upload.`);
    }

    const uploadUrl = `${domain}/accounts/${accountId}/messages/attachments?uploadType=multipart&isInline=false`;
    const boundary = `----omnia-crm-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const multipartHead = Buffer.from(
      `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="attach"; filename="${attachment.fileName.replace(/"/g, '')}"\r\n` +
        `Content-Type: ${attachment.contentType || 'application/octet-stream'}\r\n\r\n`,
      'utf8'
    );
    const multipartTail = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8');
    const multipartBody = Buffer.concat([multipartHead, fileBuffer, multipartTail]);

    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': String(multipartBody.length),
        Accept: 'application/json',
      },
      body: multipartBody,
    });

    const uploadText = await uploadResponse.text();
    let uploadData: any;
    try {
      uploadData = uploadText ? JSON.parse(uploadText) : {};
    } catch {
      uploadData = { raw: uploadText };
    }

    if (!uploadResponse.ok) {
      console.error('uploadZohoAttachment Error:', uploadResponse.status, uploadData);
      throw new Error(`Failed to upload Zoho attachment: ${uploadResponse.status} ${JSON.stringify(uploadData)}`);
    }

    const uploaded = Array.isArray(uploadData.data) ? uploadData.data[0] : uploadData.data;
    if (!uploaded?.storeName || !uploaded?.attachmentPath || !uploaded?.attachmentName) {
      throw new Error(`Zoho attachment upload returned an invalid response: ${JSON.stringify(uploadData)}`);
    }

    uploadedAttachments.push({
      storeName: uploaded.storeName,
      attachmentPath: uploaded.attachmentPath,
      attachmentName: uploaded.attachmentName,
    });
  }

  const response = await fetch(`${domain}/accounts/${accountId}/messages`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      fromAddress,
      toAddress: payload.toAddress,
      ccAddress: payload.ccAddress,
      bccAddress: payload.bccAddress,
      subject: payload.subject,
      content: payload.content,
      mailFormat: payload.mailFormat || 'plaintext',
      askReceipt: payload.askReceipt || 'no',
      ...(uploadedAttachments.length > 0 ? { attachments: uploadedAttachments } : {}),
    }),
  });

  const responseText = await response.text();
  let data: any;
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch {
    data = { raw: responseText };
  }

  if (!response.ok) {
    console.error('sendZohoEmail Error:', response.status, data);
    throw new Error(`Failed to send Zoho email: ${response.status} ${JSON.stringify(data)}`);
  }

  const messageId = data?.data?.messageId || data?.data?.messageIdString || data?.data?.[0]?.messageId || null;
  console.log(
    `Zoho email sent to ${payload.toAddress} from ${fromAddress}; attachments=${uploadedAttachments.length}; messageId=${messageId || 'unknown'}`
  );

  return {
    success: true,
    accountId,
    fromAddress,
    response: data,
    attachments: uploadedAttachments,
    messageId,
  };
};

export const getEmailContent = async (accountId: string, folderId: string, messageId: string) => {
  const token = await getAccessToken();
  const domain = 'https://mail.zoho.in/api';
  const headers = { Authorization: `Zoho-oauthtoken ${token}` };

  let url = `${domain}/accounts/${accountId}/messages/${messageId}?messageId=${messageId}`;
  console.log('Fetching email content from:', url);
  let response = await fetch(url, { headers });

  if (!response.ok) {
    const errorText1 = await response.text();
    console.error('First endpoint failed:', response.status, errorText1);
    
    url = `${domain}/accounts/${accountId}/folders/${folderId}/messages/${messageId}/content`;
    console.log('Fetching email content from (fallback):', url);
    response = await fetch(url, { headers });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('getEmailContent Error:', response.status, errorText);
      throw new Error(`Failed to fetch email content: ${response.status} ${errorText}`);
    }
  }
  
  const data = await response.json();
  return data.data?.content || data.data?.summary || JSON.stringify(data.data);
};
