import React, { useState, useCallback } from 'react';
import {
  Inbox, Send, Plus, Mail, Reply, Clock, Paperclip, Search,
  ChevronRight, Star, MailOpen, ArrowLeft, Loader2, Wifi, WifiOff,
} from 'lucide-react';
import Toast from '../components/ui/Toast';
import { sendEmail } from '../services/zohoMail';

// ── Dummy Communication Data ──

interface EmailMessage {
  id: string;
  from: string;
  fromEmail: string;
  to: string;
  toEmail: string;
  subject: string;
  body: string;
  date: string;
  time: string;
  isRead: boolean;
  isStarred: boolean;
  hasAttachment: boolean;
  type: 'received' | 'sent';
  tag?: 'RFQ' | 'Quotation' | 'Payment' | 'Logistics';
}

const inboxMessages: EmailMessage[] = [
  {
    id: 'MSG-001', from: 'Rajesh Gupta', fromEmail: 'rajesh@megabuilders.in',
    to: 'Omnia Steels', toEmail: 'info@omniasteels.com',
    subject: 'RE: Quotation for HR Coil — 50MT',
    body: 'Dear Sir,\n\nThank you for sharing the quotation. The rates look competitive. However, we would like to negotiate on the freight charges. Can we discuss this over a call?\n\nAlso, please confirm if you can deliver within 10 days of order confirmation.\n\nRegards,\nRajesh Gupta\nMega Builders Pvt Ltd',
    date: '2026-05-19', time: '2:45 PM', isRead: false, isStarred: false, hasAttachment: false, type: 'received', tag: 'Quotation',
  },
  {
    id: 'MSG-002', from: 'Priya Sharma', fromEmail: 'procurement@shantiinfra.com',
    to: 'Omnia Steels', toEmail: 'info@omniasteels.com',
    subject: 'RE: TMT Bars — Order Confirmation',
    body: 'Hi Ram,\n\nWe are happy to confirm the order for 100 MT of TMT Bars at the agreed price of ₹58,000/MT.\n\nPlease share the proforma invoice and bank details for advance payment.\n\nDelivery to: Plot 45, Shamshabad Industrial Area, Hyderabad.\n\nThanks,\nPriya Sharma\nShanti Infrastructure Ltd',
    date: '2026-05-19', time: '1:20 PM', isRead: false, isStarred: true, hasAttachment: false, type: 'received', tag: 'RFQ',
  },
  {
    id: 'MSG-003', from: 'Venkat Rao', fromEmail: 'venkat@sristeels.co.in',
    to: 'Omnia Steels', toEmail: 'info@omniasteels.com',
    subject: 'Urgent — CR Sheet delivery delay?',
    body: 'Namaskar,\n\nWe were expecting delivery of 30 MT CR Sheet by today but haven\'t received any update from the transporter. The project site is waiting for the material.\n\nCan you please check and update us immediately? This is getting very urgent.\n\nThanks,\nVenkat Rao',
    date: '2026-05-19', time: '11:05 AM', isRead: true, isStarred: false, hasAttachment: false, type: 'received', tag: 'Logistics',
  },
  {
    id: 'MSG-004', from: 'Anand Kumar', fromEmail: 'anand.k@nagarconstructions.in',
    to: 'Omnia Steels', toEmail: 'info@omniasteels.com',
    subject: 'Payment done — UTR attached',
    body: 'Dear Omnia Team,\n\nWe have transferred ₹3,67,500 via NEFT against invoice INV-2024-0079.\n\nUTR Number: HDFC20241218004532\n\nPlease confirm receipt and update the payment status.\n\nRegards,\nAnand Kumar\nNagar Constructions',
    date: '2026-05-18', time: '6:30 PM', isRead: true, isStarred: false, hasAttachment: true, type: 'received', tag: 'Payment',
  },
  {
    id: 'MSG-005', from: 'Vijaya Constructions', fromEmail: 'accounts@vijayaconstructions.in',
    to: 'Omnia Steels', toEmail: 'info@omniasteels.com',
    subject: 'RE: Payment Reminder — INV-2024-0089',
    body: 'Hi Ram,\n\nApologies for the delay. We are processing the payment this week. Will share the UTR by Thursday.\n\nThanks for your patience.\n\nRegards,\nAccounts Team\nVijaya Constructions',
    date: '2026-05-18', time: '4:15 PM', isRead: true, isStarred: false, hasAttachment: false, type: 'received', tag: 'Payment',
  },
];

