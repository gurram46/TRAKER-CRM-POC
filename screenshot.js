import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set viewport to be large enough to show the whole page
  await page.setViewport({ width: 1400, height: 1600 });
  
  // Navigate to Quotation Builder
  await page.goto('http://localhost:5179/quotation-builder', { waitUntil: 'networkidle2' });
  
  // Wait a moment for rendering
  await new Promise(r => setTimeout(r, 2000));
  
  // Take a screenshot of the specific document preview area
  const element = await page.$('#quotation-preview');
  if (element) {
    await element.screenshot({ path: 'format1_test.png' });
    console.log('Screenshot saved to format1_test.png');
  } else {
    console.log('Element #quotation-preview not found. Taking full page screenshot instead.');
    await page.screenshot({ path: 'format1_test_full.png', fullPage: true });
  }
  
  await browser.close();
})();
