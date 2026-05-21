import React, { useState, useCallback } from 'react';
import { Plus, MapPin, Clock, MessageCircle, Search, Eye, X, Truck, User, Phone } from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';
import WhatsAppModal from '../components/ui/WhatsAppModal';
import Toast from '../components/ui/Toast';
import { shipmentData, transporterData } from '../data/dummyData';
import type { Shipment } from '../data/dummyData';

const statusBorderColor: Record<string, string> = {
  'In Transit': 'border-l-accent-primary',
  Delivered: 'border-l-status-success',
  Delayed: 'border-l-status-danger',
  'Pending Dispatch': 'border-l-status-warning',
};

const LogisticsTracking: React.FC = () => {
  const activeCount = shipmentData.filter(s => s.status !== 'Delivered').length;
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [waRecipient, setWaRecipient] = useState('');
  const [waMessage, setWaMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Loading' | 'In Transit' | 'Delivered' | 'Delayed'>('All');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const stats = {
    active: shipmentData.filter(s => s.status !== 'Delivered').length,
    inTransit: shipmentData.filter(s => s.status === 'In Transit').length,
    delivered: shipmentData.filter(s => s.status === 'Delivered').length,
    delayed: shipmentData.filter(s => s.status === 'Delayed').length,
  };

  const filtered = shipmentData.filter(s => {
    const matchTab = activeTab === 'All' || s.status === activeTab;
    const matchSearch = s.client.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.transporter.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const statusStyle: Record<string, string> = {
    'In Transit': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    Delivered: 'text-green-400 bg-green-400/10 border-green-400/20',
    Delayed: 'text-red-400 bg-red-400/10 border-red-400/20',
    'Pending Dispatch': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  };

  const handleNotifyClient = useCallback((shipment: Shipment) => {
    setWaRecipient(shipment.client);

    let statusLine = '';
    if (shipment.status === 'In Transit') {
      statusLine = `Your shipment is currently in transit and was last seen at ${shipment.lastLocation} (${shipment.lastUpdate}).`;
    } else if (shipment.status === 'Delayed') {
      statusLine = `We regret to inform you that your shipment is experiencing a delay. Last known location: ${shipment.lastLocation}.`;
    } else if (shipment.status === 'Pending Dispatch') {
      statusLine = `Your order has been confirmed and is being prepared for dispatch from our yard.`;
    } else if (shipment.status === 'Delivered') {
      statusLine = `Your shipment has been successfully delivered.`;
    }

    setWaMessage(
      `Hi ${shipment.client},\n\nThis is a delivery update from Omnia Steels regarding your order.\n\n📦 Shipment: ${shipment.id}\n📋 Material: ${shipment.quantity} MT ${shipment.material}\n🚛 Transporter: ${shipment.transporter}\n📍 Status: ${shipment.status}\n\n${statusLine}\n\nEstimated Arrival: ${shipment.eta}\n\nFor any queries, please don't hesitate to reach out.\n\nRegards,\nRam Sharma\nOmnia Steels Pvt Ltd\n+91 98765 43210`
    );
    setShowWhatsApp(true);
  }, []);

  return (
    <div className="space-y-5 pb-10">
      {/* Detail Modal */}
      {selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-bg-secondary border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <p className="text-xs font-mono text-text-muted">{selectedShipment.id}</p>
                <h2 className="text-lg font-display font-bold text-text-primary">{selectedShipment.client}</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-body font-semibold px-2.5 py-1 rounded-full border ${statusStyle[selectedShipment.status]}`}>{selectedShipment.status}</span>
                <button onClick={() => setSelectedShipment(null)} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Info Row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-bg-primary border border-border rounded-xl p-4">
                  <p className="text-xs text-text-muted mb-1">Material / Qty</p>
                  <p className="text-sm font-body font-semibold text-text-primary">{selectedShipment.quantity} MT</p>
                  <p className="text-xs text-text-secondary">{selectedShipment.material}</p>
                </div>
                <div className="bg-bg-primary border border-border rounded-xl p-4">
                  <p className="text-xs text-text-muted mb-1 flex items-center gap-1"><Truck size={11} /> Transporter</p>
                  <p className="text-sm font-body font-semibold text-text-primary">{selectedShipment.transporter}</p>
                  <p className="text-xs text-text-secondary">{transporterData[0]?.id}</p>
                </div>
                <div className="bg-bg-primary border border-border rounded-xl p-4">
                  <p className="text-xs text-text-muted mb-1 flex items-center gap-1"><User size={11} /> Driver</p>
                  <p className="text-sm font-body font-semibold text-text-primary">Ravi Kumar</p>
                  <p className="text-xs text-text-secondary flex items-center gap-1"><Phone size={10} /> +91 98765 43210</p>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="bg-bg-primary border border-border rounded-xl p-5">
                <p className="text-xs font-body font-bold text-text-muted uppercase tracking-wider mb-5">Shipment Progress</p>
                <div className="flex items-start justify-between relative">
                  <div className="absolute top-[9px] left-[9px] right-[9px] h-[2px] bg-border z-0" />
                  <div className="absolute top-[9px] left-[9px] h-[2px] bg-accent-primary z-0 transition-all duration-500"
                    style={{ width: `${(selectedShipment.checkpoints.filter(c => c.completed).length - 1) / (selectedShipment.checkpoints.length - 1) * 100}%`, maxWidth: 'calc(100% - 18px)' }} />
                  {selectedShipment.checkpoints.map((cp, idx) => (
                    <div key={idx} className="flex flex-col items-center z-10 relative">
                      <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center
                        ${cp.completed ? 'bg-accent-primary border-accent-primary' : cp.current ? 'bg-bg-tertiary border-accent-primary' : 'bg-bg-tertiary border-border'}`}>
                        {cp.completed && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                      </div>
                      <span className={`text-[9px] font-body mt-1.5 text-center max-w-[56px] leading-tight ${cp.completed || cp.current ? 'text-text-secondary' : 'text-text-muted'}`}>{cp.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location + ETA */}
              <div className="flex items-center justify-between text-sm font-body">
                <div className="flex items-center gap-2 text-text-secondary">
                  <MapPin size={14} className="text-text-muted" />
                  <span>{selectedShipment.lastLocation}</span>
                  <span className="text-text-muted">· {selectedShipment.lastUpdate}</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Clock size={14} className="text-text-muted" />
                  <span>ETA: {selectedShipment.eta}</span>
                </div>
              </div>

              {/* WhatsApp Notify */}
              <button onClick={() => { handleNotifyClient(selectedShipment); setSelectedShipment(null); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-body font-medium text-[#25D366] bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl hover:bg-[#25D366]/20 transition-colors">
                <MessageCircle size={15} />
                Notify Client via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">Logistics Tracker</h1>
          <p className="text-sm text-text-secondary mt-0.5">Track shipment status from dispatch to delivery</p>
        </div>
        <button className="flex items-center gap-2 bg-accent-primary hover:bg-accent-secondary text-white text-sm font-body font-medium px-4 py-2.5 rounded-md transition-colors">
          <Plus size={16} />
          Add Shipment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Shipments', value: stats.active, sub: 'on the move' },
          { label: 'In Transit', value: stats.inTransit, sub: 'en route' },
          { label: 'Delivered', value: stats.delivered, sub: 'completed trips' },
          { label: 'Delayed', value: stats.delayed, sub: 'need attention' },
        ].map(s => (
          <div key={s.label} className="bg-bg-tertiary border border-border rounded-xl p-5">
            <p className="text-sm font-body text-text-secondary">{s.label}</p>
            <p className="text-3xl font-display font-bold text-text-primary mt-1">{s.value}</p>
            <p className="text-xs text-text-muted mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search shipment, client, driver..."
            className="bg-bg-primary border border-border rounded-md py-2 pl-9 pr-4 text-sm font-body text-text-primary w-72" />
        </div>
        <div className="flex items-center gap-1">
          {(['All', 'Loading', 'In Transit', 'Delivered', 'Delayed'] as const).map(tab => (
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
              {['Shipment', 'Client / Project', 'Material / Qty', 'Transporter', 'Driver', 'Route', 'Status', 'Dispatched', 'Expected', ''].map(h => (
                <th key={h} className="text-left text-[11px] font-body font-semibold text-text-muted uppercase tracking-[0.06em] px-4 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-border hover:bg-bg-hover transition-colors">
                <td className="px-4 py-2 text-xs font-mono text-accent-primary">{s.id}</td>
                <td className="px-4 py-2">
                  <p className="text-sm font-body font-medium text-text-primary">{s.client}</p>
                  <p className="text-xs text-text-muted">{s.material}</p>
                </td>
                <td className="px-4 py-2">
                  <p className="text-sm font-body text-text-secondary">{s.material}</p>
                  <p className="text-xs text-text-muted">{s.quantity} MT</p>
                </td>
                <td className="px-4 py-2 text-sm font-body text-text-secondary">{s.transporter}</td>
                <td className="px-4 py-2">
                  <p className="text-xs font-body text-text-primary">Ravi Kumar</p>
                  <p className="text-[11px] text-text-muted">+91 98765 43210</p>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-1 text-xs text-text-secondary">
                    <span>Hyd</span>
                    <span className="text-text-muted">→</span>
                    <span>{s.lastLocation?.split(' ')[0] || 'Vizag'}</span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <span className={`text-xs font-body font-semibold px-2.5 py-1 rounded-full border ${statusStyle[s.status]}`}>{s.status}</span>
                </td>
                <td className="px-4 py-2 text-xs font-body text-text-secondary">{s.lastUpdate}</td>
                <td className="px-4 py-2 text-xs font-body text-text-secondary">{s.eta}</td>
                <td className="px-4 py-2">
                  <button onClick={() => setSelectedShipment(s)}
                    className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-accent-primary hover:bg-bg-hover transition-colors">
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Old card grid removed — detail now in modal */}

      <WhatsAppModal isOpen={showWhatsApp} onClose={() => setShowWhatsApp(false)}
        recipientName={waRecipient} defaultMessage={waMessage} onSend={() => setShowToast(true)} />
      <Toast message="WhatsApp message queued successfully" isVisible={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
};

export default LogisticsTracking;
