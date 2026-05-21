const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function runTest() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('Navigating to Kanban board...');
  await page.goto('http://localhost:5178/', { waitUntil: 'networkidle0' });
  
  // Find the 'Import from Email' button and click it
  console.log('Clicking Import from Email...');
  const importBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Import from Email'));
  });
  if (importBtn) {
    await importBtn.click();
    // wait for toast
    await page.waitForSelector('.bg-status-success', { timeout: 10000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 1000));
  } else {
    console.log('Could not find Import button');
  }

  const outDir = 'C:\\Users\\sande\\.gemini\\antigravity\\brain\\1c972bba-457b-4f6f-ac44-cf6f5a37050c\\scratch';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const kanbanPath = path.join(outDir, 'kanban_board.png');
  await page.screenshot({ path: kanbanPath });
  console.log('Saved Kanban screenshot to', kanbanPath);

  // Navigate to Quotations page
  console.log('Navigating to Quotation Builder...');
  await page.goto('http://localhost:5178/quotations', { waitUntil: 'networkidle0' });
  
  const quotationPath = path.join(outDir, 'quotation_builder.png');
  await page.screenshot({ path: quotationPath });
  console.log('Saved Quotation screenshot to', quotationPath);

  await browser.close();
}

runTest().catch(console.error);