const sentMessages: EmailMessage[] = [
  {
    id: 'SENT-001', from: 'Omnia Steels', fromEmail: 'info@omniasteels.com',
    to: 'Rajesh Gupta', toEmail: 'rajesh@megabuilders.in',
    subject: 'Quotation for HR Coil — 50MT | QT-2024-0024',
    body: 'Dear Mr. Rajesh,\n\nPlease find attached our quotation for 50 MT HR Coil as discussed.\n\nRate: ₹52,000/MT\nGST: 18%\nFreight: ₹15,000\nTotal: ₹31,83,000\n\nValid for 7 days from date of issue.\n\nLooking forward to your confirmation.\n\nRegards,\nRam Sharma\nOmnia Steels Pvt Ltd',
    date: '2026-05-18', time: '3:00 PM', isRead: true, isStarred: false, hasAttachment: true, type: 'sent', tag: 'Quotation',
  },
  {
    id: 'SENT-002', from: 'Omnia Steels', fromEmail: 'info@omniasteels.com',
    to: 'Priya Sharma', toEmail: 'procurement@shantiinfra.com',
    subject: 'RFQ Response — TMT Bars 100MT',
    body: 'Dear Ms. Priya,\n\nThank you for your enquiry. We can supply 100 MT of TMT Bars (Fe 500D) at ₹58,000/MT.\n\nDelivery timeline: 12-14 working days from order confirmation.\nPayment terms: 50% advance, 50% on delivery.\n\nPlease let us know if you\'d like to proceed.\n\nRegards,\nRam Sharma',
    date: '2026-05-18', time: '11:30 AM', isRead: true, isStarred: false, hasAttachment: false, type: 'sent', tag: 'RFQ',
  },
  {
    id: 'SENT-003', from: 'Omnia Steels', fromEmail: 'info@omniasteels.com',
    to: 'Vijaya Constructions', toEmail: 'accounts@vijayaconstructions.in',
    subject: 'Payment Reminder — INV-2024-0089 (₹6,24,000)',
    body: 'Dear Vijaya Constructions,\n\nThis is a friendly reminder regarding the pending payment for invoice INV-2024-0089 amounting to ₹6,24,000.\n\nDue Date: 2024-12-15\n\nKindly arrange the payment at your earliest convenience.\n\nRegards,\nRam Sharma\nOmnia Steels Pvt Ltd',
    date: '2026-05-17', time: '10:00 AM', isRead: true, isStarred: false, hasAttachment: false, type: 'sent', tag: 'Payment',
  },
  {
    id: 'SENT-004', from: 'Omnia Steels', fromEmail: 'info@omniasteels.com',
    to: 'Sri Sai Steels', toEmail: 'venkat@sristeels.co.in',
    subject: 'Delivery Update — SHP-2024-0032 (CR Sheet 30MT)',
    body: 'Dear Mr. Venkat,\n\nYour shipment SHP-2024-0032 for 30 MT CR Sheet is currently in transit.\n\nTransporter: AP Cargo Movers\nLast Location: Shadnagar Toll\nETA: Dec 20, 2024\n\nWe will keep you updated on the progress.\n\nRegards,\nRam Sharma',
    date: '2026-05-17', time: '9:15 AM', isRead: true, isStarred: false, hasAttachment: false, type: 'sent', tag: 'Logistics',
  },
];

const tagColors: Record<string, string> = {
  RFQ: 'bg-status-info/15 text-status-info border-status-info/20',
  Quotation: 'bg-accent-primary/15 text-accent-primary border-accent-primary/20',
  Payment: 'bg-status-warning/15 text-status-warning border-status-warning/20',
  Logistics: 'bg-status-success/15 text-status-success border-status-success/20',
};

type Tab = 'inbox' | 'sent';

