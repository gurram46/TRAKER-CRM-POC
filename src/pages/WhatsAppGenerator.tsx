import React, { useState, useMemo } from 'react';
import { Copy, ExternalLink, Check, Send, QrCode, Zap } from 'lucide-react';
import { rfqData, quotationData } from '../data/dummyData';

const eventTypes = [
  { id: 'enquiry', label: 'New Enquiry', sub: 'Notify team of incoming RFQ', icon: '📋' },
  { id: 'quotation', label: 'Quotation Sent', sub: 'Alert client quote is ready', icon: '📄' },
  { id: 'dispatch', label: 'Dispatch Update', sub: 'Share shipment tracking info', icon: '🚚' },
  { id: 'payment', label: 'Payment Reminder', sub: 'Chase overdue invoices', icon: '💳' },
];

const WhatsAppGenerator: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState(eventTypes[0]);
  const [selectedRecordId, setSelectedRecordId] = useState(rfqData[0].id);
  const [phone, setPhone] = useState('');
  const [copied, setCopied] = useState(false);

  const isQuotationEvent = selectedEvent.id === 'quotation';

  const rfqRecord = useMemo(() => rfqData.find(r => r.id === selectedRecordId) || rfqData[0], [selectedRecordId]);
  const quoteRecord = useMemo(() => quotationData[0], []);

  const selectedRecord = isQuotationEvent ? null : rfqRecord;

  const generatedMessage = useMemo(() => {
    switch (selectedEvent.id) {
      case 'enquiry':
        return `Hello *${rfqRecord.client}*,\n\nThank you for your enquiry (*${rfqRecord.id}*) for ${rfqRecord.quantity} MT of ${rfqRecord.material}.\n\nOur team is currently reviewing the best rates for you. We will share a formal quotation shortly.\n\nRegards,\n*Omnia Steels Team*`;
      case 'quotation':
        return `Quotation Ready – ${quoteRecord.id}\n– – – – – – – – – – – –\n*Client:* ${quoteRecord.client}\n*Project:* ${quoteRecord.project}\n*Quote Value:* ${quoteRecord.value}\n*Valid Until:* ${quoteRecord.validUntil}\n\nAwaiting your confirmation. Please revert at the earliest.\n\n– Omnia Steels`;
      case 'dispatch':
        return `Update for *${rfqRecord.client}*:\n\nYour order against ${rfqRecord.id} (${rfqRecord.material}) has been dispatched!\n\nThe vehicle details and tracking link will follow in a separate message.\n\nThank you for choosing Omnia Steels.`;
      case 'payment':
        return `Dear *${rfqRecord.client}*,\n\nThis is a gentle reminder regarding the pending payment for order ${rfqRecord.id}.\n\nPlease clear the dues at your earliest convenience to avoid any delays in future dispatches.\n\nRegards,\n*Accounts Team, Omnia Steels*`;
      default:
        return '';
    }
  }, [selectedEvent, rfqRecord, quoteRecord]);

  const displayName = isQuotationEvent ? quoteRecord.client : rfqRecord.client;
  const displayInitials = displayName.substring(0, 2).toUpperCase();

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSemiManual = () => {
    const url = phone
      ? `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(generatedMessage)}`
      : `https://wa.me/?text=${encodeURIComponent(generatedMessage)}`;
    window.open(url, '_blank');
  };

  const handleAutoSend = () => {
    const url = phone
      ? `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(generatedMessage)}`
      : `https://wa.me/?text=${encodeURIComponent(generatedMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">WhatsApp Generator</h1>
          <p className="text-sm text-text-secondary mt-0.5">Generate and send WhatsApp messages to clients</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left Panel */}
        <div className="w-80 flex-shrink-0 space-y-5">
          <div className="bg-bg-tertiary border border-border rounded-xl p-5 space-y-5">
            <h2 className="text-xs font-body font-bold text-text-muted uppercase tracking-widest">1 — Event Type</h2>
            <div className="space-y-2">
              {eventTypes.map(event => (
                <button key={event.id} onClick={() => setSelectedEvent(event)}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${selectedEvent.id === event.id ? 'border-accent-primary bg-accent-primary/8' : 'border-border bg-bg-primary hover:bg-bg-hover'}`}>
                  <span className="text-base mt-0.5">{event.icon}</span>
                  <div>
                    <p className={`text-sm font-body font-semibold ${selectedEvent.id === event.id ? 'text-text-primary' : 'text-text-secondary'}`}>{event.label}</p>
                    <p className="text-xs text-text-muted">{event.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-bg-tertiary border border-border rounded-xl p-5 space-y-4">
            <h2 className="text-xs font-body font-bold text-text-muted uppercase tracking-widest">2 — Select Record</h2>
            {isQuotationEvent ? (
              <select className="w-full bg-bg-primary border border-border rounded-lg py-2.5 px-3 text-sm font-body text-text-primary">
                {quotationData.map(q => (
                  <option key={q.id} value={q.id}>{q.id} – {q.client}</option>
                ))}
              </select>
            ) : (
              <select value={selectedRecordId} onChange={e => setSelectedRecordId(e.target.value)}
                className="w-full bg-bg-primary border border-border rounded-lg py-2.5 px-3 text-sm font-body text-text-primary">
                {rfqData.map(rfq => (
                  <option key={rfq.id} value={rfq.id}>{rfq.id} – {rfq.client}</option>
                ))}
              </select>
            )}

            <div>
              <h2 className="text-xs font-body font-bold text-text-muted uppercase tracking-widest mb-2">3 — Recipient Phone</h2>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210 (optional)"
                className="w-full bg-bg-primary border border-border rounded-lg py-2.5 px-3 text-sm font-body text-text-primary placeholder:text-text-muted" />
              <p className="text-[11px] text-text-muted mt-1">With number – opens their chat directly</p>
            </div>
          </div>
        </div>

        {/* Right Preview */}
        <div className="flex-1 flex flex-col gap-4">
          {/* WA Header */}
          <div className="bg-bg-tertiary border border-border rounded-xl overflow-hidden flex flex-col" style={{ height: '520px' }}>
            <div className="bg-[#008069] text-white px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                {displayInitials}
              </div>
              <div>
                <p className="font-semibold text-[15px] leading-tight">{displayName}</p>
                <p className="text-xs text-white/75">WhatsApp Business · online</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 bg-[#EFEAE2]">
              <div className="max-w-[85%] ml-auto bg-[#D9FDD3] rounded-xl rounded-tr-none p-3.5 shadow-sm relative">
                <p className="text-[14px] text-[#111B21] whitespace-pre-wrap leading-relaxed font-sans">{generatedMessage}</p>
                <p className="text-[10px] text-[#667781] text-right mt-1.5">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
                </p>
                <div className="absolute top-0 -right-2 w-0 h-0 border-l-[10px] border-l-[#D9FDD3] border-b-[10px] border-b-transparent" />
              </div>
            </div>

            {/* Action buttons */}
            <div className="bg-bg-secondary border-t border-border p-3 grid grid-cols-3 gap-2">
              <button onClick={handleCopy}
                className="flex items-center justify-center gap-1.5 bg-bg-primary border border-border hover:bg-bg-hover text-text-primary text-xs font-body font-medium py-2.5 rounded-lg transition-colors">
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy Message'}
              </button>
              <button onClick={handleSemiManual}
                className="flex items-center justify-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-body font-medium py-2.5 rounded-lg transition-colors">
                <Send size={14} />
                Send Semi-Manually
              </button>
              <button onClick={handleAutoSend}
                className="flex items-center justify-center gap-1.5 bg-[#008069] hover:bg-[#01705C] text-white text-xs font-body font-medium py-2.5 rounded-lg transition-colors">
                <Zap size={14} />
                Send Automatically
              </button>
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 bg-bg-tertiary border border-border hover:bg-bg-hover text-text-secondary text-sm font-body font-medium py-3 rounded-xl transition-colors">
              <QrCode size={16} />
              Scan QR Code
            </button>
            <button onClick={handleAutoSend}
              className="flex items-center justify-center gap-2 bg-[#1B4332] hover:bg-[#1a3d2e] text-white text-sm font-body font-medium py-3 rounded-xl transition-colors">
              <Zap size={16} />
              Auto Send via Twilio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppGenerator;
