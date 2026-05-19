import React, { useState } from 'react';
import { Plus, Eye, Edit, MessageCircle, Star } from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';
import { vendorData, transporterData, materials } from '../data/dummyData';

type Tab = 'Vendors' | 'Transporters';

const VendorManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Vendors');

  const getRelativeDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 30) return `${diffDays}d ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={12}
            className={i < full ? 'text-status-warning fill-status-warning' : i === full && half ? 'text-status-warning fill-status-warning/50' : 'text-text-muted'}
          />
        ))}
        <span className="text-[10px] font-mono text-text-secondary ml-1">{rating}</span>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-text-primary">Vendor Management</h1>
        <button className="flex items-center gap-2 bg-accent-primary hover:bg-accent-secondary text-white text-sm font-body font-medium px-4 py-2.5 rounded-md transition-colors duration-150">
          <Plus size={16} />
          Add {activeTab === 'Vendors' ? 'Vendor' : 'Transporter'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {(['Vendors', 'Transporters'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-body font-medium border-b-2 transition-all duration-150 -mb-px
              ${activeTab === tab ? 'text-accent-primary border-accent-primary' : 'text-text-secondary border-transparent hover:text-text-primary'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Vendors' && (
        <>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-accent-primary bg-accent-primary/10 px-2.5 py-1 rounded-full border border-accent-primary/20">{vendorData.length} Vendors</span>
            <select className="bg-bg-primary border border-border rounded-md py-2 px-3 text-xs font-body text-text-secondary">
              <option value="">All Cities</option>
              {[...new Set(vendorData.map(v => v.city))].map(c => <option key={c}>{c}</option>)}
            </select>
            <select className="bg-bg-primary border border-border rounded-md py-2 px-3 text-xs font-body text-text-secondary">
              <option value="">All Materials</option>
              {materials.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="bg-bg-tertiary border border-border rounded-md shadow-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-bg-secondary">
                  {['Vendor Name', 'City', 'Materials', 'Contact', 'Last Price', 'Rating', 'Last Order', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-[11px] font-body font-semibold text-text-muted uppercase tracking-[0.06em] px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vendorData.map((v, idx) => (
                  <tr key={v.id} className={`border-b border-border hover:bg-bg-hover transition-colors duration-150 ${idx % 2 === 0 ? 'bg-bg-tertiary' : ''}`}>
                    <td className="px-4 py-3 text-sm font-body font-medium text-text-primary">
                      <div className="flex items-center gap-2">
                        {v.name}
                        {[1, 3, 4].includes(idx) && (
                          <span className="flex items-center gap-1.5 text-[10px] font-body font-medium text-[#0066FF] bg-[#0066FF]/10 px-2 py-0.5 rounded border border-[#0066FF]/20">
                            <span className="font-bold text-[#0066FF] tracking-wide">ZOHO</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-body text-text-secondary">{v.city}, {v.state}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {v.materials.slice(0, 2).map(m => (
                          <span key={m} className="text-[10px] font-body text-text-secondary bg-bg-secondary px-2 py-0.5 rounded-full border border-border">{m}</span>
                        ))}
                        {v.materials.length > 2 && (
                          <span className="text-[10px] font-body text-accent-primary bg-accent-primary/10 px-2 py-0.5 rounded-full">+{v.materials.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-text-secondary">{v.contact}</td>
                    <td className="px-4 py-3 text-sm font-mono text-gold">₹{v.lastPrice.toLocaleString('en-IN')}/MT</td>
                    <td className="px-4 py-3">{renderStars(v.rating)}</td>
                    <td className="px-4 py-3 text-xs font-body text-text-secondary">{getRelativeDate(v.lastOrder)}</td>
                    <td className="px-4 py-3"><StatusBadge status={v.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {[Eye, Edit, MessageCircle].map((Icon, i) => (
                          <button key={i} className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors" title={['View', 'Edit', 'WhatsApp'][i]}>
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
        </>
      )}

      {activeTab === 'Transporters' && (
        <div className="bg-bg-tertiary border border-border rounded-md shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-bg-secondary">
                {['Transporter', 'Coverage', 'Rate', 'Vehicle Types', 'Contact', 'Reliability', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left text-[11px] font-body font-semibold text-text-muted uppercase tracking-[0.06em] px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transporterData.map((t, idx) => (
                <tr key={t.id} className={`border-b border-border hover:bg-bg-hover transition-colors duration-150 ${idx % 2 === 0 ? 'bg-bg-tertiary' : ''}`}>
                  <td className="px-4 py-3 text-sm font-body font-medium text-text-primary">{t.name}</td>
                  <td className="px-4 py-3 text-xs font-body text-text-secondary">{t.coverage}</td>
                  <td className="px-4 py-3 text-sm font-mono text-text-primary">₹{t.rate}/MT/KM</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {t.vehicleTypes.map(vt => (
                        <span key={vt} className="text-[10px] font-body text-text-secondary bg-bg-secondary px-2 py-0.5 rounded-full border border-border">{vt}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-text-secondary">{t.contact}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-bg-primary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${t.reliability}%`,
                            backgroundColor: t.reliability >= 90 ? '#10B981' : t.reliability >= 80 ? '#F59E0B' : '#EF4444',
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-text-secondary">{t.reliability}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {[Eye, Edit, MessageCircle].map((Icon, i) => (
                        <button key={i} className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors" title={['View', 'Edit', 'WhatsApp'][i]}>
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
      )}
    </div>
  );
};

export default VendorManagement;
