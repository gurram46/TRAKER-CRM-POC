import React, { useState } from 'react';
import { Save, Building2, Calculator, MessageSquare, Mail, FileText, DollarSign } from 'lucide-react';
import Toast from '../components/ui/Toast';

const tabs = [
  { id: 'company', label: 'Company', icon: Building2 },
  { id: 'pricing', label: 'Pricing', icon: Calculator },
  { id: 'finance', label: 'Finance', icon: DollarSign },
  { id: 'terms', label: 'Terms & Conditions', icon: FileText },
  { id: 'email', label: 'Email Templates', icon: Mail },
  { id: 'whatsapp', label: 'WhatsApp Templates', icon: MessageSquare },
];

const emailTemplates = [
  { id: 'quotation', label: 'Quotation', subject: 'Quotation for [Project Name] – Omnia Steels', body: `Dear [Client Name],\n\nPlease find attached our quotation for [Project Name].\n\nRef: [Quotation ID]  ·  Valid Until: [Valid Date]  ·  Value: [Amount]\n\nWe look forward to your confirmation. Feel free to reach out for any clarifications.\n\nBest Regards,\nOmnia Steels Pvt Ltd` },
  { id: 'revised', label: 'Revised Quotation', subject: 'Revised Quotation for [Project Name] – Omnia Steels', body: `Dear [Client Name],\n\nPlease find the revised quotation for [Project Name] as discussed.\n\nRevised Ref: [Quotation ID]  ·  Valid Until: [Valid Date]  ·  Value: [Amount]\n\nWe trust this meets your requirements.\n\nBest Regards,\nOmnia Steels Pvt Ltd` },
  { id: 'followup', label: 'Follow-up', subject: 'Follow-up: Quotation for [Project Name]', body: `Dear [Client Name],\n\nThis is a gentle follow-up on our quotation [Quotation ID] dated [Date] for [Project Name].\n\nWe would be happy to discuss any modifications or answer queries.\n\nBest Regards,\nOmnia Steels Pvt Ltd` },
  { id: 'payment', label: 'Payment Reminder', subject: 'Payment Reminder – Invoice [Invoice No]', body: `Dear [Client Name],\n\nThis is a reminder that Invoice [Invoice No] for [Amount] is due on [Due Date].\n\nKindly arrange payment at the earliest. Contact us for any queries.\n\nBest Regards,\nOmnia Steels Pvt Ltd` },
  { id: 'dispatch', label: 'Dispatch Notification', subject: 'Shipment Dispatched – [Shipment ID]', body: `Dear [Client Name],\n\nYour order [Shipment ID] has been dispatched.\n\nMaterial: [Material]  ·  Qty: [Qty]\nVehicle: [Vehicle No]  ·  Driver: [Driver] – [Phone]\nExpected Delivery: [Date]\n\nPlease confirm receipt upon delivery.\n\nBest Regards,\nOmnia Steels Pvt Ltd` },
];

const waTemplates = [
  { id: 'enquiry', label: 'New Enquiry Notification', body: `*New Enquiry Received*\n- - - - - - - - - - - - - -\n*Client:* [Client]\n*Project:* [Project]\n*Items:* [Items]\n*Ref:* [Ref ID]\n\nPlease review and prepare quotation at the earliest.\n\n– Omnia Steels` },
  { id: 'quotation', label: 'Quotation Sent', body: `*Quotation Ready – [Quotation ID]*\n- - - - - - - - - - - - - -\n*Client:* [Client]\n*Project:* [Project]\n*Quote Value:* [Amount]\n*Valid Until:* [Date]\n\nAwaiting your confirmation. Please revert at the earliest.\n\n– Omnia Steels` },
  { id: 'dispatch', label: 'Dispatch Update', body: `*Shipment Dispatched – [Shipment ID]* 🚚\n- - - - - - - - - - - - - -\n*Client:* [Client]\n*Material:* [Material] ([Qty])\n*Vehicle:* [Vehicle]\n*Driver:* [Driver] · [Phone]\n*Route:* [Origin] → [Destination]\n*Expected Delivery:* [Date]\n\nPlease confirm receipt upon delivery.\n\n– Omnia Steels` },
  { id: 'payment', label: 'Payment Reminder', body: `*Payment Reminder* ⚠️\n- - - - - - - - - - - - - -\n*Client:* [Client]\n*Invoice:* [Invoice No]\n*Amount Due:* [Amount]\n*Due Date:* [Date]\n*Status:* Overdue\n\nKindly arrange payment at the earliest.\n\n– Omnia Steels` },
];

