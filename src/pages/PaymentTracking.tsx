import React, { useState, useMemo, useCallback } from 'react';
import { IndianRupee, Eye, CreditCard, Send } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import WhatsAppModal from '../components/ui/WhatsAppModal';
import Toast from '../components/ui/Toast';
import { paymentData } from '../data/dummyData';

const tabs = ['All', 'Unpaid', 'Partial', 'Paid', 'Overdue'] as const;

const PaymentTracking: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [waRecipient, setWaRecipient] = useState('');
  const [waMessage, setWaMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const filtered = useMemo(() => {
    if (activeTab === 'All') return paymentData;
    return paymentData.filter((p) => p.status === activeTab);
  }, [activeTab]);

  const formatINR = (n: number) => '₹' + n.toLocaleString('en-IN');

  const getDaysOverdue = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const handleSendReminder = useCallback((client: string, invoiceNo: string, balance: number) => {
    setWaRecipient(client);
    setWaMessage(
      `Hi ${client},\n\nThis is Ram from Omnia Steels. This is a friendly reminder regarding the pending payment for invoice ${invoiceNo}.\n\nOutstanding Amount: ₹${balance.toLocaleString('en-IN')}\n\nKindly arrange the payment at your earliest convenience. You can pay via NEFT/RTGS to our bank account or through UPI.\n\nPlease share the payment reference once done.\n\nThank you for your continued business.\n\nRegards,\nRam Sharma\nOmnia Steels Pvt Ltd\n+91 98765 43210`
    );
    setShowWhatsApp(true);
  }, []);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-display font-bold text-text-primary">Payment Tracking</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Total Receivable" value="₹12,40,000" change="From 10 invoices" icon={IndianRupee} color="blue" />
        <StatCard title="Received This Month" value="₹7,20,000" change="+₹2.1L vs last month" changeType="positive" icon={IndianRupee} color="green" />
        <StatCard title="Overdue Amount" value="₹2,80,000" change="3 invoices overdue" changeType="negative" icon={IndianRupee} color="red" />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {tabs.map((tab) => {
          const count = tab === 'All' ? paymentData.length : paymentData.filter(p => p.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-body font-medium rounded-full border transition-all duration-150
                ${activeTab === tab ? 'bg-accent-primary text-white border-accent-primary' : 'bg-transparent text-text-secondary border-border hover:border-border-accent hover:text-text-primary'}`}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-bg-tertiary border border-border rounded-md shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-bg-secondary">
                {['Invoice #', 'Client', 'RFQ/Quote Ref', 'Invoice Date', 'Due Date', 'Invoice Amt', 'Paid Amt', 'Balance', 'Status', 'Overdue', 'Actions'].map(h => (
                  <th key={h} className={`text-[11px] font-body font-semibold text-text-muted uppercase tracking-[0.06em] px-4 py-3 ${['Invoice Amt', 'Paid Amt', 'Balance'].includes(h) ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => {
                const balance = p.invoiceAmt - p.paidAmt;
                const daysOverdue = getDaysOverdue(p.dueDate);
                const isOverdue = p.status === 'Overdue';
                const isPastDue = new Date(p.dueDate) < new Date();
                const canSendReminder = isOverdue || p.status === 'Partial' || p.status === 'Unpaid';
                return (
                  <tr
                    key={p.id}
                    className={`border-b border-border hover:bg-bg-hover transition-colors duration-150
                      ${isOverdue ? 'border-l-2 border-l-status-danger bg-status-danger/[0.03]' : idx % 2 === 0 ? 'bg-bg-tertiary' : ''}`}
                  >
                    <td className="px-4 py-3 text-xs font-mono text-text-muted">{p.invoiceNo}</td>
                    <td className="px-4 py-3 text-sm font-body font-medium text-text-primary">{p.client}</td>
                    <td className="px-4 py-3 text-xs font-mono text-text-muted">{p.rfqRef}</td>
                    <td className="px-4 py-3 text-xs font-body text-text-secondary">{p.invoiceDate}</td>
                    <td className={`px-4 py-3 text-xs font-body ${isPastDue ? 'text-status-danger font-medium' : 'text-status-success'}`}>{p.dueDate}</td>
                    <td className="px-4 py-3 text-sm font-mono text-text-primary text-right">{formatINR(p.invoiceAmt)}</td>
                    <td className="px-4 py-3 text-sm font-mono text-status-success text-right">{formatINR(p.paidAmt)}</td>
                    <td className={`px-4 py-3 text-sm font-mono text-right ${balance > 0 ? 'text-status-danger' : 'text-text-secondary'}`}>
                      {balance > 0 ? formatINR(balance) : '—'}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3">
                      {isOverdue ? (
                        <span className="text-[10px] font-mono font-medium text-status-danger bg-status-danger/10 px-2 py-0.5 rounded-full">{daysOverdue}d</span>
                      ) : <span className="text-text-muted text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors" title="View Invoice"><Eye size={14} /></button>
                        <button onClick={() => setShowRecordPayment(true)} className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors" title="Record Payment"><CreditCard size={14} /></button>
                        {canSendReminder ? (
                          <button
                            onClick={() => handleSendReminder(p.client, p.invoiceNo, balance)}
                            className="w-7 h-7 flex items-center justify-center rounded text-[#25D366] hover:bg-[#25D366]/10 transition-colors"
                            title="Send Reminder via WhatsApp"
                          >
                            <Send size={14} />
                          </button>
                        ) : (
                          <button className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors" title="Send Reminder"><Send size={14} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      <Modal
        isOpen={showRecordPayment}
        onClose={() => setShowRecordPayment(false)}
        title="Record Payment"
        width="max-w-md"
        footer={
          <>
            <button onClick={() => setShowRecordPayment(false)} className="px-4 py-2 text-sm font-body text-text-secondary border border-border rounded-md hover:bg-bg-hover transition-colors">Cancel</button>
            <button onClick={() => setShowRecordPayment(false)} className="px-4 py-2 text-sm font-body font-medium text-white bg-accent-primary hover:bg-accent-secondary rounded-md transition-colors">Record Payment</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Payment Date</label>
            <input type="date" className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-secondary" />
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Amount Received (₹)</label>
            <input type="number" className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-mono text-text-primary" placeholder="0" />
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Payment Mode</label>
            <select className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-secondary">
              {['NEFT', 'RTGS', 'Cheque', 'Cash', 'UPI'].map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Reference / UTR Number</label>
            <input type="text" className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-mono text-text-primary" placeholder="Enter reference" />
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Notes</label>
            <textarea rows={2} className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary resize-none" placeholder="Optional notes..." />
          </div>
        </div>
      </Modal>

      {/* WhatsApp Reminder Modal */}
      <WhatsAppModal
        isOpen={showWhatsApp}
        onClose={() => setShowWhatsApp(false)}
        recipientName={waRecipient}
        defaultMessage={waMessage}
        onSend={() => setShowToast(true)}
      />

      <Toast message="WhatsApp message queued successfully" isVisible={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
};

export default PaymentTracking;