const Communications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('inbox');
  const [selectedMessage, setSelectedMessage] = useState<EmailMessage | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Email sent successfully');
  const [isSending, setIsSending] = useState(false);

  // Compose form
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  const messages = activeTab === 'inbox' ? inboxMessages : sentMessages;
  const filteredMessages = searchQuery
    ? messages.filter(m =>
        m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.to.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  const unreadCount = inboxMessages.filter(m => !m.isRead).length;

  const handleReply = useCallback((msg: EmailMessage) => {
    setComposeTo(msg.fromEmail);
    setComposeSubject(`RE: ${msg.subject.replace(/^RE:\s*/i, '')}`);
    setComposeBody(`\n\n──────────\nOn ${msg.date} at ${msg.time}, ${msg.from} wrote:\n\n${msg.body}`);
    setShowCompose(true);
    setSelectedMessage(null);
  }, []);

  const handleSend = useCallback(async () => {
    setIsSending(true);
    try {
      await sendEmail({
        fromAddress: 'info@omniasteels.com',
        toAddress: composeTo,
        subject: composeSubject,
        content: composeBody,
      });
      setToastMessage(`Email sent to ${composeTo} successfully`);
      setShowCompose(false);
      setComposeTo('');
      setComposeSubject('');
      setComposeBody('');
      setShowToast(true);
    } catch (err) {
      setToastMessage('Failed to send — running in demo mode');
      setShowToast(true);
    } finally {
      setIsSending(false);
    }
  }, [composeTo, composeSubject, composeBody]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-display font-bold text-text-primary">Communications</h1>
          {unreadCount > 0 && (
            <span className="text-xs font-mono font-medium text-status-danger bg-status-danger/10 px-2.5 py-1 rounded-full border border-status-danger/20">
              {unreadCount} unread
            </span>
          )}
          <span className="flex items-center gap-1.5 text-[10px] font-mono text-text-muted bg-bg-hover px-2.5 py-1 rounded-full border border-border">
            <WifiOff size={10} className="text-status-warning" />
            Demo Mode
          </span>
        </div>
        <button
          onClick={() => {
            setShowCompose(true);
            setSelectedMessage(null);
            setComposeTo('');
            setComposeSubject('');
            setComposeBody('');
          }}
          className="flex items-center gap-2 bg-accent-primary hover:bg-accent-secondary text-white text-sm font-body font-medium px-4 py-2.5 rounded-md transition-colors duration-150"
        >
          <Plus size={16} />
          Compose Email
        </button>
      </div>

      {/* Tabs + Search */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 border-b border-border">
          <button
            onClick={() => { setActiveTab('inbox'); setSelectedMessage(null); }}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-body font-medium border-b-2 transition-all duration-150 -mb-px
              ${activeTab === 'inbox' ? 'text-accent-primary border-accent-primary' : 'text-text-secondary border-transparent hover:text-text-primary'}`}
          >
            <Inbox size={16} />
            Inbox
            {unreadCount > 0 && (
              <span className="w-5 h-5 bg-status-danger rounded-full text-[10px] font-mono text-white flex items-center justify-center">{unreadCount}</span>
            )}
          </button>
          <button
            onClick={() => { setActiveTab('sent'); setSelectedMessage(null); }}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-body font-medium border-b-2 transition-all duration-150 -mb-px
              ${activeTab === 'sent' ? 'text-accent-primary border-accent-primary' : 'text-text-secondary border-transparent hover:text-text-primary'}`}
          >
            <Send size={16} />
            Sent
          </button>
        </div>
        <div className="relative w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg-primary border border-border rounded-md py-2 pl-9 pr-4 text-sm font-body text-text-primary placeholder:text-text-muted transition-all duration-150"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-[1fr_1.2fr] gap-0 bg-bg-tertiary border border-border rounded-md shadow-card overflow-hidden min-h-[calc(100vh-280px)]">
        {/* Message List */}
        <div className="border-r border-border overflow-y-auto">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => { setSelectedMessage(msg); setShowCompose(false); }}
              className={`px-4 py-3.5 border-b border-border cursor-pointer transition-colors duration-150
                ${selectedMessage?.id === msg.id ? 'bg-accent-glow border-l-2 border-l-accent-primary' : 'hover:bg-bg-hover'}
                ${!msg.isRead && msg.type === 'received' ? 'bg-bg-secondary' : ''}`}
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {!msg.isRead && msg.type === 'received' && (
                    <span className="w-2 h-2 rounded-full bg-accent-primary flex-shrink-0" />
                  )}
                  <span className={`text-sm font-body truncate ${!msg.isRead && msg.type === 'received' ? 'font-semibold text-text-primary' : 'font-medium text-text-primary'}`}>
                    {activeTab === 'inbox' ? msg.from : `To: ${msg.to}`}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  {msg.hasAttachment && <Paperclip size={12} className="text-text-muted" />}
                  {msg.isStarred && <Star size={12} className="text-status-warning fill-status-warning" />}
                  <span className="text-[10px] font-mono text-text-muted">{msg.time}</span>
                </div>
              </div>
              <p className={`text-xs font-body mb-1.5 truncate ${!msg.isRead && msg.type === 'received' ? 'text-text-primary' : 'text-text-secondary'}`}>
                {msg.subject}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-body text-text-muted truncate max-w-[70%]">
                  {msg.body.split('\n')[0].substring(0, 60)}...
                </p>
                {msg.tag && (
                  <span className={`text-[9px] font-body font-medium px-1.5 py-0.5 rounded border ${tagColors[msg.tag]}`}>
                    {msg.tag}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Panel — Message Detail or Compose */}
        <div className="overflow-y-auto">
          {showCompose ? (
            /* Compose Email */
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-display font-semibold text-text-primary">
                  {composeSubject.startsWith('RE:') ? 'Reply' : 'New Email'}
                </h3>
                <button
                  onClick={() => setShowCompose(false)}
                  className="text-xs font-body text-text-secondary hover:text-text-primary transition-colors"
                >
                  Cancel
                </button>
              </div>
              <div>
                <label className="block text-xs font-body font-medium text-text-secondary mb-1">To</label>
                <input
                  type="email" value={composeTo} onChange={(e) => setComposeTo(e.target.value)}
                  className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary"
                  placeholder="recipient@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-body font-medium text-text-secondary mb-1">Subject</label>
                <input
                  type="text" value={composeSubject} onChange={(e) => setComposeSubject(e.target.value)}
                  className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary"
                  placeholder="Email subject"
                />
              </div>
              <div>
                <label className="block text-xs font-body font-medium text-text-secondary mb-1">Message</label>
                <textarea
                  value={composeBody} onChange={(e) => setComposeBody(e.target.value)}
                  rows={12}
                  className="w-full bg-bg-primary border border-border rounded-md py-3 px-3 text-sm font-body text-text-primary resize-none leading-relaxed"
                  placeholder="Type your message here..."
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <button className="flex items-center gap-2 text-xs font-body text-text-secondary border border-border rounded-md px-3 py-2 hover:bg-bg-hover transition-colors">
                  <Paperclip size={14} />
                  Attach File
                </button>
                <button
                  onClick={handleSend}
                  disabled={isSending}
                  className="flex items-center gap-2 bg-accent-primary hover:bg-accent-secondary text-white text-sm font-body font-medium px-5 py-2.5 rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  {isSending ? 'Sending...' : 'Send Email'}
                </button>
              </div>
            </div>
          ) : selectedMessage ? (
            /* Message Detail View */
            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-4 pb-4 border-b border-border">
                <div className="flex-1">
                  <h3 className="text-base font-display font-semibold text-text-primary mb-2">{selectedMessage.subject}</h3>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center border border-accent-primary/20">
                      <span className="text-[10px] font-display font-bold text-accent-primary">
                        {selectedMessage.from.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-body font-medium text-text-primary">{selectedMessage.from}</p>
                      <p className="text-[11px] font-mono text-text-muted">{selectedMessage.fromEmail}</p>
                    </div>
                  </div>
                  <p className="text-[11px] font-body text-text-muted">
                    To: {selectedMessage.to} &lt;{selectedMessage.toEmail}&gt; · {selectedMessage.date} at {selectedMessage.time}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedMessage.tag && (
                    <span className={`text-[10px] font-body font-medium px-2 py-0.5 rounded border ${tagColors[selectedMessage.tag]}`}>
                      {selectedMessage.tag}
                    </span>
                  )}
                  {selectedMessage.hasAttachment && (
                    <span className="flex items-center gap-1 text-[10px] font-body text-text-muted">
                      <Paperclip size={11} /> Attachment
                    </span>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="text-sm font-body text-text-secondary leading-relaxed whitespace-pre-wrap mb-6">
                {selectedMessage.body}
              </div>

              {/* Actions */}
              {selectedMessage.type === 'received' && (
                <div className="flex items-center gap-2 pt-4 border-t border-border">
                  <button
                    onClick={() => handleReply(selectedMessage)}
                    className="flex items-center gap-2 bg-accent-primary hover:bg-accent-secondary text-white text-sm font-body font-medium px-4 py-2.5 rounded-md transition-colors duration-150"
                  >
                    <Reply size={14} />
                    Reply
                  </button>
                  <button className="flex items-center gap-2 text-text-secondary border border-border text-sm font-body font-medium px-4 py-2.5 rounded-md hover:bg-bg-hover transition-colors">
                    <Send size={14} />
                    Forward
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-16 h-16 rounded-full bg-bg-hover flex items-center justify-center mb-4">
                <MailOpen size={28} className="text-text-muted" />
              </div>
              <p className="text-sm font-body text-text-secondary mb-1">Select an email to read</p>
              <p className="text-xs font-body text-text-muted">Click on any message in the list to view its contents</p>
            </div>
          )}
        </div>
      </div>

      <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
};

export default Communications;
