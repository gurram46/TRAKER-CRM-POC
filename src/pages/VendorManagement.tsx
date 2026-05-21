import React, { useState } from 'react';
import { Plus, Search, Phone, Mail, MapPin } from 'lucide-react';
import { contactsData } from '../data/dummyData';

type FilterTab = 'All' | 'Client' | 'Vendor' | 'Transporter';

const VendorManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [search, setSearch] = useState('');

  const counts = {
    All: contactsData.length,
    Client: contactsData.filter(c => c.type === 'Client').length,
    Vendor: contactsData.filter(c => c.type === 'Vendor').length,
    Transporter: contactsData.filter(c => c.type === 'Transporter').length,
  };

  const filtered = contactsData.filter(c => {
    const matchTab = activeTab === 'All' || c.type === activeTab;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase()) || c.city.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const typeColor: Record<string, string> = {
    Client: 'text-blue-400',
    Vendor: 'text-accent-primary',
    Transporter: 'text-purple-400',
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">Contacts</h1>
          <p className="text-sm text-text-secondary mt-0.5">Clients, vendors and transporters</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, company, city..." className="bg-bg-primary border border-border rounded-md py-2 pl-9 pr-4 text-sm font-body text-text-primary w-64" />
          </div>
          <button className="flex items-center gap-2 bg-accent-primary hover:bg-accent-secondary text-white text-sm font-body font-medium px-4 py-2.5 rounded-md transition-colors">
            <Plus size={16} />
            Add Contact
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {(['All', 'Client', 'Vendor', 'Transporter'] as FilterTab[]).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-body font-medium transition-all
              ${activeTab === tab ? 'bg-accent-primary text-white' : 'bg-bg-secondary border border-border text-text-secondary hover:text-text-primary'}`}>
            {tab}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab ? 'bg-white/20' : 'bg-bg-primary'}`}>{counts[tab]}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {filtered.map(contact => (
          <div key={contact.id} className="bg-bg-tertiary border border-border rounded-xl p-5 hover:border-accent-primary/40 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-accent-primary/20 flex items-center justify-center text-sm font-display font-bold text-accent-primary">
                {contact.avatar}
              </div>
              <span className={`text-xs font-body font-semibold ${typeColor[contact.type]}`}>{contact.type}</span>
            </div>
            <h3 className="text-sm font-display font-bold text-text-primary">{contact.name}</h3>
            <p className="text-xs text-text-secondary mt-0.5 mb-3">{contact.company}</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-text-secondary"><Phone size={11} /><span>{contact.phone}</span></div>
              <div className="flex items-center gap-2 text-xs text-text-secondary"><Mail size={11} /><span>{contact.email}</span></div>
              <div className="flex items-center gap-2 text-xs text-text-secondary"><MapPin size={11} /><span>{contact.city}</span></div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-xs font-mono font-bold text-text-primary">{contact.deals}</p>
                <p className="text-[10px] text-text-muted uppercase tracking-wide">Deals</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-mono font-bold text-text-primary">{contact.value}</p>
                <p className="text-[10px] text-text-muted uppercase tracking-wide">Value</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-mono font-bold text-text-primary">{contact.lastActive}</p>
                <p className="text-[10px] text-text-muted uppercase tracking-wide">Last Active</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorManagement;
