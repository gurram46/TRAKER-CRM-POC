import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Search, Eye, Edit, ArrowRightCircle, Mail, Download, Clock } from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';
import { rfqData, materials, vendorData, incomingEmails } from '../data/dummyData';
import type { RFQ, IncomingEmail } from '../data/dummyData';

const statusTabs = ['All', 'New', 'Sent', 'Responded', 'Converted'] as const;

const RFQManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewRFQ, setShowNewRFQ] = useState(false);
  const [showEmailImport, setShowEmailImport] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // New RFQ form state (for auto-fill from email)
  const [formClient, setFormClient] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formMaterial, setFormMaterial] = useState('');
  const [formQuantity, setFormQuantity] = useState('');
  const [formRequiredBy, setFormRequiredBy] = useState('');
  const [formRequirements, setFormRequirements] = useState('');

  const filteredRFQs = useMemo(() => {
    let data = rfqData;
    if (activeTab !== 'All') {
      data = data.filter((r) => r.status === activeTab);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (r) =>
          r.client.toLowerCase().includes(q) ||
          r.material.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
      );
    }
    return data;
  }, [activeTab, searchQuery]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { All: rfqData.length };
    rfqData.forEach((r) => {
      counts[r.status] = (counts[r.status] || 0) + 1;
    });
    return counts;
  }, []);

  const isDateUrgent = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 3 && diff >= 0;
  };

  const getRelativeDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  const handleImportAsRFQ = useCallback((email: IncomingEmail) => {
    // Close email modal, open New RFQ modal with auto-filled data
    setShowEmailImport(false);
    setFormClient(email.extractedClient);
    setFormContact(email.extractedContact);
    setFormMaterial(email.extractedMaterial);
    setFormQuantity(String(email.extractedQuantity));
    setFormRequiredBy(email.extractedRequiredBy);
    setFormRequirements(`Imported from email: "${email.subject}"\nFrom: ${email.from} <${email.fromEmail}>`);
    setShowNewRFQ(true);
  }, []);

  const handleCreateRFQ = useCallback(() => {
    setShowNewRFQ(false);
    // Reset form
    setFormClient('');
    setFormContact('');
    setFormMaterial('');
    setFormQuantity('');
    setFormRequiredBy('');
    setFormRequirements('');
    // Show success toast
    if (formRequirements.startsWith('Imported from email')) {
      setToastMessage('RFQ created from email successfully');
    } else {
      setToastMessage('RFQ created successfully');
    }
    setShowToast(true);
  }, [formRequirements]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-display font-bold text-text-primary">RFQ Management</h1>
          <span className="text-xs font-mono font-medium text-accent-primary bg-accent-primary/10 px-2.5 py-1 rounded-full border border-accent-primary/20">
            {rfqData.length} RFQs
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          {/* Import from Email Button */}
          <button
            onClick={() => setShowEmailImport(true)}
            className="flex items-center gap-2 text-text-secondary border border-border text-sm font-body font-medium px-4 py-2.5 rounded-md hover:bg-bg-hover hover:text-text-primary hover:border-border-accent transition-all duration-150"
          >
            <Mail size={16} />
            Import from Email
          </button>
          {/* New RFQ Button */}
          <button
            onClick={() => setShowNewRFQ(true)}
            className="flex items-center gap-2 bg-accent-primary hover:bg-accent-secondary text-white text-sm font-body font-medium px-4 py-2.5 rounded-md transition-colors duration-150"
          >
            <Plus size={16} />
            New RFQ
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-body font-medium rounded-full border transition-all duration-150
              ${
                activeTab === tab
                  ? 'bg-accent-primary text-white border-accent-primary'
                  : 'bg-transparent text-text-secondary border-border hover:border-border-accent hover:text-text-primary'
              }`}
          >
            {tab} ({statusCounts[tab] || 0})
          </button>
        ))}
      </div>

      {/* Search Row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by client, material, RFQ ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg-primary border border-border rounded-md py-2.5 pl-9 pr-4 text-sm font-body text-text-primary placeholder:text-text-muted transition-all duration-150"
          />
        </div>
        <button className="px-4 py-2.5 text-xs font-body font-medium text-text-secondary border border-border rounded-md hover:bg-bg-hover transition-colors duration-150">
          Date Range
        </button>
        <select className="bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-secondary appearance-none cursor-pointer">
          <option value="">All Materials</option>
          {materials.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-bg-tertiary border border-border rounded-md shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-bg-secondary">
                {['RFQ ID', 'Client Name', 'Material', 'Qty (MT)', 'Required By', 'Vendor Sent', 'Status', 'Created', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className={`text-[11px] font-body font-semibold text-text-muted uppercase tracking-[0.06em] px-4 py-3
                      ${h === 'Qty (MT)' ? 'text-right' : 'text-left'}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRFQs.map((rfq, idx) => (
                <tr
                  key={rfq.id}
                  className={`border-b border-border hover:bg-bg-hover transition-colors duration-150 ${
                    idx % 2 === 0 ? 'bg-bg-tertiary' : 'bg-transparent'
                  }`}
                >
                  <td className="px-4 py-3 text-xs font-mono text-text-muted">{rfq.id}</td>
                  <td className="px-4 py-3 text-sm font-body font-medium text-text-primary">{rfq.client}</td>
                  <td className="px-4 py-3 text-sm font-body text-text-secondary">{rfq.material}</td>
                  <td className="px-4 py-3 text-sm font-mono text-text-primary text-right">{rfq.quantity}</td>
                  <td className={`px-4 py-3 text-sm font-body ${isDateUrgent(rfq.requiredBy) ? 'text-status-danger font-medium' : 'text-text-secondary'}`}>
                    {rfq.requiredBy}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-body text-text-secondary bg-bg-secondary px-2 py-1 rounded-full">
                      {rfq.vendorsSent} vendors
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={rfq.status} /></td>
                  <td className="px-4 py-3 text-xs font-body text-text-secondary">{getRelativeDate(rfq.created)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {[Eye, Edit, ArrowRightCircle].map((Icon, i) => (
                        <button
                          key={i}
                          className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors duration-150"
                          title={['View', 'Edit', 'Convert'][i]}
                        >
                          <Icon size={14} />
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <span className="text-xs font-body text-text-secondary">
            Showing {filteredRFQs.length} of {rfqData.length} results
          </span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-xs font-body text-text-secondary border border-border rounded hover:bg-bg-hover transition-colors">Prev</button>
            <button className="px-3 py-1.5 text-xs font-body text-white bg-accent-primary rounded">1</button>
            <button className="px-3 py-1.5 text-xs font-body text-text-secondary border border-border rounded hover:bg-bg-hover transition-colors">2</button>
            <button className="px-3 py-1.5 text-xs font-body text-text-secondary border border-border rounded hover:bg-bg-hover transition-colors">Next</button>
          </div>
        </div>
      </div>

      {/* ── Import from Email Modal ── */}
      <Modal
        isOpen={showEmailImport}
        onClose={() => setShowEmailImport(false)}
        title="Import RFQ from Email"
        width="max-w-2xl"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-[#D14836]/10 flex items-center justify-center">
              <Mail size={14} className="text-[#D14836]" />
            </div>
            <span className="text-xs font-body text-text-secondary">Zoho Mail — Unread enquiries from <span className="text-text-primary font-medium">info@omniasteels.com</span></span>
          </div>

          {incomingEmails.map((email) => (
            <div
              key={email.id}
              className="bg-bg-primary border border-border rounded-md p-4 hover:border-border-accent transition-all duration-150 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    {email.isUnread && (
                      <span className="w-2 h-2 rounded-full bg-accent-primary flex-shrink-0" />
                    )}
                    <span className="text-sm font-body font-semibold text-text-primary truncate">{email.subject}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-body text-text-secondary">{email.from}</span>
                    <span className="text-text-muted">·</span>
                    <span className="text-xs font-mono text-text-muted">{email.fromEmail}</span>
                    <span className="text-text-muted">·</span>
                    <span className="flex items-center gap-1 text-[11px] font-body text-text-muted">
                      <Clock size={10} />
                      {email.receivedAt}
                    </span>
                  </div>
                  <p className="text-xs font-body text-text-muted leading-relaxed line-clamp-2">{email.preview}</p>

                  {/* Extracted Data Preview */}
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
                    <span className="text-[10px] font-body text-text-muted uppercase tracking-wider">Detected:</span>
                    <span className="text-[11px] font-body text-accent-primary bg-accent-primary/10 px-2 py-0.5 rounded">{email.extractedMaterial}</span>
                    <span className="text-[11px] font-mono text-text-secondary">{email.extractedQuantity} MT</span>
                    <span className="text-[11px] font-body text-text-secondary">→ {email.extractedClient}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleImportAsRFQ(email)}
                  className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-body font-medium text-accent-primary bg-accent-primary/10 border border-accent-primary/20 rounded-md hover:bg-accent-primary/20 transition-colors flex-shrink-0"
                >
                  <Download size={12} />
                  Import as RFQ
                </button>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* ── New RFQ Modal (with auto-fill support) ── */}
      <Modal
        isOpen={showNewRFQ}
        onClose={() => setShowNewRFQ(false)}
        title="Create New RFQ"
        footer={
          <>
            <button
              onClick={() => setShowNewRFQ(false)}
              className="px-4 py-2 text-sm font-body text-text-secondary border border-border rounded-md hover:bg-bg-hover transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateRFQ}
              className="px-4 py-2 text-sm font-body font-medium text-white bg-accent-primary hover:bg-accent-secondary rounded-md transition-colors"
            >
              Create RFQ
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {formRequirements.startsWith('Imported from email') && (
            <div className="flex items-center gap-2 bg-accent-primary/10 border border-accent-primary/20 rounded-md px-3 py-2">
              <Mail size={14} className="text-accent-primary" />
              <span className="text-xs font-body text-accent-primary">Auto-filled from email import</span>
            </div>
          )}
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Client Name</label>
            <input type="text" value={formClient} onChange={(e) => setFormClient(e.target.value)} className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary" placeholder="Enter client name" />
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Contact Number</label>
            <input type="text" value={formContact} onChange={(e) => setFormContact(e.target.value)} className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary" placeholder="9XXXXXXXXX" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Material Type</label>
              <select value={formMaterial} onChange={(e) => setFormMaterial(e.target.value)} className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-secondary">
                <option value="">Select material</option>
                {materials.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Quantity (MT)</label>
              <input type="number" value={formQuantity} onChange={(e) => setFormQuantity(e.target.value)} className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary" placeholder="0" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Required By Date</label>
            <input type="date" value={formRequiredBy} onChange={(e) => setFormRequiredBy(e.target.value)} className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-secondary" />
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Special Requirements</label>
            <textarea rows={3} value={formRequirements} onChange={(e) => setFormRequirements(e.target.value)} className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary resize-none" placeholder="Any special requirements..." />
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Select Vendors to Notify</label>
            <div className="space-y-2 max-h-32 overflow-y-auto bg-bg-primary border border-border rounded-md p-3">
              {vendorData.filter(v => v.status === 'Active').map((v) => (
                <label key={v.id} className="flex items-center gap-2 text-sm font-body text-text-secondary cursor-pointer hover:text-text-primary">
                  <input type="checkbox" className="rounded border-border accent-accent-primary" />
                  {v.name} — {v.city}
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
};

export default RFQManagement;
