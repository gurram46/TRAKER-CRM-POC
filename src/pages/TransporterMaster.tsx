import React, { useState } from 'react';
import { Plus, Search, Edit, Star, Truck } from 'lucide-react';
import { transporterData } from '../data/dummyData';

const TransporterMaster: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = transporterData.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.coverage.toLowerCase().includes(search.toLowerCase())
  );

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={11}
            className={i < full ? 'text-yellow-400 fill-yellow-400' : 'text-text-muted'} />
        ))}
        <span className="text-xs font-mono text-text-secondary ml-1">{rating}</span>
      </div>
    );
  };

  const fleetSize = (id: string) => ({ 'T-001': 12, 'T-002': 8, 'T-003': 15, 'T-004': 6, 'T-005': 20, 'T-006': 45 }[id] || 10);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">Transporters</h1>
          <p className="text-sm text-text-secondary mt-0.5">Manage logistics and transport partners</p>
        </div>
        <button className="flex items-center gap-2 bg-accent-primary hover:bg-accent-secondary text-white text-sm font-body font-medium px-4 py-2.5 rounded-md transition-colors">
          <Plus size={16} />
          Add Transporter
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search transporter, region..."
            className="bg-bg-primary border border-border rounded-md py-2 pl-9 pr-4 text-sm font-body text-text-primary w-72"
          />
        </div>
        <span className="text-xs font-mono text-text-muted">{filtered.length} transporters</span>
      </div>

      <div className="bg-bg-tertiary border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-bg-secondary">
              {['Code', 'Transporter Name', 'Contact', 'Region', 'Fleet Size', 'Vehicle Types', 'Rating', ''].map(h => (
                <th key={h} className="text-left text-[11px] font-body font-semibold text-text-muted uppercase tracking-[0.06em] px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, idx) => (
              <tr key={t.id} className="border-b border-border hover:bg-bg-hover/20 transition-colors bg-transparent">
                <td className="px-4 py-3 text-xs font-mono text-accent-primary">{t.id}</td>
                <td className="px-4 py-3 text-sm font-body font-medium text-text-primary">{t.name}</td>
                <td className="px-4 py-3">
                  <div className="text-xs font-body text-text-primary">{t.name.split(' ')[0]} Kumar</div>
                  <div className="text-[11px] text-text-muted">+91 {t.contact.slice(0,5)} {t.contact.slice(5)}</div>
                </td>
                <td className="px-4 py-3 text-sm font-body text-text-secondary">{t.coverage.split(',')[0].split('→')[0].trim()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-sm font-body text-text-secondary">
                    <Truck size={13} className="text-text-muted" />
                    <span>{fleetSize(t.id)}</span>
                    <span className="text-text-muted text-xs">vehicles</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {t.vehicleTypes.slice(0, 2).map(v => (
                      <span key={v} className="text-[10px] font-body text-text-secondary bg-bg-secondary px-2 py-0.5 rounded-full border border-border">{v}</span>
                    ))}
                    {t.vehicleTypes.length > 2 && (
                      <span className="text-[10px] text-accent-primary">+{t.vehicleTypes.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">{renderStars(parseFloat((t.reliability / 20).toFixed(1)))}</td>
                <td className="px-4 py-3">
                  <button className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors">
                    <Edit size={14} />
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

export default TransporterMaster;
