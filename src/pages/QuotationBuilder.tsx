import React, { useState, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Download, Save, Mail, Send, FileText, Loader2, X, Paperclip, Plus, Trash2 } from 'lucide-react';
import { materials } from '../data/dummyData';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';
import { sendEmail } from '../services/zohoMail';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Format1Document from '../components/quotation/Format1Document';
import Format2Document from '../components/quotation/Format2Document';
import Format3Document from '../components/quotation/Format3Document';
import { QuoteItem } from '../components/quotation/types';

const gstOptions = [5, 12, 18];

const formatINR = (n: number) => {
  if (!n || isNaN(n)) return '0.00';
  return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const QuotationBuilder: React.FC = () => {
  const location = useLocation();
  const rfq = location.state?.rfq;
  const printRef = useRef<HTMLDivElement>(null);

  const [clientName, setClientName] = useState(rfq?.clientName || rfq?.client || '');
  const [clientContact, setClientContact] = useState(rfq?.contactNumber || '');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState(rfq?.deliveryLocation || '');
  
  // Default items from RFQ or a single empty item
  const initialItems = rfq?.items?.map((item: any, idx: number) => ({
    id: String(idx + 1),
    material: item.material_type || item.material || '',
    quantity: item.quantity_mt || item.quantity || 0,
    basePrice: 0
  })) || [
    { id: '1', material: '', quantity: 0, basePrice: 0 }
  ];
  const [items, setItems] = useState<QuoteItem[]>(initialItems);
  
  const [gstPercent, setGstPercent] = useState<number>(18);
  const [freight, setFreight] = useState<number>(0);
  const [marginPercent, setMarginPercent] = useState<number>(0);
  
  const [format, setFormat] = useState<'simple' | 'lnt' | 'rail'>('lnt');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // PDF attachment state
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfSizeKB, setPdfSizeKB] = useState(0);

  // State for Format 2 Vendor Remarks
  const [vendorRemarks, setVendorRemarks] = useState<{rowNo: number, vendorRemark: string}[]>([]);

  const handleVendorRemarkChange = (rowNo: number, val: string) => {
    setVendorRemarks(prev => {
      const existing = prev.find(r => r.rowNo === rowNo);
      if (existing) {
        return prev.map(r => r.rowNo === rowNo ? { ...r, vendorRemark: val } : r);
      } else {
        return [...prev, { rowNo, vendorRemark: val }];
      }
    });
  };

  const quoteNumber = `QT-${new Date().getFullYear()}-${String(Math.floor(Math.random()*9000)+1000)}`;
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const calc = useMemo(() => {
    const materialCost = items.reduce((sum, item) => sum + (item.quantity * item.basePrice), 0);
    const gstAmount = materialCost * (gstPercent / 100);
    const margin = materialCost * (marginPercent / 100);
    const total = materialCost + gstAmount + freight + margin;
    return { materialCost, gstAmount, margin, total };
  }, [items, gstPercent, freight, marginPercent]);

  const pdfFileNameGen = `${quoteNumber}_${(clientName || 'quotation').replace(/\\s+/g, '_')}.pdf`;

  const generatePDFBlob = async (): Promise<Blob | null> => {
    if (!printRef.current) return null;
    setIsGeneratingPDF(true);

    const el = printRef.current;

    // Temporarily unlock overflow so html2canvas captures the full height
    const prevOverflow = el.style.overflow;
    const prevHeight = el.style.height;
    el.style.overflow = 'visible';
    el.style.height = 'auto';

    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollY: 0,
        windowHeight: el.scrollHeight,
        height: el.scrollHeight,
      });

      // Restore styles
      el.style.overflow = prevOverflow;
      el.style.height = prevHeight;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgHeightMM = (canvas.height * pageWidth) / canvas.width;

      let heightLeft = imgHeightMM;
      let pageTop = 0;

      pdf.addImage(imgData, 'PNG', 0, -pageTop, pageWidth, imgHeightMM);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        pageTop += pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, -pageTop, pageWidth, imgHeightMM);
        heightLeft -= pageHeight;
      }

      return pdf.output('blob');
    } catch (err) {
      // Restore styles even on error
      el.style.overflow = prevOverflow;
      el.style.height = prevHeight;
      console.error('Failed to generate PDF', err);
      return null;
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadPDF = async () => {
    const blob = await generatePDFBlob();
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = pdfFileNameGen;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handlePrepareEmailWithPDF = async () => {
    const blob = await generatePDFBlob();
    if (blob) {
      setPdfBlob(blob);
      setPdfFileName(pdfFileNameGen);
      setPdfSizeKB(Math.round(blob.size / 1024));
    }
    setEmailTo(clientEmail || '');
    setEmailSubject(`Quotation ${quoteNumber} — Steel Products | Omnia Steels`);
    setEmailBody(`Dear ${clientName || 'Sir/Madam'},\n\nPlease find attached our quotation ${quoteNumber}.\n\nQuote Summary:\n• Items: ${items.length}\n• Total (incl. GST + Freight): Rs. ${calc.total.toLocaleString()}\n• Valid for: 7 days from date of issue\n\nPlease review and let us know if you'd like to proceed or have any questions.\n\nRegards,\nRam Sharma\nOmnia Steels Pvt Ltd\n+91 98765 43210`);
    setShowEmailModal(true);
  };

  const handleSendWithPDF = async () => {
    setIsSending(true);
    try {
      await sendEmail({
        fromAddress: 'info@omniasteels.com',
        toAddress: emailTo,
        subject: emailSubject,
        content: emailBody,
      });

      setShowEmailModal(false);
      setPdfBlob(null);
      setToastMessage(`Quotation sent to ${emailTo} with PDF attached`);
      setShowToast(true);
    } catch {
      setToastMessage('Failed to send — running in demo mode');
      setShowToast(true);
    } finally {
      setIsSending(false);
    }
  };

  const handleDownloadAttachedPDF = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = pdfFileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddItem = () => {
    setItems([...items, { id: Date.now().toString(), material: '', quantity: 0, basePrice: 0 }]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const handleItemChange = (id: string, field: keyof QuoteItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const docProps = {
    rfqId: rfq?.id || '',
    clientName,
    clientAddress,
    clientContact,
    clientEmail,
    items,
    gstPercent,
    freight,
    marginPercent,
    calc,
    today,
    quoteNumber
  };

  const format2Items = items.map((item, index) => ({
    slNo: index + 1,
    description: item.material || '',
    uom: item.material ? 'MT' : '',
    qty: item.material ? (item.quantity ? Math.ceil(item.quantity) : '') : '',
    unitRate: item.basePrice > 0 ? item.basePrice : undefined
  }));

  const vendorInfo = {
    vendorName: clientName || '',
    contactPerson: '',
    contactNo: clientContact || '',
    contactMailId: clientEmail || ''
  };

  const format2Props = {
    items: format2Items,
    vendorInfo,
    freight,
    gstPercent,
    vendorRemarks,
    projectName: rfq?.deliveryLocation || clientAddress || 'Project Site',
    deliveryAddress: clientAddress || '',
    noteText: rfq?.approvedMakes?.length > 0 ? `Make shall be from ${rfq.approvedMakes.join(', ')} only` : undefined
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

      <div className="grid grid-cols-[1fr_1.5fr] gap-5 items-start">
        {/* Left — Form */}
        <div className="space-y-5 sticky top-5 max-h-[85vh] overflow-y-auto pr-2 pb-10 custom-scrollbar">
          <div className="bg-bg-tertiary border border-border rounded-md p-5 shadow-card">
            <h3 className="text-sm font-display font-semibold text-text-primary mb-4">Format</h3>
            <select value={format} onChange={(e) => setFormat(e.target.value as any)} className="w-full bg-bg-primary border border-border rounded-md py-2 px-3 text-sm">
              <option value="simple">Format 1 - Simple RFQ</option>
              <option value="lnt">Format 2 - L&T Techno Commercial</option>
              <option value="rail">Format 3 - Rail Inspection</option>
            </select>
          </div>

          <div className="bg-bg-tertiary border border-border rounded-md p-5 shadow-card">
            <h3 className="text-sm font-display font-semibold text-text-primary mb-4">Client Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Client Name</label>
                <input value={clientName} onChange={(e) => setClientName(e.target.value)} type="text" className="w-full bg-bg-primary border border-border rounded-md py-2 px-3 text-sm" placeholder="Enter name" />
              </div>
              <div>
                <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Contact</label>
                <input value={clientContact} onChange={(e) => setClientContact(e.target.value)} type="text" className="w-full bg-bg-primary border border-border rounded-md py-2 px-3 text-sm" placeholder="Phone" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Billing Address</label>
                <input value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} type="text" className="w-full bg-bg-primary border border-border rounded-md py-2 px-3 text-sm" placeholder="Address" />
              </div>
            </div>
          </div>

          <div className="bg-bg-tertiary border border-border rounded-md p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-display font-semibold text-text-primary">Pricing</h3>
              <button onClick={handleAddItem} className="flex items-center gap-1 text-xs text-accent-primary hover:underline">
                <Plus size={14} /> Add Item
              </button>
            </div>
            
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="p-4 bg-bg-primary border border-border rounded-md relative group">
                  <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {items.length > 1 && (
                      <button onClick={() => handleRemoveItem(item.id)} className="text-status-danger hover:bg-status-danger/10 p-1 rounded">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Material</label>
                      <select value={item.material} onChange={(e) => handleItemChange(item.id, 'material', e.target.value)} className="w-full bg-bg-tertiary border border-border rounded-md py-2 px-3 text-sm">
                        <option value="">Select or type</option>
                        {materials.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Qty (MT)</label>
                      <input value={item.quantity || ''} onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))} type="number" className="w-full bg-bg-tertiary border border-border rounded-md py-2 px-3 text-sm font-mono" />
                    </div>
                    <div>
                      <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Rate/MT (Rs)</label>
                      <input value={item.basePrice || ''} onChange={(e) => handleItemChange(item.id, 'basePrice', Number(e.target.value))} type="number" className="w-full bg-bg-tertiary border border-border rounded-md py-2 px-3 text-sm font-mono" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-5 grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Freight (Rs)</label>
                <input value={freight || ''} onChange={(e) => setFreight(Number(e.target.value))} type="number" className="w-full bg-bg-primary border border-border rounded-md py-2 px-3 text-sm font-mono" />
              </div>
              <div>
                <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">GST %</label>
                <select value={gstPercent} onChange={(e) => setGstPercent(Number(e.target.value))} className="w-full bg-bg-primary border border-border rounded-md py-2 px-3 text-sm">
                  {gstOptions.map(g => <option key={g} value={g}>{g}%</option>)}
                </select>
              </div>
            </div>

            <div className="border-t border-border pt-4 mt-4 space-y-2">
               <div className="flex justify-between text-sm"><span className="text-text-secondary">Subtotal</span><span className="font-mono">{formatINR(calc.materialCost)}</span></div>
               <div className="flex justify-between text-sm"><span className="text-text-secondary">Freight</span><span className="font-mono">{formatINR(freight)}</span></div>
               <div className="flex justify-between text-sm"><span className="text-text-secondary">GST ({gstPercent}%)</span><span className="font-mono">{formatINR(calc.gstAmount)}</span></div>
               <div className="flex justify-between text-base font-bold text-text-primary mt-2"><span className="text-text-primary">Total</span><span className="font-mono text-gold">{formatINR(calc.total)}</span></div>
            </div>
          </div>

          {format === 'lnt' && (
            <div className="bg-bg-tertiary border border-border rounded-md p-5 shadow-card">
              <h3 className="text-sm font-display font-semibold text-text-primary mb-4">Vendor Remarks (T&C)</h3>
              <div className="space-y-3">
                {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(rowNo => {
                  const titles = [
                    "Vendor Scope", "L&T Scope", "Price basis", "Price Validity", 
                    "Place of delivery", "Lead time", "Delivery Period", "Payment Terms", 
                    "PBG", "LD", "DLP", "Mode of Measurement", "Quantity Variation", "Price Variation"
                  ];
                  return (
                    <div key={rowNo}>
                      <label className="block text-[11px] font-body font-medium text-text-secondary mb-1">{rowNo}. {titles[rowNo-1]}</label>
                      <input
                        type="text"
                        className="w-full bg-bg-primary border border-border rounded-md py-1.5 px-3 text-sm"
                        placeholder="Remark..."
                        value={vendorRemarks.find(r => r.rowNo === rowNo)?.vendorRemark || ''}
                        onChange={(e) => handleVendorRemarkChange(rowNo, e.target.value)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="flex items-center justify-center gap-2 bg-accent-primary hover:bg-accent-secondary text-white text-sm font-body font-medium px-5 py-2.5 rounded-md transition-colors w-full disabled:opacity-50"
            >
              {isGeneratingPDF ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
            </button>
            <button
              onClick={handlePrepareEmailWithPDF}
              disabled={isGeneratingPDF}
              className="flex items-center justify-center gap-2 border border-border text-text-secondary text-sm font-body font-medium px-5 py-2.5 rounded-md hover:bg-bg-hover transition-colors w-full disabled:opacity-50"
            >
              <Mail size={16} />
              Email PDF
            </button>
          </div>
        </div>

        {/* Right — Document Preview */}
        <div className="overflow-auto bg-gray-100 rounded-md border border-border shadow-inner p-4 flex justify-center max-h-[85vh]">
          {/* We wrap the document in a ref to capture via html2canvas */}
          <div id="quotation-preview" ref={printRef} className="bg-white shadow-2xl shrink-0 overflow-hidden" style={{ width: '210mm' }}>
             {format === 'simple' && <Format1Document {...docProps} />}
             {format === 'lnt' && <Format2Document {...format2Props} />}
             {format === 'rail' && <Format3Document {...docProps} />}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        title="Send Quotation via Email"
        width="max-w-lg"
        footer={
          <>
            <button onClick={() => { setShowEmailModal(false); setPdfBlob(null); }} className="px-4 py-2 text-sm text-text-secondary border border-border rounded-md hover:bg-bg-hover">Cancel</button>
            <button onClick={handleSendWithPDF} disabled={isSending} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-accent-primary rounded-md disabled:opacity-50">
              {isSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} {isSending ? 'Sending...' : 'Send'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {pdfBlob && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <FileText className="text-red-500" />
                <div>
                  <p className="text-sm font-medium">{pdfFileName}</p>
                  <p className="text-xs text-gray-500">{pdfSizeKB} KB PDF Attached</p>
                </div>
              </div>
            </div>
          )}
          <div><label className="block text-xs mb-1">To</label><input type="email" value={emailTo} onChange={e=>setEmailTo(e.target.value)} className="w-full bg-white border border-border rounded-md p-2 text-sm" /></div>
          <div><label className="block text-xs mb-1">Subject</label><input type="text" value={emailSubject} onChange={e=>setEmailSubject(e.target.value)} className="w-full bg-white border border-border rounded-md p-2 text-sm" /></div>
          <div><label className="block text-xs mb-1">Body</label><textarea value={emailBody} onChange={e=>setEmailBody(e.target.value)} rows={6} className="w-full bg-white border border-border rounded-md p-2 text-sm whitespace-pre-wrap"></textarea></div>
        </div>
      </Modal>

      <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
};

export default QuotationBuilder;
