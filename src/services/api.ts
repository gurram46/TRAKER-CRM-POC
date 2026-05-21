export const getAllRFQs = () => fetch('http://localhost:3001/api/rfqs').then(r => r.json());
export const importFromEmail = () => fetch('http://localhost:3001/api/rfqs/import-email', { method: 'POST' }).then(r => r.json());