const variables = {
  email: ['[Client Name]', '[Project Name]', '[Quotation ID]', '[Amount]', '[Date]', '[Invoice No]'],
  whatsapp: ['[Client]', '[Project]', '[Amount]', '[Date]', '[Ref ID]', '[Shipment ID]'],
};

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [showToast, setShowToast] = useState(false);
  const [logoUploaded, setLogoUploaded] = useState(false);
  const [emailBodies, setEmailBodies] = useState(Object.fromEntries(emailTemplates.map(t => [t.id, t.body])));
  const [emailSubjects, setEmailSubjects] = useState(Object.fromEntries(emailTemplates.map(t => [t.id, t.subject])));
  const [waBodies, setWaBodies] = useState(Object.fromEntries(waTemplates.map(t => [t.id, t.body])));

  const inputCls = "w-full bg-bg-primary border border-border rounded-lg py-2.5 px-3 text-sm font-body text-text-primary";
  const labelCls = "block text-xs font-body font-medium text-text-secondary mb-1.5";
  const sectionCls = "text-xs font-body font-bold text-text-muted uppercase tracking-widest border-b border-border pb-2 mb-5";

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">Admin Settings</h1>
          <p className="text-sm font-body text-text-secondary mt-0.5">Configure company details, pricing defaults, templates, and legal terms.</p>
        </div>
      </div>

      <div className="flex gap-6 items-start">
        {/* Sidebar */}
        <div className="w-56 flex-shrink-0 space-y-0.5">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body font-medium transition-all text-left ${activeTab === tab.id ? 'bg-accent-primary/10 text-accent-primary' : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'}`}>
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-5">

          {activeTab === 'company' && (
            <div className="bg-bg-tertiary border border-border rounded-xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-2 mb-5">
                <p className="text-xs font-body font-bold text-text-muted uppercase tracking-widest">Company Settings</p>
                <button onClick={() => setShowToast(true)} className="flex items-center gap-1.5 bg-accent-primary hover:bg-accent-secondary text-white text-xs font-body font-medium px-3 py-1.5 rounded-md transition-colors"><Save size={13} /> Save</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Company Name</label><input type="text" defaultValue="Omnia Steels Pvt Ltd" className={inputCls} /></div>
                <div><label className={labelCls}>Brand Name</label><input type="text" defaultValue="Smart Steel Solution" className={inputCls} /></div>
                <div className="col-span-2"><label className={labelCls}>Tagline <span className="text-text-muted font-normal">shown on quotes & emails</span></label><input type="text" defaultValue="Smart Automation for Steel Business Success" className={inputCls} /></div>
                <div><label className={labelCls}>Company Phone</label><input type="text" defaultValue="+91 98765 43210" className={inputCls} /></div>
                <div><label className={labelCls}>Reply-from Email</label><input type="email" defaultValue="enquiries@omniasteels.com" className={inputCls} /></div>
                <div><label className={labelCls}>Tax ID / GSTIN</label><input type="text" defaultValue="36AAAAO1234A1Z5" className={`${inputCls} font-mono`} /></div>
                <div><label className={labelCls}>Support Phone</label><input type="text" defaultValue="+91 40 1234 5678" className={inputCls} /></div>
                <div className="col-span-2"><label className={labelCls}>Registered Address</label><textarea rows={3} defaultValue="Plot No. 45, Industrial Area, IDA Jeedimetla, Hyderabad, Telangana - 500055" className={`${inputCls} resize-none`} /></div>
              </div>
              <div>
                <label className={labelCls}>Company Logo</label>
                <div onClick={() => setLogoUploaded(true)}
                  className="border-2 border-dashed border-border rounded-xl p-6 flex items-center gap-4 cursor-pointer hover:border-accent-primary/50 transition-colors">
                  {logoUploaded ? (
                    <>
                      <div className="w-12 h-12 bg-accent-primary/10 rounded-lg flex items-center justify-center text-accent-primary font-bold text-lg">OS</div>
                      <div><p className="text-sm font-body font-medium text-text-primary">Logo uploaded</p><p className="text-xs text-text-muted">Click or drag to replace · PNG, SVG</p></div>
                    </>
                  ) : (
                    <p className="text-sm text-text-muted">Click or drag to upload logo · PNG, SVG</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="bg-bg-tertiary border border-border rounded-xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-2 mb-5">
                <p className="text-xs font-body font-bold text-text-muted uppercase tracking-widest">Pricing Settings</p>
                <button onClick={() => setShowToast(true)} className="flex items-center gap-1.5 bg-accent-primary hover:bg-accent-secondary text-white text-xs font-body font-medium px-3 py-1.5 rounded-md transition-colors"><Save size={13} /> Save</button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Default Margin % <span className="text-text-muted font-normal">applied to all quotes</span></label>
                  <div className="relative"><input type="number" defaultValue="12" className={inputCls} /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">%</span></div>
                </div>
                <div>
                  <label className={labelCls}>Default GST %</label>
                  <select className={inputCls}><option>18</option><option>12</option><option>5</option></select>
                </div>
                <div>
                  <label className={labelCls}>Default Currency</label>
                  <select className={inputCls}><option>INR ₹ – Indian Rupee</option><option>USD $</option></select>
                </div>
                <div className="col-span-3">
                  <label className={labelCls}>Default Transport Cost per MT (₹)</label>
                  <input type="number" defaultValue="1500" className={inputCls} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'finance' && (
            <div className="bg-bg-tertiary border border-border rounded-xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-2 mb-5">
                <p className="text-xs font-body font-bold text-text-muted uppercase tracking-widest">Finance Settings</p>
                <button onClick={() => setShowToast(true)} className="flex items-center gap-1.5 bg-accent-primary hover:bg-accent-secondary text-white text-xs font-body font-medium px-3 py-1.5 rounded-md transition-colors"><Save size={13} /> Save</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Payment Terms Default</label>
                  <select className={inputCls}><option>Net 30</option><option>Net 15</option><option>Net 60</option><option>Advance</option></select>
                </div>
                <div>
                  <label className={labelCls}>Quotation Valid Days</label>
                  <input type="number" defaultValue="7" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Late Payment Interest % p.a.</label>
                  <input type="number" defaultValue="18" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Invoice Prefix</label>
                  <input type="text" defaultValue="INV-OS-" className={inputCls} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="bg-bg-tertiary border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-2 mb-5">
                <p className="text-xs font-body font-bold text-text-muted uppercase tracking-widest">Terms & Conditions</p>
                <button onClick={() => setShowToast(true)} className="flex items-center gap-1.5 bg-accent-primary hover:bg-accent-secondary text-white text-xs font-body font-medium px-3 py-1.5 rounded-md transition-colors"><Save size={13} /> Save</button>
              </div>
              <textarea rows={10} className={`${inputCls} resize-none font-mono text-xs`}
                defaultValue={`1. All prices quoted are exclusive of GST and subject to revision without prior notice.\n2. Delivery timelines are indicative and subject to material availability and logistic conditions.\n3. Payment must be made as per agreed credit terms. Interest @ 18% p.a. will be charged on overdue amounts.\n4. All disputes shall be subject to the exclusive jurisdiction of courts in [City].\n5. Material quality shall conform to relevant IS/BIS standards. Claims must be raised within 7 days of delivery.`} />
              <p className="text-xs text-text-muted">These appear at the bottom of every generated quotation PDF.</p>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-4">
              <div className="bg-bg-tertiary border border-border rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <p className="text-xs font-body font-bold text-text-muted uppercase tracking-widest">Email Templates</p>
                  <button onClick={() => setShowToast(true)} className="flex items-center gap-1.5 bg-accent-primary hover:bg-accent-secondary text-white text-xs font-body font-medium px-3 py-1.5 rounded-md transition-colors"><Save size={13} /> Save</button>
                </div>
                <div className="bg-bg-primary border border-border rounded-xl px-5 py-3 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-text-muted font-body">Variables:</span>
                  {variables.email.map(v => <span key={v} className="text-xs font-mono bg-bg-secondary border border-border px-2 py-0.5 rounded text-text-secondary">{v}</span>)}
                </div>
              </div>
              {emailTemplates.map(t => (
                <div key={t.id} className="bg-bg-tertiary border border-border rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-accent-primary" />
                    <p className="text-sm font-body font-semibold text-text-primary">{t.label}</p>
                  </div>
                  <div>
                    <label className={labelCls}>Subject</label>
                    <input type="text" value={emailSubjects[t.id]} onChange={e => setEmailSubjects(p => ({...p, [t.id]: e.target.value}))} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Body</label>
                    <textarea rows={6} value={emailBodies[t.id]} onChange={e => setEmailBodies(p => ({...p, [t.id]: e.target.value}))} className={`${inputCls} resize-none font-mono text-xs`} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'whatsapp' && (
            <div className="space-y-4">
              <div className="bg-bg-tertiary border border-border rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <p className="text-xs font-body font-bold text-text-muted uppercase tracking-widest">WhatsApp Templates</p>
                  <button onClick={() => setShowToast(true)} className="flex items-center gap-1.5 bg-accent-primary hover:bg-accent-secondary text-white text-xs font-body font-medium px-3 py-1.5 rounded-md transition-colors"><Save size={13} /> Save</button>
                </div>
                <div className="bg-bg-primary border border-border rounded-xl px-5 py-3 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-text-muted font-body">Variables:</span>
                  {variables.whatsapp.map(v => <span key={v} className="text-xs font-mono bg-bg-secondary border border-border px-2 py-0.5 rounded text-text-secondary">{v}</span>)}
                </div>
              </div>
              {waTemplates.map(t => (
                <div key={t.id} className="grid grid-cols-2 gap-4">
                  <div className="bg-bg-tertiary border border-border rounded-xl p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare size={14} className="text-[#25D366]" />
                      <p className="text-sm font-body font-semibold text-text-primary">{t.label}</p>
                    </div>
                    <textarea rows={8} value={waBodies[t.id]} onChange={e => setWaBodies(p => ({...p, [t.id]: e.target.value}))} className={`${inputCls} resize-none font-mono text-xs`} />
                  </div>
                  {/* Live Preview Bubble */}
                  <div className="bg-[#EFEAE2] rounded-xl p-4 flex items-start justify-end">
                    <div className="max-w-[90%] bg-[#D9FDD3] rounded-xl rounded-tr-none p-3 shadow-sm relative">
                      <p className="text-[12px] text-[#111B21] whitespace-pre-wrap leading-relaxed font-sans">{waBodies[t.id]}</p>
                      <p className="text-[10px] text-[#667781] text-right mt-1">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
                      </p>
                      <div className="absolute top-0 -right-2 w-0 h-0 border-l-[10px] border-l-[#D9FDD3] border-b-[10px] border-b-transparent" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      <Toast message="Settings saved successfully" isVisible={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
};

export default AdminSettings;
