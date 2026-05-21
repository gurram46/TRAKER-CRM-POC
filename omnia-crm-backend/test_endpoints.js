const fs = require('fs');

async function testEndpoints() {
  console.log("Testing import-email...");
  try {
    const res1 = await fetch('http://localhost:3001/api/rfqs/import-email', { method: 'POST' });
    const data1 = await res1.json();
    console.log("Import-email success:", Array.isArray(data1) ? data1.length + " RFQs imported" : data1);
  } catch (err) {
    console.error("import-email failed:", err);
  }

  console.log("\\nTesting quotation generation...");
  try {
    const res2 = await fetch('http://localhost:3001/api/quotations/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rfq_id: 1,
        client_name: "Vijaya Constructions",
        items: [{ material: "HR Coil 2.5mm", qty: 50, rate: 50000 }],
        gst_percent: 18,
        freight: 2500,
        margin_percent: 12
      })
    });
    const data2 = await res2.json();
    if (data2.success) {
      console.log("Quotation success, PDF Base64 length:", data2.data.pdf_base64.length);
      fs.writeFileSync('test_quotation.pdf', Buffer.from(data2.data.pdf_base64, 'base64'));
      console.log("Saved test_quotation.pdf to disk.");
    } else {
      console.error("Quotation failed:", data2.error);
    }
  } catch (err) {
    console.error("quotation generation failed:", err);
  }
}

testEndpoints();
