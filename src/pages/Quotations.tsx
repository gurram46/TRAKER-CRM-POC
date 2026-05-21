import React, { useState } from 'react';
import { Plus, Search, Eye } from 'lucide-react';
import { quotationData, Quotation } from '../data/dummyData';

type FilterTab = 'All' | 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired';

const statusStyle: Record<string, string> = {
  Draft: 'text-text-secondary bg-bg-secondary border-border',
  Sent: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  Accepted: 'text-green-400 bg-green-400/10 border-green-400/20',
  Rejected: 'text-red-400 bg-red-400/10 border-red-400/20',
  Expired: 'text-text-muted bg-bg-secondary border-border',
};

const Quotations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [search, setSearch] = useState('');

  const counts = {
    All: quotationData.length,
    Draft: quotationData.filter(q => q.status === 'Draft').length,
    Sent: quotationData.filter(q => q.status === 'Sent').length,
    Accepted: quotationData.filter(q => q.status === 'Accepted').length,
    Rejected: quotationData.filter(q => q.status === 'Rejected').length,
    Expired: quotationData.filter(q => q.status === 'Expired').length,
  };

  const totalValue = '₹86.3L';
  const filtered = quotationData.filter(q => {
    const matchTab = activeTab === 'All' || q.status === activeTab;
    const matchSearch = q.client.toLowerCase().includes(search.toLowerCase()) ||
      q.id.toLowerCase().includes(search.toLowerCase()) ||
      q.project.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">Quotations</h1>
          <p className="text-sm text-text-secondary mt-0.5">All generated quotations – OSQ numbers</p>
        </div>
        <button className="flex items-center gap-2 bg-accent-primary hover:bg-accent-secondary text-white text-sm font-body font-medium px-4 py-2.5 rounded-md transition-colors">
          <Plus size={16} />
          New Quotation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Quotations', value: quotationData.length, sub: 'all time' },
          { label: 'Sent', value: counts.Sent, sub: 'awaiting response' },
          { label: 'Accepted', value: counts.Accepted, sub: 'deals converted' },
          { label: 'Total Value', value: totalValue, sub: 'quoted this year' },
        ].map(s => (
          <div key={s.label} className="bg-bg-tertiary border border-border rounded-xl p-5">
            <p className="text-sm font-body text-text-secondary">{s.label}</p>
            <p className="text-3xl font-display font-bold text-text-primary mt-1">{s.value}</p>
            <p className="text-xs text-text-muted mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Search + Tabs */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search OSQ, client, project..."
            className="bg-bg-primary border border-border rounded-md py-2 pl-9 pr-4 text-sm font-body text-text-primary w-72"
          />
        </div>
        <div className="flex items-center gap-1">
          {(['All', 'Draft', 'Sent', 'Accepted', 'Rejected', 'Expired'] as FilterTab[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md text-sm font-body font-medium transition-all
                ${activeTab === tab ? 'bg-accent-primary text-white' : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-bg-tertiary border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-bg-secondary">
              {['OSQ #', 'Client / Project', 'Items', 'Value', 'Status', 'Valid Until', 'Assigned', ''].map(h => (
                <th key={h} className="text-left text-[11px] font-body font-semibold text-text-muted uppercase tracking-[0.06em] px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((q) => (
              <tr key={q.id} className="border-b border-border hover:bg-bg-hover/20 transition-colors bg-transparent">
                <td className="px-4 py-3 text-xs font-mono text-accent-primary">{q.id}</td>
                <td className="px-4 py-3">
                  <div className="text-sm font-body font-medium text-text-primary">{q.client}</div>
                  <div className="text-xs text-text-muted">{q.project}</div>
                </td>
                <td className="px-4 py-3 text-sm font-body text-text-secondary">{q.items}</td>
                <td className="px-4 py-3 text-sm font-mono font-bold text-text-primary">{q.value}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-body font-semibold px-2.5 py-1 rounded-full border ${statusStyle[q.status]}`}>{q.status}</span>
                </td>
                <td className="px-4 py-3 text-sm font-body text-text-secondary">{q.validUntil}</td>
                <td className="px-4 py-3 text-sm font-body text-text-secondary">{q.assigned}</td>
                <td className="px-4 py-3">
                  <button className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors">
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Quotations;
