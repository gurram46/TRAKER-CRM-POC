import React, { useState, useMemo } from 'react';
import { MessageCircle, Copy, ExternalLink, Check } from 'lucide-react';
import { rfqData } from '../data/dummyData';

const eventTypes = [
  'New Enquiry Acknowledgement',
  'Quotation Sent',
  'Dispatch Update',
  'Payment Reminder',
];

const WhatsAppGenerator: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState(eventTypes[0]);
  const [selectedRecordId, setSelectedRecordId] = useState(rfqData[0].id);
  const [copied, setCopied] = useState(false);

  const selectedRecord = useMemo(() => rfqData.find(r => r.id === selectedRecordId) || rfqData[0], [selectedRecordId]);

  const generatedMessage = useMemo(() => {
    switch (selectedEvent) {
      case 'New Enquiry Acknowledgement':
        return `Hello *${selectedRecord.client}*,\n\nThank you for your enquiry (*${selectedRecord.id}*) for ${selectedRecord.quantity} MT of ${selectedRecord.material}.\n\nOur team is currently reviewing the best rates for you. We will share a formal quotation shortly.\n\nRegards,\n*Omnia Steels Team*`;
      case 'Quotation Sent':
        return `Hello *${selectedRecord.client}*,\n\nPlease find the quotation attached for your enquiry (*${selectedRecord.id}*).\n\nMaterial: ${selectedRecord.material}\nQuantity: ${selectedRecord.quantity} MT\n\nLet us know if you have any questions or need to negotiate rates.\n\nRegards,\n*Omnia Steels Team*`;
      case 'Dispatch Update':
        return `Update for *${selectedRecord.client}*:\n\nYour order against ${selectedRecord.id} (${selectedRecord.material}) has been dispatched!\n\nThe vehicle details and tracking link will follow in a separate message.\n\nThank you for choosing Omnia Steels.`;
      case 'Payment Reminder':
        return `Dear *${selectedRecord.client}*,\n\nThis is a gentle reminder regarding the pending payment for order ${selectedRecord.id}.\n\nPlease clear the dues at your earliest convenience to avoid any delays in future dispatches.\n\nRegards,\n*Accounts Team, Omnia Steels*`;
      default:
        return '';
    }
  }, [selectedEvent, selectedRecord]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(generatedMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-4xl space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-display font-bold text-text-primary">WhatsApp Generator</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Form */}
        <div className="space-y-5 bg-bg-tertiary border border-border rounded-md shadow-card p-5">
          <h2 className="text-sm font-display font-bold text-text-primary uppercase tracking-wider mb-2">Message Configuration</h2>
          
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Event Type</label>
            <div className="space-y-2">
              {eventTypes.map(event => (
                <label key={event} className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-all duration-150 ${selectedEvent === event ? 'border-accent-primary bg-accent-primary/5' : 'border-border bg-bg-primary hover:border-border-accent'}`}>
                  <input 
                    type="radio" 
                    name="eventType" 
                    value={event} 
                    checked={selectedEvent === event}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="accent-accent-primary"
                  />
                  <span className={`text-sm font-body ${selectedEvent === event ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}>{event}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Select Record (Client/RFQ)</label>
            <select 
              value={selectedRecordId} 
              onChange={e => setSelectedRecordId(e.target.value)}
              className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary"
            >
              {rfqData.map(rfq => (
                <option key={rfq.id} value={rfq.id}>{rfq.client} — {rfq.id}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Preview */}
        <div className="bg-[#EFEAE2] dark:bg-[#0B141A] border border-border rounded-md shadow-card overflow-hidden flex flex-col relative h-[500px]">
          {/* Header */}
          <div className="bg-[#008069] dark:bg-[#202C33] text-white p-3 flex items-center gap-3 shadow-sm z-10">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold">{selectedRecord.client.substring(0, 2).toUpperCase()}</span>
            </div>
            <div>
              <div className="font-semibold text-[15px] leading-tight">{selectedRecord.client}</div>
              <div className="text-xs text-white/80">business account</div>
            </div>
          </div>

          {/* Chat BG */}
          <div className="flex-1 p-5 overflow-y-auto relative" style={{ backgroundImage: 'url("https://w0.peakpx.com/wallpaper/508/871/HD-wallpaper-whatsapp-background-texture-theme-whatsapp.jpg")', backgroundSize: 'cover', opacity: 0.9 }}>
            {/* Message Bubble */}
            <div className="max-w-[85%] ml-auto bg-[#D9FDD3] dark:bg-[#005C4B] rounded-lg rounded-tr-none p-3 shadow-sm relative text-[14.5px] font-body text-[#111B21] dark:text-[#E9EDEF] whitespace-pre-wrap leading-relaxed">
              {generatedMessage}
              <div className="text-[10px] text-[#667781] dark:text-[#8696A0] text-right mt-1 font-sans">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              {/* Bubble Tail */}
              <div className="absolute top-0 -right-2 w-0 h-0 border-l-[10px] border-l-[#D9FDD3] dark:border-l-[#005C4B] border-b-[10px] border-b-transparent border-t-0"></div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="bg-[#F0F2F5] dark:bg-[#202C33] p-3 border-t border-border flex items-center gap-2">
            <button 
              onClick={handleCopy}
              className="flex-1 flex justify-center items-center gap-2 bg-white dark:bg-[#2A3942] hover:bg-gray-50 dark:hover:bg-[#32454F] border border-border text-text-primary text-sm font-body font-medium px-4 py-2.5 rounded-md transition-colors"
            >
              {copied ? <Check size={16} className="text-status-success" /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
            <button 
              onClick={handleOpenWhatsApp}
              className="flex-1 flex justify-center items-center gap-2 bg-[#008069] hover:bg-[#01705C] text-white text-sm font-body font-medium px-4 py-2.5 rounded-md transition-colors"
            >
              <ExternalLink size={16} />
              Open Web
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppGenerator;
