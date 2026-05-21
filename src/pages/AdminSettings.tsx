import React, { useState } from 'react';
import { Save, Building2, Calculator, MessageSquare, Mail } from 'lucide-react';
import Toast from '../components/ui/Toast';

const tabs = ['Company Profile', 'Pricing Defaults', 'Message Templates'];

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [showToast, setShowToast] = useState(false);

  return (
    <div className="max-w-5xl space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">Admin Settings</h1>
          <p className="text-sm font-body text-text-secondary mt-1">Configure company profile, pricing rules, and templates.</p>
        </div>
        <button 
          onClick={() => setShowToast(true)}
          className="flex items-center gap-2 bg-accent-primary hover:bg-accent-secondary text-white text-sm font-body font-medium px-4 py-2.5 rounded-md transition-colors duration-150"
        >
          <Save size={16} />
          Save Changes
        </button>
      </div>

      <div className="flex gap-6 items-start">
        {/* Vertical Tabs */}
        <div className="w-64 flex-shrink-0 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-body font-medium transition-all duration-150 text-left ${
                activeTab === tab 
                ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20' 
                : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary border border-transparent'
              }`}
            >
              {tab === 'Company Profile' && <Building2 size={18} />}
              {tab === 'Pricing Defaults' && <Calculator size={18} />}
              {tab === 'Message Templates' && <MessageSquare size={18} />}
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-bg-tertiary border border-border rounded-md shadow-card p-6">
          
          {activeTab === 'Company Profile' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-sm font-display font-bold text-text-primary uppercase tracking-wider border-b border-border pb-3">Company Details</h2>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Company Name</label>
                  <input type="text" defaultValue="Omnia Steels Pvt Ltd" className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary" />
                </div>
                <div>
                  <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Tax ID / GSTIN</label>
                  <input type="text" defaultValue="36AAAAO1234A1Z5" className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary font-mono" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Registered Address</label>
                  <textarea rows={3} defaultValue="Plot No. 45, Industrial Area, IDA Jeedimetla, Hyderabad, Telangana - 500055" className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Primary Contact Email</label>
                  <input type="email" defaultValue="info@omniasteels.com" className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary" />
                </div>
                <div>
                  <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Support Phone</label>
                  <input type="text" defaultValue="+91 40 1234 5678" className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Pricing Defaults' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-sm font-display font-bold text-text-primary uppercase tracking-wider border-b border-border pb-3">Global Pricing Rules</h2>
              
              <div className="grid grid-cols-2 gap-5 max-w-lg">
                <div>
                  <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Default Margin %</label>
                  <div className="relative">
                    <input type="number" defaultValue="5" className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 pr-8 text-sm font-body text-text-primary" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">%</span>
                  </div>
                  <p className="text-[10px] text-text-muted mt-1.5">Applied automatically to base costs in calculator.</p>
                </div>
                <div>
                  <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Default GST %</label>
                  <select className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary">
                    <option value="18">18%</option>
                    <option value="12">12%</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Default Transport Cost per MT (₹)</label>
                  <input type="number" defaultValue="1500" className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Message Templates' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-4 border-b border-border pb-3">
                <h2 className="text-sm font-display font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare size={16} /> WhatsApp Templates
                </h2>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="flex items-center justify-between text-xs font-body font-medium text-text-secondary mb-1.5">
                    New Enquiry Acknowledgement
                    <span className="text-[10px] text-accent-primary bg-accent-primary/10 px-2 py-0.5 rounded">Active</span>
                  </label>
                  <textarea rows={4} defaultValue="Hello *{{client_name}}*,\n\nThank you for your enquiry (*{{rfq_id}}*) for {{quantity}} MT of {{material}}.\n\nOur team is currently reviewing the best rates for you. We will share a formal quotation shortly." className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-mono text-text-primary resize-none" />
                </div>
                
                <div>
                  <label className="flex items-center justify-between text-xs font-body font-medium text-text-secondary mb-1.5">
                    Dispatch Update
                    <span className="text-[10px] text-accent-primary bg-accent-primary/10 px-2 py-0.5 rounded">Active</span>
                  </label>
                  <textarea rows={4} defaultValue="Update for *{{client_name}}*:\n\nYour order against {{rfq_id}} ({{material}}) has been dispatched!\n\nThe vehicle details and tracking link will follow in a separate message." className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-mono text-text-primary resize-none" />
                </div>
              </div>

              <div className="flex items-center gap-4 border-b border-border pb-3 pt-4">
                <h2 className="text-sm font-display font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                  <Mail size={16} /> Email Templates
                </h2>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="flex items-center justify-between text-xs font-body font-medium text-text-secondary mb-1.5">
                    {"Quotation Sent (Subject: Quotation for {{rfq_id}})"}
                  </label>
                  <textarea rows={4} defaultValue="Dear {{contact_name}},\n\nPlease find attached the quotation for your recent enquiry.\n\nIf you have any questions, feel free to reply to this email." className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-mono text-text-primary resize-none" />
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      <Toast message="Settings saved successfully" isVisible={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
};

export default AdminSettings;
