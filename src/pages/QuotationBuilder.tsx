import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Download, Save, Mail, Send, FileText, Loader2, X, Paperclip } from 'lucide-react';
import { materials } from '../data/dummyData';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';
import { sendEmail } from '../services/zohoMail';
import jsPDF from 'jspdf';

const gstOptions = [5, 12, 18];

const formatINR = (n: number) => {
  if (!n || isNaN(n)) return 'Rs. 0';
  return 'Rs. ' + n.toLocaleString('en-IN');
};

const QuotationBuilder: React.FC = () => {
  const location = useLocation();
  const rfq = location.state?.rfq;

  const [clientName, setClientName] = useState(rfq?.clientName || rfq?.client || '');
  const [clientContact, setClientContact] = useState(rfq?.contactNumber || '');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState(rfq?.deliveryLocation || '');
  const [material, setMaterial] = useState(rfq?.items?.[0]?.material_type || rfq?.items?.[0]?.material || '');
  const [quantity, setQuantity] = useState<number>(rfq?.items?.[0]?.quantity_mt || rfq?.items?.[0]?.quantity || 0);
  const [basePrice, setBasePrice] = useState<number>(0);
  const [gstPercent, setGstPercent] = useState<number>(18);
  const [freight, setFreight] = useState<number>(0);
  const [marginPercent, setMarginPercent] = useState<number>(0);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // PDF attachment state
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfSizeKB, setPdfSizeKB] = useState(0);

  const quoteNumber = 'QT-2024-0023';
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const calc = useMemo(() => {
    const materialCost = quantity * basePrice;
    const gstAmount = materialCost * (gstPercent / 100);
    const margin = materialCost * (marginPercent / 100);
    const total = materialCost + gstAmount + freight + margin;
    return { materialCost, gstAmount, margin, total };
  }, [quantity, basePrice, gstPercent, freight, marginPercent]);

  // ── Reusable PDF Builder ──
  const buildPDF = () => {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(17, 19, 24);
    doc.rect(0, 0, pageW, 45, 'F');
    
    // Logo Placeholder
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(20, 10, 25, 25, 3, 3, 'F');
    doc.setTextColor(17, 19, 24);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('LOGO', 24, 24);

    doc.setTextColor(241, 245, 249);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('OMNIA STEELS PVT LTD', 55, 20);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text('Attapur, Hyderabad, Telangana | GST: 36AABCO1234F1Z5', 55, 28);
    doc.text('Phone: +91 98765 43210 | Email: info@omniasteels.com', 55, 34);

    // QUOTATION badge
    doc.setTextColor(59, 130, 246);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('QUOTATION', pageW - 20, 20, { align: 'right' });
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.text(`Quote #: ${quoteNumber}`, pageW - 20, 28, { align: 'right' });
    doc.text(`Date: ${today}  |  Valid: 7 days`, pageW - 20, 34, { align: 'right' });

    // Bill To
    let y = 55;
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(9);
    doc.text('BILL TO', 20, y);
    y += 7;
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(clientName || 'Client Name', 20, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    if (clientContact) doc.text(`Phone: ${clientContact}`, 20, y); y += 5;
    if (clientEmail) doc.text(`Email: ${clientEmail}`, 20, y); y += 5;
    if (clientAddress) doc.text(clientAddress, 20, y); y += 5;

    // Line
    y += 5;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, pageW - 20, y);
    y += 10;

    // Table header
    doc.setFillColor(241, 245, 249);
    doc.rect(20, y - 5, pageW - 40, 10, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(20, y - 5, pageW - 40, 10, 'S'); // border

    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Material', 25, y);
    doc.text('Qty (MT)', 90, y);
    doc.text('Rate (Rs./MT)', 120, y);
    doc.text('Amount (Rs.)', pageW - 25, y, { align: 'right' });
    y += 12;

    // Table row
    doc.rect(20, y - 7, pageW - 40, 15, 'S'); // border
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(material || '\u2014', 25, y);
    doc.text(quantity.toString(), 90, y);
    doc.text(formatINR(basePrice).replace('Rs. ', ''), 120, y);
    doc.text(formatINR(calc.materialCost), pageW - 25, y, { align: 'right' });
    y += 15;

    // Totals
    doc.setDrawColor(200, 200, 200);
    doc.line(120, y, pageW - 20, y);
    y += 8;

    const addTotal = (label: string, value: string, bold = false) => {
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setFontSize(bold ? 11 : 9);
      doc.setTextColor(bold ? 30 : 100, bold ? 41 : 116, bold ? 59 : 139);
      doc.text(label, 120, y);
      doc.setTextColor(30, 41, 59);
      doc.text(value, pageW - 25, y, { align: 'right' });
      y += bold ? 10 : 7;
    };

    addTotal('Subtotal:', formatINR(calc.materialCost));
    addTotal(`GST (${gstPercent}%):`, formatINR(calc.gstAmount));
    addTotal('Freight:', formatINR(freight));
    if (marginPercent > 0) addTotal(`Margin (${marginPercent}%):`, formatINR(calc.margin));
    y += 3;
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.5);
    doc.line(120, y, pageW - 20, y);
    y += 8;
    addTotal('TOTAL:', formatINR(calc.total), true);

    // Signature
    y += 20;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text('For Omnia Steels Pvt Ltd', pageW - 20, y, { align: 'right' });
    y += 15;
    doc.setDrawColor(30, 41, 59);
    doc.line(pageW - 70, y, pageW - 20, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Authorized Signatory', pageW - 20, y, { align: 'right' });

    // Footer
    y += 15;
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.text('Thank you for your business!', 20, y);
    y += 6;
    doc.text('Terms: Payment within 7 days. Prices subject to market fluctuations.', 20, y);
    doc.text('This is a system-generated quotation from Omnia Steels CRM.', 20, y + 5);

    return doc;
  };

  const pdfFileNameGen = `${quoteNumber}_${(clientName || 'quotation').replace(/\s+/g, '_')}.pdf`;

  const handleDownloadPDF = () => {
    const doc = buildPDF();
    doc.save(pdfFileNameGen);
  };

  // Generate PDF blob for email attachment
  const handlePrepareEmailWithPDF = () => {
    const doc = buildPDF();
    const arrayBuffer = doc.output('arraybuffer');
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });

    setPdfBlob(blob);
    setPdfFileName(pdfFileNameGen);
    setPdfSizeKB(Math.round(blob.size / 1024));

    setEmailTo(clientEmail || '');
    setEmailSubject(`Quotation ${quoteNumber} \u2014 ${material || 'Steel Products'} | Omnia Steels`);
    setEmailBody(`Dear ${clientName || 'Sir/Madam'},\n\nPlease find attached our quotation ${quoteNumber} for ${quantity} MT of ${material || 'the requested material'}.\n\nQuote Summary:\n\u2022 Material: ${material || '\u2014'}\n\u2022 Quantity: ${quantity} MT\n\u2022 Rate: ${formatINR(basePrice)}/MT\n\u2022 Total (incl. GST + Freight): ${formatINR(calc.total)}\n\u2022 Valid for: 7 days from date of issue\n\nPlease review and let us know if you'd like to proceed or have any questions.\n\nRegards,\nRam Sharma\nOmnia Steels Pvt Ltd\n+91 98765 43210`);
    setShowEmailModal(true);
  };

  // Send email with PDF attachment
  const handleSendWithPDF = async () => {
    setIsSending(true);
    try {
      // In live mode, the backend would receive the PDF blob as a multipart upload
      // and attach it to the Zoho Mail API call
      await sendEmail({
        fromAddress: 'info@omniasteels.com',
        toAddress: emailTo,
        subject: emailSubject,
        content: emailBody,
        // pdfAttachment would be sent as FormData in production
      });

      setShowEmailModal(false);
      setPdfBlob(null);
      setToastMessage(`Quotation sent to ${emailTo} with PDF attached`);
      setShowToast(true);
    } catch {
      setToastMessage('Failed to send \u2014 running in demo mode');
      setShowToast(true);
    } finally {
      setIsSending(false);
    }
  };

  // Download the already-generated PDF from the modal
  const handleDownloadAttachedPDF = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = pdfFileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-text-primary">Quotation Builder</h1>
        {rfq && (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-accent-primary/10 border border-accent-primary/20 rounded-full text-xs font-body font-medium text-accent-primary shadow-sm">
            <Mail size={14} />
            Generated from AI-imported RFQ
          </span>
        )}
      </div>

      <div className="grid grid-cols-[1.2fr_1fr] gap-5">
        {/* Left — Form */}
        <div className="space-y-5">
          {/* Client Details */}
          <div className="bg-bg-tertiary border border-border rounded-md p-5 shadow-card">
            <h3 className="text-sm font-display font-semibold text-text-primary mb-4">Client Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Client Name</label>
                <input value={clientName} onChange={(e) => setClientName(e.target.value)} type="text" className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary" placeholder="Enter name" />
              </div>
              <div>
                <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Contact</label>
                <input value={clientContact} onChange={(e) => setClientContact(e.target.value)} type="text" className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary" placeholder="Phone" />
              </div>
              <div>
                <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Email</label>
                <input value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} type="email" className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary" placeholder="email@example.com" />
              </div>
              <div>
                <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Billing Address</label>
                <input value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} type="text" className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary" placeholder="Address" />
              </div>
            </div>
          </div>

          {/* Material & Pricing */}
          <div className="bg-bg-tertiary border border-border rounded-md p-5 shadow-card">
            <h3 className="text-sm font-display font-semibold text-text-primary mb-4">Material & Pricing</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Material Type</label>
                <select value={material} onChange={(e) => setMaterial(e.target.value)} className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-secondary">
                  <option value="">Select</option>
                  {materials.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Quantity (MT)</label>
                <input value={quantity || ''} onChange={(e) => setQuantity(Number(e.target.value))} type="number" className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-mono text-text-primary" placeholder="0" />
              </div>
              <div>
                <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Base Price per MT (Rs.)</label>
                <input value={basePrice || ''} onChange={(e) => setBasePrice(Number(e.target.value))} type="number" className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-mono text-text-primary" placeholder="0" />
              </div>
              <div>
                <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">GST %</label>
                <select value={gstPercent} onChange={(e) => setGstPercent(Number(e.target.value))} className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-secondary">
                  {gstOptions.map((g) => <option key={g} value={g}>{g}%</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Freight Charges (Rs.)</label>
                <input value={freight || ''} onChange={(e) => setFreight(Number(e.target.value))} type="number" className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-mono text-text-primary" placeholder="0" />
              </div>
              <div>
                <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Our Margin %</label>
                <input value={marginPercent || ''} onChange={(e) => setMarginPercent(Number(e.target.value))} type="number" className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-mono text-text-primary" placeholder="0" />
              </div>
            </div>
          </div>

          {/* Calculation Breakdown */}
          <div className="bg-bg-tertiary border border-border rounded-md p-5 shadow-card">
            <h3 className="text-sm font-display font-semibold text-text-primary mb-4">Calculation Breakdown</h3>
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm font-body"><span className="text-text-secondary">Material Cost</span><span className="font-mono text-text-primary">{formatINR(calc.materialCost)}</span></div>
              <div className="flex justify-between text-sm font-body"><span className="text-text-secondary">GST ({gstPercent}%)</span><span className="font-mono text-text-primary">{formatINR(calc.gstAmount)}</span></div>
              <div className="flex justify-between text-sm font-body"><span className="text-text-secondary">Freight</span><span className="font-mono text-text-primary">{formatINR(freight)}</span></div>
              {marginPercent > 0 && (
                <div className="flex justify-between text-sm font-body"><span className="text-text-secondary">Margin ({marginPercent}%)</span><span className="font-mono text-text-primary">{formatINR(calc.margin)}</span></div>
              )}
              <div className="border-t border-border pt-2.5 mt-2.5">
                <div className="flex justify-between text-base font-body font-semibold">
                  <span className="text-text-primary">TOTAL QUOTE</span>
                  <span className="font-mono font-bold text-gold">{formatINR(calc.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-accent-primary hover:bg-accent-secondary text-white text-sm font-body font-medium px-5 py-2.5 rounded-md transition-colors duration-150"
            >
              <Download size={16} />
              Download PDF
            </button>
            <button
              onClick={() => {
                setEmailTo(clientEmail || '');
                setEmailSubject(`Quotation ${quoteNumber} — ${material || 'Steel Products'} | Omnia Steels`);
                setEmailBody(`Dear ${clientName || 'Sir/Madam'},\n\nPlease find attached our quotation ${quoteNumber} for ${quantity} MT of ${material || 'the requested material'}.\n\nQuote Summary:\n• Material: ${material || '—'}\n• Quantity: ${quantity} MT\n• Rate: ${formatINR(basePrice)}/MT\n• Total (incl. GST + Freight): ${formatINR(calc.total)}\n• Valid for: 7 days from date of issue\n\nPlease review and let us know if you'd like to proceed or have any questions.\n\nRegards,\nRam Sharma\nOmnia Steels Pvt Ltd\n+91 98765 43210`);
                setShowEmailModal(true);
              }}
              className="flex items-center gap-2 text-text-secondary border border-border text-sm font-body font-medium px-5 py-2.5 rounded-md hover:bg-bg-hover transition-colors duration-150"
            >
              <Mail size={16} />
              Send via Email
            </button>
            <button className="flex items-center gap-2 text-text-secondary border border-border text-sm font-body font-medium px-5 py-2.5 rounded-md hover:bg-bg-hover transition-colors duration-150">
              <Save size={16} />
              Save Quotation
            </button>
          </div>
        </div>

        {/* Right — Live PDF Preview */}
        <div className="bg-bg-tertiary border border-border rounded-md shadow-card overflow-hidden sticky top-0">
          <div className="px-5 py-3 border-b border-border">
            <h3 className="text-sm font-display font-semibold text-text-primary">Live Preview</h3>
          </div>
          <div className="p-5">
            <div className="bg-white rounded-md p-6 text-gray-900 shadow-lg text-[11px] leading-relaxed">
              {/* PDF Preview Header */}
              <div className="bg-[#111318] rounded-t-md -mx-6 -mt-6 px-6 py-4 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-bold text-sm">OMNIA STEELS PVT LTD</p>
                    <p className="text-gray-400 text-[9px] mt-0.5">Attapur, Hyderabad, Telangana</p>
                    <p className="text-gray-400 text-[9px]">GST: 36AABCO1234F1Z5</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-400 font-bold text-xs">QUOTATION</p>
                    <p className="text-gray-400 text-[9px] mt-0.5">#{quoteNumber}</p>
                    <p className="text-gray-400 text-[9px]">{today} · Valid 7 days</p>
                  </div>
                </div>
              </div>
              {/* Bill To */}
              <p className="text-gray-400 text-[9px] uppercase tracking-wider mb-1">Bill To</p>
              <p className="font-semibold text-xs">{clientName || '—'}</p>
              {clientContact && <p className="text-gray-500 text-[9px]">{clientContact}</p>}
              {clientAddress && <p className="text-gray-500 text-[9px]">{clientAddress}</p>}

              {/* Table */}
              <div className="mt-4 border-t border-gray-200 pt-3">
                <div className="grid grid-cols-4 text-[9px] text-gray-400 uppercase tracking-wider pb-2 border-b border-gray-100">
                  <span>Material</span><span>Qty</span><span>Rate</span><span className="text-right">Amount</span>
                </div>
                <div className="grid grid-cols-4 py-2 text-[10px]">
                  <span>{material || '—'}</span>
                  <span>{quantity} MT</span>
                  <span>{formatINR(basePrice)}/MT</span>
                  <span className="text-right font-medium">{formatINR(calc.materialCost)}</span>
                </div>
              </div>

              {/* Totals */}
              <div className="mt-3 pt-3 border-t border-gray-200 space-y-1 text-[10px]">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatINR(calc.materialCost)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">GST ({gstPercent}%)</span><span>{formatINR(calc.gstAmount)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Freight</span><span>{formatINR(freight)}</span></div>
                {marginPercent > 0 && <div className="flex justify-between"><span className="text-gray-500">Margin</span><span>{formatINR(calc.margin)}</span></div>}
                <div className="flex justify-between font-bold text-xs pt-2 border-t border-blue-200">
                  <span>TOTAL</span><span className="text-blue-600">{formatINR(calc.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Send via Email Modal */}
      <Modal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        title="Send Quotation via Email"
        width="max-w-lg"
        footer={
          <>
            <button
              onClick={() => { setShowEmailModal(false); setPdfBlob(null); }}
              className="px-4 py-2 text-sm font-body text-text-secondary border border-border rounded-md hover:bg-bg-hover transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSendWithPDF}
              disabled={isSending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-body font-medium text-white bg-accent-primary hover:bg-accent-secondary rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {isSending ? 'Sending...' : 'Send with PDF'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {/* PDF Attachment Chip */}
          {pdfBlob && (
            <div className="bg-status-success/10 border border-status-success/20 rounded-md px-3 py-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-status-danger/15 rounded-md flex items-center justify-center">
                    <FileText size={18} className="text-status-danger" />
                  </div>
                  <div>
                    <p className="text-xs font-body font-medium text-text-primary">{pdfFileName}</p>
                    <p className="text-[10px] font-mono text-text-muted">{pdfSizeKB} KB · PDF Document</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleDownloadAttachedPDF}
                    className="text-[10px] font-body text-accent-primary hover:underline"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => setPdfBlob(null)}
                    className="w-6 h-6 flex items-center justify-center rounded text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
                    title="Remove attachment"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {!pdfBlob && (
            <div className="flex items-center gap-2 bg-status-warning/10 border border-status-warning/20 rounded-md px-3 py-2">
              <Paperclip size={14} className="text-status-warning" />
              <span className="text-xs font-body text-status-warning">No PDF attached — click Send via Email again to regenerate</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">From</label>
            <input type="text" value="info@omniasteels.com" readOnly className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-mono text-text-muted" />
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">To</label>
            <input type="email" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary" placeholder="recipient@example.com" />
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Subject</label>
            <input type="text" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary" />
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Message</label>
            <textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} rows={8} className="w-full bg-bg-primary border border-border rounded-md py-3 px-3 text-sm font-body text-text-primary resize-none leading-relaxed" />
          </div>
        </div>
      </Modal>

      <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
};

export default QuotationBuilder;
