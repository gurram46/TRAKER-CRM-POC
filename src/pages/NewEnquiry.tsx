import React, { useState } from 'react';
import { Plus, Trash2, Save, Send } from 'lucide-react';
import { itemsData } from '../data/dummyData';
import Toast from '../components/ui/Toast';

const NewEnquiry: React.FC = () => {
  const [clientName, setClientName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [requiredBy, setRequiredBy] = useState('');
  const [remarks, setRemarks] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [enquirySource, setEnquirySource] = useState('');
  const [projectName, setProjectName] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [emailParserText, setEmailParserText] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  const [lineItems, setLineItems] = useState([
    { id: 1, itemCode: '', itemName: '', specification: '', grade: '', qty: '', uom: 'MT' }
  ]);

  const handleItemSelect = (id: number, code: string) => {
    const item = itemsData.find(i => i.code === code);
    if (item) {
      setLineItems(prev => prev.map(li => li.id === id ? { 
        ...li, 
        itemCode: item.code, 
        itemName: item.name, 
        specification: item.specification, 
        grade: item.grade, 
        uom: item.uom 
      } : li));
    }
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { id: Date.now(), itemCode: '', itemName: '', specification: '', grade: '', qty: '', uom: 'MT' }]);
  };

  const removeLineItem = (id: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(li => li.id !== id));
    }
  };

  const updateLineItem = (id: number, field: string, value: string) => {
    setLineItems(prev => prev.map(li => li.id === id ? { ...li, [field]: value } : li));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">Create New Enquiry</h1>
          <p className="text-sm font-body text-text-secondary mt-1">Add client details and multiple items for this RFQ.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-border text-text-secondary font-body font-medium text-sm rounded-md hover:bg-bg-hover hover:text-text-primary transition-colors">
            <Save size={16} />
            Save Draft
          </button>
          <button 
            onClick={() => setShowToast(true)}
            className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white font-body font-medium text-sm rounded-md hover:bg-accent-secondary transition-colors"
          >
            <Send size={16} />
            Create Enquiry
          </button>
        </div>
      </div>

      {/* AI Email Parser Section */}
      <div className="bg-bg-tertiary border border-border rounded-md shadow-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-display font-bold text-text-primary flex items-center gap-2">
            🪄 AI Email Parser
          </h2>
          <span className="text-xs text-text-secondary">Paste an email → AI fills the form automatically</span>
        </div>
        <textarea
          rows={4}
          value={emailParserText}
          onChange={e => setEmailParserText(e.target.value)}
          className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary resize-none"
          placeholder="Paste the raw email content here..."
        />
        <div className="flex gap-3 mt-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-border text-text-secondary text-sm rounded-md hover:bg-[var(--hover-bg)] transition-colors">
            📋 Load sample email
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-accent-primary/10 text-accent-primary text-sm rounded-md hover:bg-accent-primary/20 transition-colors">
            🪄 Parse with AI
          </button>
        </div>
      </div>

      {/* Client Details Section */}
      <div className="bg-bg-tertiary border border-border rounded-md shadow-card p-5">
        <h2 className="text-sm font-display font-bold text-text-primary mb-4 uppercase tracking-wider">Client Details</h2>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Client Name *</label>
            <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary" placeholder="John Smith" />
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Company Name *</label>
            <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary" placeholder="ABC Constructions Pvt Ltd" />
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Contact Person</label>
            <input type="text" value={contactPerson} onChange={e => setContactPerson(e.target.value)} className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary" placeholder="Procurement Manager" />
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Phone</label>
            <input type="text" value={contactNumber} onChange={e => setContactNumber(e.target.value)} className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary" placeholder="+91 98765 43210" />
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary" placeholder="contact@company.com" />
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Enquiry Source</label>
            <select value={enquirySource} onChange={e => setEnquirySource(e.target.value)} className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary">
              <option value="">Select source</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="walk-in">Walk-in</option>
              <option value="reference">Reference</option>
            </select>
          </div>
        </div>
      </div>

      {/* Line Items Section */}
      <div className="bg-bg-tertiary border border-border rounded-md shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-display font-bold text-text-primary uppercase tracking-wider">Item Details</h2>
          <button 
            onClick={addLineItem}
            className="flex items-center gap-1.5 text-xs font-body font-medium text-accent-primary bg-accent-primary/10 px-3 py-1.5 rounded hover:bg-accent-primary/20 transition-colors"
          >
            <Plus size={14} /> Add Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-xs font-body font-semibold text-text-muted">Item Name / Code</th>
                <th className="pb-3 text-xs font-body font-semibold text-text-muted">Specification</th>
                <th className="pb-3 text-xs font-body font-semibold text-text-muted">Grade</th>
                <th className="pb-3 text-xs font-body font-semibold text-text-muted w-24">Qty</th>
                <th className="pb-3 text-xs font-body font-semibold text-text-muted w-20">UOM</th>
                <th className="pb-3 text-xs font-body font-semibold text-text-muted w-10"></th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, index) => (
                <tr key={item.id} className="border-b border-border/50">
                  <td className="py-3 pr-3">
                    <select 
                      value={item.itemCode}
                      onChange={(e) => handleItemSelect(item.id, e.target.value)}
                      className="w-full bg-bg-primary border border-border rounded py-2 px-2 text-sm font-body text-text-primary"
                    >
                      <option value="">Select an item...</option>
                      {itemsData.map(i => (
                        <option key={i.code} value={i.code}>{i.name} ({i.code})</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 pr-3">
                    <input type="text" value={item.specification} onChange={e => updateLineItem(item.id, 'specification', e.target.value)} className="w-full bg-bg-primary border border-border rounded py-2 px-2 text-sm font-body text-text-primary" placeholder="Spec" />
                  </td>
                  <td className="py-3 pr-3">
                    <input type="text" value={item.grade} onChange={e => updateLineItem(item.id, 'grade', e.target.value)} className="w-full bg-bg-primary border border-border rounded py-2 px-2 text-sm font-body text-text-primary" placeholder="Grade" />
                  </td>
                  <td className="py-3 pr-3">
                    <input type="number" value={item.qty} onChange={e => updateLineItem(item.id, 'qty', e.target.value)} className="w-full bg-bg-primary border border-border rounded py-2 px-2 text-sm font-body text-text-primary" placeholder="0" />
                  </td>
                  <td className="py-3 pr-3">
                    <input type="text" value={item.uom} readOnly className="w-full bg-bg-secondary border border-border rounded py-2 px-2 text-sm font-body text-text-muted cursor-not-allowed" />
                  </td>
                  <td className="py-3 text-right">
                    <button 
                      onClick={() => removeLineItem(item.id)}
                      disabled={lineItems.length === 1}
                      className="text-text-muted hover:text-status-danger disabled:opacity-30 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Details Section */}
      <div className="bg-bg-tertiary border border-border rounded-md shadow-card p-5">
        <h2 className="text-sm font-display font-bold text-text-primary mb-4 uppercase tracking-wider">📋 Project Details</h2>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Project Name *</label>
            <input type="text" value={projectName} onChange={e => setProjectName(e.target.value)} className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary" placeholder="Prestige City Tower A – Bangalore" />
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Delivery Location *</label>
            <input type="text" value={deliveryLocation} onChange={e => setDeliveryLocation(e.target.value)} className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary" placeholder="Bangalore, Karnataka" />
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Payment Terms</label>
            <select value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary">
              <option value="">Select terms</option>
              <option value="advance">100% Advance</option>
              <option value="30days">Net 30 Days</option>
              <option value="60days">Net 60 Days</option>
              <option value="lc">Letter of Credit</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Assigned To (Sales)</label>
            <input type="text" value={assignedTo} onChange={e => setAssignedTo(e.target.value)} className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary" placeholder="Sales rep name" />
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Required By Date</label>
            <input type="date" value={requiredBy} onChange={e => setRequiredBy(e.target.value)} className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary" />
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Next Follow-up Date</label>
            <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary" />
          </div>
        </div>
        <div className="mt-5">
          <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Notes / Special Requirements</label>
          <textarea rows={3} value={remarks} onChange={e => setRemarks(e.target.value)} className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary resize-none" placeholder="Additional information, delivery schedule, quality specs..." />
        </div>
      </div>

      {/* Attachment Section */}
      <div className="bg-bg-tertiary border border-border rounded-md shadow-card p-5">
        <h2 className="text-sm font-display font-bold text-text-primary mb-4 uppercase tracking-wider">📎 Attachment</h2>
        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-border rounded-md cursor-pointer hover:bg-[var(--hover-bg)] transition-colors">
          <div className="text-center">
            <div className="text-3xl mb-2">📤</div>
            <p className="text-sm font-body text-text-primary">Drag & drop your file here</p>
            <p className="text-xs text-text-secondary mt-1">or click to browse · PDF, Images, Word – max 10MB</p>
          </div>
          <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={e => setAttachment(e.target.files?.[0] || null)} />
        </label>
        {attachment && <p className="text-xs text-accent-primary mt-2">📎 {attachment.name}</p>}
      </div>

      {/* Bottom action buttons */}
      <div className="flex justify-end gap-3">
        <button className="px-5 py-2 border border-border text-text-secondary text-sm rounded-md hover:bg-[var(--hover-bg)] transition-colors">Cancel</button>
      </div>

      <Toast message="Enquiry created successfully!" isVisible={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
};

export default NewEnquiry;
