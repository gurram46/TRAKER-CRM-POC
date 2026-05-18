import React from 'react';
import { FileText, ClipboardList, IndianRupee, Truck, Phone, AlertTriangle, Eye } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';
import RevenueChart from '../components/charts/RevenueChart';
import RFQDonutChart from '../components/charts/RFQDonutChart';
import { rfqData, dashboardFollowUps } from '../data/dummyData';

const Dashboard: React.FC = () => {
  const recentRFQs = rfqData.slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-display font-bold text-text-primary">Dashboard</h1>
        <p className="text-sm font-body text-text-secondary mt-1">Welcome back. Here's what needs your attention.</p>
      </div>

      {/* Section A — Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Active RFQs"
          value="12"
          change="+3 this week"
          changeType="positive"
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Pending Quotations"
          value="7"
          change="2 overdue"
          changeType="negative"
          icon={ClipboardList}
          color="amber"
        />
        <StatCard
          title="Payments Pending"
          value="₹4,82,000"
          change="3 invoices overdue"
          changeType="negative"
          icon={IndianRupee}
          color="red"
        />
        <StatCard
          title="Deliveries In Transit"
          value="5"
          change="1 delayed"
          changeType="neutral"
          icon={Truck}
          color="green"
        />
      </div>

      {/* Section B — Two Column */}
      <div className="grid grid-cols-[1fr_0.67fr] gap-4">
        {/* Left — Recent RFQ Activity */}
        <div className="bg-bg-tertiary border border-border rounded-md shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="text-sm font-display font-semibold text-text-primary">Recent RFQ Activity</h3>
            <button className="text-xs font-body text-accent-primary hover:text-accent-secondary transition-colors">
              View All →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-bg-secondary">
                  <th className="text-left text-[11px] font-body font-semibold text-text-muted uppercase tracking-[0.06em] px-5 py-3">RFQ ID</th>
                  <th className="text-left text-[11px] font-body font-semibold text-text-muted uppercase tracking-[0.06em] px-3 py-3">Client</th>
                  <th className="text-left text-[11px] font-body font-semibold text-text-muted uppercase tracking-[0.06em] px-3 py-3">Material</th>
                  <th className="text-right text-[11px] font-body font-semibold text-text-muted uppercase tracking-[0.06em] px-3 py-3">Qty (MT)</th>
                  <th className="text-left text-[11px] font-body font-semibold text-text-muted uppercase tracking-[0.06em] px-3 py-3">Status</th>
                  <th className="text-left text-[11px] font-body font-semibold text-text-muted uppercase tracking-[0.06em] px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentRFQs.map((rfq, idx) => (
                  <tr
                    key={rfq.id}
                    className={`border-b border-border hover:bg-bg-hover transition-colors duration-150 ${
                      idx % 2 === 0 ? 'bg-bg-tertiary' : 'bg-transparent'
                    }`}
                  >
                    <td className="px-5 py-3 text-xs font-mono text-text-muted">{rfq.id}</td>
                    <td className="px-3 py-3 text-sm font-body font-medium text-text-primary">{rfq.client}</td>
                    <td className="px-3 py-3 text-sm font-body text-text-secondary">{rfq.material}</td>
                    <td className="px-3 py-3 text-sm font-mono text-text-primary text-right">{rfq.quantity}</td>
                    <td className="px-3 py-3"><StatusBadge status={rfq.status} /></td>
                    <td className="px-5 py-3 text-xs font-body text-text-secondary">{rfq.created}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right — Follow-up Reminders */}
        <div className="bg-bg-tertiary border border-border rounded-md shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="text-sm font-display font-semibold text-text-primary">Follow-up Reminders</h3>
            <span className="flex items-center gap-1.5 text-xs font-body text-status-danger">
              <AlertTriangle size={13} />
              5 Overdue
            </span>
          </div>
          <div className="divide-y divide-border">
            {dashboardFollowUps.map((fu, idx) => (
              <div key={idx} className="px-5 py-3.5 hover:bg-bg-hover transition-colors duration-150">
                <div className="flex items-start justify-between mb-1.5">
                  <span className="text-sm font-body font-medium text-text-primary">{fu.client}</span>
                  <span className="text-[10px] font-mono font-medium text-status-danger bg-status-danger/10 px-2 py-0.5 rounded-full">
                    {fu.daysOverdue}d overdue
                  </span>
                </div>
                <p className="text-xs font-body text-text-secondary mb-2.5">{fu.about}</p>
                <button className="flex items-center gap-1.5 text-[11px] font-body font-medium text-accent-primary hover:text-accent-secondary transition-colors">
                  <Phone size={12} />
                  Call Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section C — Bottom Row Charts */}
      <div className="grid grid-cols-2 gap-4">
        <RevenueChart />
        <RFQDonutChart />
      </div>
    </div>
  );
};

export default Dashboard;
