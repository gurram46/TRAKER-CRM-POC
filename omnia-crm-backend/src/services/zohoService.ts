let cachedAccessToken: string | null = null;
let tokenExpiry: number = 0;

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
