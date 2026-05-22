import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Search, Eye, Edit, ArrowRightCircle, Mail, Download, Clock, Kanban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';
import { rfqData as dummyRfqData, materials, vendorData, incomingEmails } from '../data/dummyData';
import type { RFQ, IncomingEmail } from '../data/dummyData';
import { getAllRFQs, importFromEmail } from '../services/api';

const statusTabs = ['All', 'New', 'Sent', 'Responded', 'Converted'] as const;

const getRfqCreatedTime = (rfq: any) => {
  const parsedDate = Date.parse(rfq.created || rfq.created_at || '');
  if (!Number.isNaN(parsedDate)) return parsedDate;

  const timestampMatch = String(rfq.id || rfq.rfq_number || '').match(/RFQ-(\d+)/);
  return timestampMatch ? Number(timestampMatch[1]) : 0;
};

const sortNewestRFQs = <T extends Record<string, any>>(items: T[]) =>
  [...items].sort((a, b) => getRfqCreatedTime(b) - getRfqCreatedTime(a));

const RFQManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewRFQ, setShowNewRFQ] = useState(false);
  const [showEmailImport, setShowEmailImport] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importState, setImportState] = useState<string | null>(null);
  const [selectedRFQ, setSelectedRFQ] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchRFQs();

    const eventSource = new EventSource('http://localhost:3001/api/events');
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'new_rfq') {
          const clientName = data.payload.client_name || data.payload.company || 'a client';
          setToastMessage(`New RFQ received from ${clientName}`);
          setShowToast(true);
          fetchRFQs();
        }
      } catch (err) {
        console.error('Error parsing SSE data', err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const fetchRFQs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllRFQs();
      const data = Array.isArray(response) ? response : (response?.data || response?.rfqs || []);
      const mapped = data.map((d: any) => {
        const items = d.items || [];
        const firstMaterial = items.length > 0 ? items[0].material_type : (d.material_type || 'Steel Enquiry');
        const totalQty = items.length > 0 
          ? items.reduce((sum: number, it: any) => sum + (Number(it.quantity_mt) || 0), 0)
          : (d.quantity_mt || 0);
        return {
          id: d.rfq_number,
          client: d.company || d.client_name || 'Unknown',
          contactName: d.client_name,
          contactNumber: d.contact_number,
          material: firstMaterial,
          quantity: totalQty,
          itemCount: items.length,
          items: items,
          requiredBy: d.required_by ? new Date(d.required_by).toISOString().split('T')[0] : 'N/A',
          vendorsSent: 0,
          status: d.status || 'New',
          created: d.created_at,
          deliveryLocation: d.delivery_location || '',
          source: d.source || 'Manual',
          rfqType: d.rfq_type,
          approvedMakes: d.approved_makes,
          certifications: d.certifications,
          confidenceScore: d.confidence_score,
          paymentTerms: d.payment_terms,
          deliveryTerms: d.delivery_terms
        };
      });
      setRfqs(sortNewestRFQs(mapped));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoImport = async () => {
    setImportState('Checking Zoho inbox...');
    await new Promise(r => setTimeout(r, 1500));
    setImportState('AI extracting procurement data...');
    await new Promise(r => setTimeout(r, 2000));
    setImportState('Generating RFQ...');

    try {
      const result = await importFromEmail();
      const createdCount = Array.isArray(result) ? result.length : (result.createdCount ?? result.data?.length ?? 0);
      const skippedCount = Array.isArray(result) ? 0 : (result.skippedCount ?? result.skipped?.length ?? 0);
      setImportState(null);
      if (createdCount === 0 && skippedCount > 0) {
        setToastMessage(`No new RFQs. ${skippedCount} email(s) were already imported.`);
      } else if (skippedCount > 0) {
        setToastMessage(`${createdCount} RFQ(s) created, ${skippedCount} duplicate email(s) skipped.`);
      } else {
        setToastMessage(`${createdCount} RFQ(s) created successfully!`);
      }
      setShowToast(true);
      await fetchRFQs();
    } catch (err: any) {
      setImportState(null);
      setToastMessage('❌ Import failed: ' + err.message);
      setShowToast(true);
    }
  };

  // New RFQ form state (for auto-fill from email)
  const [formClient, setFormClient] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formMaterial, setFormMaterial] = useState('');
  const [formQuantity, setFormQuantity] = useState('');
  const [formRequiredBy, setFormRequiredBy] = useState('');
  const [formRequirements, setFormRequirements] = useState('');

  const filteredRFQs = useMemo(() => {
    let data = rfqs;
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
    return sortNewestRFQs(data);
  }, [activeTab, searchQuery, rfqs]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { All: rfqs.length };
    rfqs.forEach((r) => {
      counts[r.status] = (counts[r.status] || 0) + 1;
    });
    return counts;
  }, [rfqs]);

  const isDateUrgent = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 3 && diff >= 0;
  };

  const getRelativeDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return 'Unknown';

    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}`;
    }
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
        <div className="flex items-baseline gap-2">
          <h1 className="text-2xl font-display font-bold text-text-primary">RFQ Management</h1>
          <span className="text-sm font-medium text-text-muted ml-1">
            ({rfqs.length} total)
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          {/* Import from Email Button */}
          <button
            onClick={handleAutoImport}
            disabled={!!importState}
            className="flex items-center gap-2 text-text-secondary border border-border text-sm font-body font-medium px-4 py-2.5 rounded-md hover:bg-bg-hover hover:text-text-primary hover:border-border-accent transition-all duration-150 disabled:opacity-50 relative overflow-hidden"
          >
            <Mail size={16} />
            {importState || 'Import from Email'}
            {importState && (
              <span className="absolute bottom-0 left-0 h-0.5 bg-accent-primary animate-[pulse_1s_ease-in-out_infinite] w-full"></span>
            )}
          </button>
          {/* New RFQ Button */}
          <button
            onClick={() => navigate('/new-enquiry')}
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

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-2">
        {isLoading ? (
          <div className="w-full py-20 text-center text-sm font-body text-text-secondary">Loading RFQs...</div>
        ) : error ? (
          <div className="w-full py-4 text-center text-sm font-body text-status-danger">{error}</div>
        ) : (
          ['New', 'Sent', 'Responded', 'Converted'].map(status => {
            const columnRFQs = filteredRFQs.filter(r => r.status === status);
            return (
              <div key={status} className="flex-shrink-0 w-80 bg-bg-secondary border border-border rounded-md flex flex-col h-[calc(100vh-280px)]">
                <div className="p-3 border-b border-border flex items-center justify-between bg-bg-tertiary rounded-t-md shadow-sm">
                  <h3 className="text-sm font-display font-semibold text-text-primary">{status}</h3>
                  <span className="text-xs font-mono font-medium text-text-secondary bg-bg-primary px-2 py-0.5 rounded border border-border">
                    {columnRFQs.length}
                  </span>
                </div>
                <div className="p-3 flex-1 overflow-y-auto space-y-3">
                  {columnRFQs.map(rfq => (
                    <div key={rfq.id} className="bg-bg-primary border border-border rounded-md p-4 shadow-sm hover:border-accent-primary hover:shadow-md transition-all duration-150 cursor-pointer group">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-mono font-medium text-text-secondary group-hover:text-accent-primary transition-colors">{rfq.id}</span>
                        <span className="text-[10px] font-body text-text-secondary bg-bg-secondary border border-border px-1.5 py-0.5 rounded">{getRelativeDate(rfq.created)}</span>
                      </div>
                      <h4 className="text-[15px] font-body font-semibold text-text-primary mb-1 line-clamp-1">{rfq.client}</h4>
                      
                      <div className="flex items-center gap-1.5 flex-wrap mb-4">
                         <span className="text-[11px] font-body font-medium text-text-secondary bg-bg-secondary px-2 py-0.5 rounded-full line-clamp-1 max-w-[180px]">{rfq.material}</span>
                         {rfq.itemCount > 1 && (
                           <span className="text-[10px] font-mono font-medium text-accent-primary bg-accent-primary/10 px-1.5 py-0.5 rounded">+{rfq.itemCount - 1} items</span>
                         )}
                         {isDateUrgent(rfq.requiredBy) && (
                           <span className="text-[10px] font-body font-bold text-status-danger bg-status-danger/10 px-1.5 py-0.5 rounded uppercase tracking-wider">Urgent</span>
                         )}
                      </div>

                      <div className="flex items-end justify-between pt-3 border-t border-border border-dashed mt-auto">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-body text-text-muted uppercase tracking-wider mb-0.5">Quantity</span>
                          <span className="text-sm font-mono font-bold text-text-primary">{rfq.quantity} <span className="text-[11px] text-text-secondary">MT</span></span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedRFQ(rfq); setShowDetailModal(true); }}
                            className="w-7 h-7 flex items-center justify-center rounded bg-bg-secondary text-text-secondary hover:text-accent-primary transition-colors"
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {columnRFQs.length === 0 && (
                    <div className="h-20 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-md mt-2">
                      <span className="text-xs font-body text-text-muted">No items</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
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

      {/* ── RFQ Detail Modal ── */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={`RFQ Details - ${selectedRFQ?.id}`}
        width="max-w-4xl"
        footer={
          <>
            <button
              onClick={() => setShowDetailModal(false)}
              className="px-4 py-2 text-sm font-body text-text-secondary border border-border rounded-md hover:bg-bg-hover transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => navigate('/quotation-builder', { state: { rfq: selectedRFQ } })}
              className="px-4 py-2 text-sm font-body font-medium text-white bg-accent-primary hover:bg-accent-secondary rounded-md transition-colors"
            >
              Generate Quotation
            </button>
          </>
        }
      >
        {selectedRFQ && (
          <div className="space-y-6">
            {/* Premium Header */}
            <div className="bg-bg-tertiary border border-border rounded-lg p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-border border-dashed">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-accent-primary/10 flex items-center justify-center border border-accent-primary/20">
                    <span className="text-accent-primary font-bold font-display text-lg">{selectedRFQ.client.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-text-primary">{selectedRFQ.client}</h3>
                    <p className="text-xs font-body text-text-secondary flex items-center gap-2 mt-0.5">
                      <Clock size={12} className="text-text-muted" /> 
                      Created on {new Date(selectedRFQ.created).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-display font-bold uppercase tracking-wider text-text-secondary bg-bg-primary px-3 py-1.5 rounded-full border border-border shadow-sm flex items-center gap-1.5">
                    {selectedRFQ.source === 'email' ? <Mail size={12} className="text-accent-primary" /> : <Edit size={12} />}
                    {selectedRFQ.source === 'email' ? 'Email — Auto Parsed' : selectedRFQ.source}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                 <div>
                   <p className="text-[10px] font-body text-text-muted uppercase tracking-wider mb-1">Contact Name</p>
                   <p className="text-sm font-body text-text-primary font-medium">{selectedRFQ.contactName || '—'}</p>
                 </div>
                 <div>
                   <p className="text-[10px] font-body text-text-muted uppercase tracking-wider mb-1">Contact Number</p>
                   <p className="text-sm font-body text-text-primary font-medium">{selectedRFQ.contactNumber || '—'}</p>
                 </div>
                 <div>
                   <p className="text-[10px] font-body text-text-muted uppercase tracking-wider mb-1">Delivery Location</p>
                   <p className="text-sm font-body text-text-primary font-medium">{selectedRFQ.deliveryLocation || '—'}</p>
                 </div>
              </div>
            </div>
            
            {/* Enterprise Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Classification & Commercial */}
              <div className="bg-bg-primary border border-border rounded-lg p-4">
                <h4 className="text-xs font-display font-bold text-text-secondary uppercase tracking-wider mb-3">Classification & Terms</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-text-muted inline-block w-24">Type:</span>
                    <span className="text-sm font-medium text-text-primary bg-accent-primary/10 text-accent-primary px-2 py-0.5 rounded">{selectedRFQ.rfq_type || 'Simple RFQ'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-text-muted inline-block w-24">Confidence:</span>
                    <span className={`text-sm font-bold ${selectedRFQ.confidence_score >= 90 ? 'text-green-500' : selectedRFQ.confidence_score >= 70 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {selectedRFQ.confidence_score ? `${selectedRFQ.confidence_score}%` : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-text-muted inline-block w-24">Payment:</span>
                    <span className="text-sm text-text-primary">{selectedRFQ.payment_terms || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-text-muted inline-block w-24">Delivery:</span>
                    <span className="text-sm text-text-primary">{selectedRFQ.delivery_terms || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Compliance & Makes */}
              <div className="bg-bg-primary border border-border rounded-lg p-4">
                <h4 className="text-xs font-display font-bold text-text-secondary uppercase tracking-wider mb-3">Compliance & Sourcing</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-text-muted block mb-1">Approved Makes:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedRFQ.approved_makes && selectedRFQ.approved_makes.length > 0 ? (
                        selectedRFQ.approved_makes.map((make: string, i: number) => (
                          <span key={i} className="text-xs font-medium bg-border/50 text-text-primary px-2 py-0.5 rounded-full border border-border">
                            {make}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-text-secondary">Open to all primary makes</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-text-muted block mb-1">Certifications Required:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedRFQ.certifications && selectedRFQ.certifications.length > 0 ? (
                        selectedRFQ.certifications.map((cert: string, i: number) => (
                          <span key={i} className="text-xs font-bold bg-red-500/10 text-red-500 px-2 py-0.5 rounded border border-red-500/20">
                            {cert}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-text-secondary">Standard</span>
                      )}
                    </div>
                  </div>
                  {selectedRFQ.special_requirements && (
                    <div>
                       <span className="text-xs text-text-muted block mb-1">Special Notes:</span>
                       <p className="text-sm text-text-primary italic border-l-2 border-accent-primary pl-2">{selectedRFQ.special_requirements}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-display font-semibold text-text-primary mb-3">Requested Items</h4>
              <div className="border border-border rounded-md overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-bg-secondary border-b border-border">
                    <tr>
                      <th className="p-3 text-xs font-body font-medium text-text-secondary w-12">Sr</th>
                      <th className="p-3 text-xs font-body font-medium text-text-secondary">Material</th>
                      <th className="p-3 text-xs font-body font-medium text-text-secondary">Grade/Spec</th>
                      <th className="p-3 text-xs font-body font-medium text-text-secondary text-right">Qty MT</th>
                      <th className="p-3 text-xs font-body font-medium text-text-secondary">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {selectedRFQ.items && selectedRFQ.items.length > 0 ? (
                      selectedRFQ.items.map((item: any, idx: number) => (
                        <tr key={idx} className="bg-bg-primary">
                          <td className="p-3 text-sm font-body text-text-secondary">{idx + 1}</td>
                          <td className="p-3 text-sm font-body text-text-primary">{item.material_type}</td>
                          <td className="p-3 text-sm font-body text-text-secondary">{[item.grade, item.specification].filter(Boolean).join(' / ') || '—'}</td>
                          <td className="p-3 text-sm font-mono text-text-primary text-right">{item.quantity_mt}</td>
                          <td className="p-3 text-sm font-body text-text-secondary">{item.remarks || '—'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="bg-bg-primary">
                        <td colSpan={4} className="p-4 text-sm font-body text-text-muted text-center">No items listed</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Toast */}
      <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
};

export default RFQManagement;
