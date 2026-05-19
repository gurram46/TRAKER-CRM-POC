import React, { useState } from 'react';
import { Zap, Mail, MessageCircle, RefreshCw, CalendarCheck, Clock, CheckCircle2 } from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  lastTriggered: string;
  isActive: boolean;
  icon: React.ElementType;
}

const initialRules: AutomationRule[] = [
  {
    id: 'a1',
    name: 'New email enquiry \u2192 Auto create RFQ',
    trigger: 'Incoming email with material intent',
    action: 'Create RFQ & Parse Details',
    lastTriggered: '10 mins ago',
    isActive: true,
    icon: Mail,
  },
  {
    id: 'a2',
    name: 'Quotation approved \u2192 Send WhatsApp to client',
    trigger: 'Quotation Status = Approved',
    action: 'Send WhatsApp Confirmation',
    lastTriggered: '2 hours ago',
    isActive: true,
    icon: MessageCircle,
  },
  {
    id: 'a3',
    name: 'Payment overdue 3 days \u2192 Send reminder email',
    trigger: 'Payment Date > 3 days past due',
    action: 'Send Email Reminder',
    lastTriggered: '1 day ago',
    isActive: true,
    icon: Clock,
  },
  {
    id: 'a4',
    name: 'RFQ no response 3 days \u2192 Create follow-up task',
    trigger: 'RFQ Status = Sent & Age > 3 days',
    action: 'Create Follow-up',
    lastTriggered: '5 hours ago',
    isActive: true,
    icon: CalendarCheck,
  },
  {
    id: 'a5',
    name: 'Shipment dispatched \u2192 Notify client on WhatsApp',
    trigger: 'Logistics Status = Dispatched',
    action: 'Send WhatsApp Tracking Link',
    lastTriggered: '30 mins ago',
    isActive: true,
    icon: MessageCircle,
  },
  {
    id: 'a6',
    name: 'Invoice raised \u2192 Send to client email',
    trigger: 'Invoice Created',
    action: 'Email Invoice to Client',
    lastTriggered: 'Never',
    isActive: false,
    icon: Mail,
  },
];

const Automations: React.FC = () => {
  const [rules, setRules] = useState(initialRules);

  const toggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary flex items-center gap-2">
            <Zap className="text-accent-primary" size={24} />
            Automations
          </h1>
          <p className="text-sm font-body text-text-secondary mt-1">Manage automated workflows across CRM modules</p>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rules.map((rule) => (
          <div key={rule.id} className={`bg-bg-tertiary border rounded-xl p-5 shadow-sm transition-all duration-200 relative overflow-hidden ${rule.isActive ? 'border-status-success/30' : 'border-border opacity-75'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${rule.isActive ? 'bg-accent-primary/10 text-accent-primary' : 'bg-bg-secondary text-text-muted'}`}>
                <rule.icon size={20} />
              </div>
              
              {/* Toggle Switch */}
              <button 
                onClick={() => toggleRule(rule.id)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${rule.isActive ? 'bg-status-success' : 'bg-bg-secondary'}`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${rule.isActive ? 'translate-x-4.5' : 'translate-x-1'}`} />
              </button>
            </div>

            <h3 className="font-display font-semibold text-text-primary text-sm mb-3 pr-2">{rule.name}</h3>
            
            <div className="space-y-2 mb-4 border-t border-border/50 pt-3">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-0.5">Trigger</span>
                <span className="text-xs font-body text-text-secondary">{rule.trigger}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-0.5">Action</span>
                <span className="text-xs font-body text-text-secondary">{rule.action}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-text-muted bg-bg-primary/50 -mx-5 -mb-5 px-5 py-2.5 border-t border-border">
              <span>Last Run: {rule.lastTriggered}</span>
              {rule.isActive ? (
                <span className="text-status-success flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" /> Active</span>
              ) : (
                <span className="text-text-muted">Paused</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Activity Log */}
      <div className="mt-8 bg-bg-tertiary border border-border rounded-xl shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-bg-secondary">
          <h3 className="font-display font-semibold text-text-primary text-sm flex items-center gap-2">
            <RefreshCw size={14} className="text-text-muted" />
            Recent Automation Activity
          </h3>
        </div>
        <div className="divide-y divide-border">
          {[
            { time: '10 mins ago', title: 'RFQ Created', desc: 'Parsed from enquiry email "HR Coil Requirement" from info@omniasteels.com' },
            { time: '30 mins ago', title: 'WhatsApp Sent', desc: 'Dispatched notification sent to Vijaya Constructions for SHP-2024-0034' },
            { time: '2 hours ago', title: 'WhatsApp Sent', desc: 'Quotation approved confirmation to Rajesh Gupta' },
            { time: '5 hours ago', title: 'Task Created', desc: 'Follow-up task created for RFQ-2024-0043 (No response in 3 days)' },
            { time: '1 day ago', title: 'Email Sent', desc: 'Payment reminder sent to KVR Builders for Invoice #INV-2024-112' },
          ].map((log, idx) => (
            <div key={idx} className="p-4 flex items-start gap-4 hover:bg-bg-hover transition-colors">
              <div className="mt-0.5">
                <CheckCircle2 size={16} className="text-status-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-body font-medium text-text-primary">{log.title}</p>
                <p className="text-xs font-body text-text-secondary mt-0.5">{log.desc}</p>
              </div>
              <div className="text-[11px] font-mono text-text-muted">{log.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Automations;
