import React, { useState, useCallback } from 'react';
import { Check, CalendarClock, MessageCircle } from 'lucide-react';
import { followUpData } from '../data/dummyData';
import WhatsAppModal from '../components/ui/WhatsAppModal';
import Toast from '../components/ui/Toast';

const filterTabs = ['All', 'Today', 'Overdue', 'Upcoming', 'Completed'] as const;

const borderColor: Record<string, string> = {
  Overdue: 'border-l-status-danger',
  Today: 'border-l-status-warning',
  Upcoming: 'border-l-border',
  Completed: 'border-l-status-success',
};

const FollowupTracker: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [waRecipient, setWaRecipient] = useState('');
  const [waMessage, setWaMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const filtered = activeFilter === 'All' ? followUpData : followUpData.filter(f => f.status === activeFilter);

  const counts = {
    open: followUpData.filter(f => f.status !== 'Completed').length,
    today: followUpData.filter(f => f.status === 'Today').length,
    overdue: followUpData.filter(f => f.status === 'Overdue').length,
    completedWeek: followUpData.filter(f => f.status === 'Completed').length,
  };

  const handleWhatsApp = useCallback((clientName: string, subject: string) => {
    setWaRecipient(clientName);
    // Find the follow-up to get material info from subject
    const materialMatch = subject.match(/(HR Coil|CR Sheet|MS Pipe|Angle Iron|TMT Bars|Chequered Plate|GI Sheet|Structural Steel)/i);
    const material = materialMatch ? materialMatch[1] : 'your recent enquiry';
    setWaMessage(
      `Hi ${clientName},\n\nThis is Ram from Omnia Steels. Following up on your enquiry for ${material}. Please let us know if you'd like to proceed.\n\nWe're happy to revise the quotation or discuss any specific requirements you may have.\n\nThank you.\n\nRegards,\nRam Sharma\nOmnia Steels Pvt Ltd\n+91 98765 43210`
    );
    setShowWhatsApp(true);
  }, []);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-display font-bold text-text-primary">Follow-up Tracker</h1>

      {/* Header Stats */}
      <div className="flex items-center gap-6">
        {[
          { label: 'Total Open', value: counts.open, color: 'text-accent-primary' },
          { label: 'Due Today', value: counts.today, color: 'text-status-warning' },
          { label: 'Overdue', value: counts.overdue, color: 'text-status-danger' },
          { label: 'Completed This Week', value: counts.completedWeek, color: 'text-status-success' },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className={`text-xl font-display font-bold ${s.color}`}>{s.value}</span>
            <span className="text-xs font-body text-text-secondary">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1.5fr_1fr] gap-5">
        {/* Left — Follow-up List */}
        <div className="space-y-4">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-2 text-xs font-body font-medium rounded-full border transition-all duration-150
                  ${activeFilter === tab ? 'bg-accent-primary text-white border-accent-primary' : 'bg-transparent text-text-secondary border-border hover:text-text-primary'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="space-y-3">
            {filtered.map((fu, idx) => (
              <div
                key={fu.id}
                className={`bg-bg-tertiary border border-border ${borderColor[fu.status]} border-l-[3px] rounded-md p-4 shadow-card hover:bg-bg-hover transition-colors duration-150`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center border border-accent-primary/20">
                      <span className="text-[11px] font-display font-bold text-accent-primary">{fu.initials}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-body font-semibold text-text-primary">{fu.client}</p>
                        {[0, 2].includes(idx) && (
                          <span className="flex items-center gap-1.5 text-[10px] font-body font-medium text-[#0066FF] bg-[#0066FF]/10 px-2 py-0.5 rounded border border-[#0066FF]/20">
                            <span className="font-bold text-[#0066FF] tracking-wide">ZOHO</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-body text-text-muted">RE: {fu.rfqRef}</p>
                    </div>
                  </div>
                  {fu.status === 'Overdue' && fu.daysOverdue && (
                    <span className="text-[10px] font-mono font-medium text-status-danger bg-status-danger/10 px-2 py-0.5 rounded-full border border-status-danger/20">
                      OVERDUE {fu.daysOverdue}d
                    </span>
                  )}
                  {fu.status === 'Today' && (
                    <span className="text-[10px] font-mono font-medium text-status-warning bg-status-warning/10 px-2 py-0.5 rounded-full border border-status-warning/20">
                      DUE TODAY
                    </span>
                  )}
                  {fu.status === 'Completed' && (
                    <span className="text-[10px] font-mono font-medium text-status-success bg-status-success/10 px-2 py-0.5 rounded-full border border-status-success/20">
                      DONE
                    </span>
                  )}
                </div>

                <p className="text-xs font-body text-text-secondary mb-1">{fu.subject}</p>
                <p className="text-[11px] font-body text-text-muted mb-3">
                  Last contact: {fu.lastContact} via {fu.lastContactMethod}
                </p>
                <p className="text-xs font-body text-text-secondary mb-3">
                  <span className="text-text-muted">Next:</span> {fu.nextAction}
                </p>

                {fu.status !== 'Completed' && (
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-body font-medium text-status-success bg-status-success/10 border border-status-success/20 rounded-md hover:bg-status-success/20 transition-colors">
                      <Check size={12} />
                      Mark Done
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-body font-medium text-text-secondary border border-border rounded-md hover:bg-bg-hover transition-colors">
                      <CalendarClock size={12} />
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleWhatsApp(fu.client, fu.subject)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-body font-medium text-[#25D366] bg-[#25D366]/10 border border-[#25D366]/20 rounded-md hover:bg-[#25D366]/20 transition-colors"
                    >
                      <MessageCircle size={12} />
                      WhatsApp
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right — Quick Add Form */}
        <div className="bg-bg-tertiary border border-border rounded-md p-5 shadow-card sticky top-0 h-fit">
          <h3 className="text-sm font-display font-semibold text-text-primary mb-4">Quick Add Follow-up</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Client Name</label>
              <input type="text" className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary" placeholder="Enter or select client" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Related To</label>
                <select className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-secondary">
                  <option>RFQ</option>
                  <option>Quotation</option>
                  <option>Payment</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Reference ID</label>
                <input type="text" className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-mono text-text-primary" placeholder="#RFQ-" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Follow-up Date</label>
                <input type="date" className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-secondary" />
              </div>
              <div>
                <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Type</label>
                <select className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-secondary">
                  <option>Call</option>
                  <option>Email</option>
                  <option>WhatsApp</option>
                  <option>Visit</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Notes</label>
              <textarea rows={3} className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary resize-none" placeholder="What needs to be done..." />
            </div>
            <div>
              <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Assign To</label>
              <select className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-secondary">
                <option>Ram Sharma</option>
                <option>Suresh Kumar</option>
                <option>Priya Reddy</option>
              </select>
            </div>
            <button className="w-full bg-accent-primary hover:bg-accent-secondary text-white text-sm font-body font-medium py-2.5 rounded-md transition-colors duration-150">
              Add Follow-up
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp Modal */}
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

export default FollowupTracker;
