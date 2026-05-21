const API_BASE = 'http://localhost:3001';

export const getAllRFQs = async () => {
  const res = await fetch(`${API_BASE}/api/rfqs`);
  if (!res.ok) throw new Error(`Failed to fetch RFQs: ${res.status}`);
  return res.json();
};

export const importFromEmail = async () => {
  const res = await fetch(`${API_BASE}/api/rfqs/import-email`, { method: 'POST' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Import failed: ${res.status}`);
  return data;
};
