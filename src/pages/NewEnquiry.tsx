import React, { useState } from 'react';
import { Plus, Trash2, Save, Send } from 'lucide-react';
import { itemsData } from '../data/dummyData';
import Toast from '../components/ui/Toast';

const NewEnquiry: React.FC = () => {
  const [clientName, setClientName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [requiredBy, setRequiredBy] = useState('');
  const [remarks, setRemarks] = useState('');
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

      {/* Client Details Section */}
      <div className="bg-bg-tertiary border border-border rounded-md shadow-card p-5">
        <h2 className="text-sm font-display font-bold text-text-primary mb-4 uppercase tracking-wider">Client Details</h2>
        <div className="grid grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Client Name *</label>
            <input 
              type="text" 
              value={clientName} 
              onChange={e => setClientName(e.target.value)} 
              className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary" 
              placeholder="E.g., Vijaya Constructions" 
            />
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Contact Number</label>
            <input 
              type="text" 
              value={contactNumber} 
              onChange={e => setContactNumber(e.target.value)} 
              className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary" 
              placeholder="9XXXXXXXXX" 
            />
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Required By Date</label>
            <input 
              type="date" 
              value={requiredBy} 
              onChange={e => setRequiredBy(e.target.value)} 
              className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary text-text-secondary" 
            />
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

      <div className="bg-bg-tertiary border border-border rounded-md shadow-card p-5">
        <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Internal Remarks / Notes</label>
        <textarea 
          rows={3} 
          value={remarks} 
          onChange={e => setRemarks(e.target.value)} 
          className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary resize-none" 
          placeholder="Any special instructions for the vendor..." 
        />
      </div>

      <Toast message="Enquiry created successfully!" isVisible={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
};

export default NewEnquiry;
