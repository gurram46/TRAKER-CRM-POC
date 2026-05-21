import React, { useState } from 'react';
import { Plus, Search, Edit } from 'lucide-react';
import { vendorData } from '../data/dummyData';

const typeColors: Record<string, string> = {
  Mill: 'text-green-400 bg-green-400/10 border-green-400/20',
  Stockist: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  Distributor: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
};

const vendorTypes = ['Mill', 'Stockist', 'Distributor'];

const enriched = vendorData.map((v, i) => ({
  ...v,
  email: `${v.name.toLowerCase().replace(/\s+/g, '').slice(0, 8)}@vendor.com`,
  type: vendorTypes[i % 3],
}));

const Vendors: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = enriched.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.city.toLowerCase().includes(search.toLowerCase()) ||
    v.materials.some(m => m.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">Vendors</h1>
          <p className="text-sm text-text-secondary mt-0.5">Directory of registered suppliers and mills</p>
        </div>
        <button className="flex items-center gap-2 bg-accent-primary hover:bg-accent-secondary text-white text-sm font-body font-medium px-4 py-2.5 rounded-md transition-colors duration-150">
          <Plus size={16} />
          Add Vendor
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search vendors, city or materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-primary border border-border rounded-md py-2.5 pl-9 pr-4 text-sm font-body text-text-primary placeholder:text-text-muted transition-all duration-150"
          />
        </div>
      </div>

      <div className="bg-bg-tertiary border border-border rounded-md shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-bg-secondary">
                {['Code', 'Vendor Name', 'Contact', 'Phone', 'City', 'Type', 'Materials', 'Actions'].map((h) => (
                  <th key={h} className="text-[11px] font-body font-semibold text-text-muted uppercase tracking-[0.06em] px-4 py-3 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id} className="border-b border-border hover:bg-bg-hover/20 transition-colors duration-150 bg-transparent">
                  <td className="px-4 py-3 text-xs font-mono text-accent-primary">{v.id}</td>
                  <td className="px-4 py-3 text-sm font-body font-medium text-text-primary">{v.name}</td>
                  <td className="px-4 py-3">
                    <div className="text-xs font-body text-text-primary">{v.name.split(' ')[0]} {v.name.split(' ')[1] || ''}</div>
                    <div className="text-[11px] text-text-muted">{v.email}</div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-text-secondary">+91 {v.contact.slice(0,5)} {v.contact.slice(5)}</td>
                  <td className="px-4 py-3 text-sm font-body text-text-secondary">{v.city}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-body font-semibold px-2.5 py-1 rounded-full border ${typeColors[v.type]}`}>{v.type}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {v.materials.slice(0, 2).map(m => (
                        <span key={m} className="text-[10px] font-body text-text-secondary bg-bg-secondary px-2 py-0.5 rounded-full border border-border">{m}</span>
                      ))}
                      {v.materials.length > 2 && (
                        <span className="text-[10px] text-accent-primary">+{v.materials.length - 2}</span>
                      )}
                    </div>
                  </td>
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
    </div>
  );
};

export default Vendors;
