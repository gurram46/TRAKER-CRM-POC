import { Router, Request, Response } from 'express';
import puppeteer from 'puppeteer';

const router = Router();

router.post('/generate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { rfq_id, client_name, items, gst_percent, freight, margin_percent } = req.body;

    let itemsHtml = '';
    let totalBase = 0;

    items.forEach((item: any, index: number) => {
      const amount = item.qty * item.rate;
      totalBase += amount;
      itemsHtml += `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.material}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${item.qty} MT</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${item.rate.toLocaleString('en-IN')}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${amount.toLocaleString('en-IN')}</td>
        </tr>
      `;
    });

    const marginAmount = totalBase * (margin_percent / 100);
    const subtotal = totalBase + marginAmount + freight;
    const gstAmount = subtotal * (gst_percent / 100);
    const grandTotal = subtotal + gstAmount;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Helvetica', 'Arial', sans-serif; color: #333; margin: 0; padding: 40px; }
          .header { text-align: center; border-bottom: 2px solid #0066FF; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { color: #0066FF; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 2px; }
          .header p { margin: 5px 0 0; font-size: 14px; color: #666; }
          .details { margin-bottom: 30px; display: flex; justify-content: space-between; }
          .details div { font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px; }
          th { background-color: #f8f9fa; font-weight: bold; padding: 12px 8px; border: 1px solid #ddd; text-align: left; }
          .summary { width: 350px; margin-left: auto; font-size: 14px; }
          .summary-row { display: flex; justify-content: space-between; padding: 6px 0; }
          .grand-total { font-size: 18px; font-weight: bold; border-top: 2px solid #333; padding-top: 10px; margin-top: 10px; }
          .footer { text-align: center; font-size: 12px; color: #999; position: absolute; bottom: 40px; width: calc(100% - 80px); border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Omnia Steels Pvt Ltd</h1>
          <p>Plot No. 45, Industrial Area, Attapur, Hyderabad, Telangana - 500048</p>
          <p>Email: info@omniasteels.com | Phone: +91 40 1234 5678</p>
        </div>
        
        <div class="details">
          <div>
            <strong>Quotation To:</strong><br/>
            ${client_name}<br/>
            Ref RFQ: ${rfq_id}
          </div>
          <div style="text-align: right;">
            <strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}<br/>
            <strong>Valid Until:</strong> ${new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString('en-IN')}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Material Description</th>
              <th style="text-align: right;">Quantity</th>
              <th style="text-align: right;">Rate / MT</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="summary">
          <div class="summary-row"><span>Base Value:</span> <span>₹${totalBase.toLocaleString('en-IN')}</span></div>
          <div class="summary-row"><span>Margin (${margin_percent}%):</span> <span>₹${marginAmount.toLocaleString('en-IN')}</span></div>
          <div class="summary-row"><span>Freight & Transport:</span> <span>₹${freight.toLocaleString('en-IN')}</span></div>
          <div class="summary-row" style="border-top: 1px dashed #ccc; padding-top: 10px; margin-top: 5px;"><span>Subtotal:</span> <span>₹${subtotal.toLocaleString('en-IN')}</span></div>
          <div class="summary-row"><span>GST (${gst_percent}%):</span> <span>₹${gstAmount.toLocaleString('en-IN')}</span></div>
          <div class="summary-row grand-total"><span style="color: #0066FF;">Grand Total:</span> <span style="color: #0066FF;">₹${grandTotal.toLocaleString('en-IN')}</span></div>
        </div>

        <div class="footer">
          This is a computer-generated quotation and does not require a physical signature.<br/>
          Terms & Conditions apply. Subject to Hyderabad jurisdiction.
        </div>
      </body>
      </html>
    `;

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    res.json({
      success: true,
      data: {
        pdf_base64: Buffer.from(pdfBuffer).toString('base64')
      }
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
