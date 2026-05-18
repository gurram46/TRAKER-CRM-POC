import React, { useState, useCallback } from 'react';
import { Plus, MapPin, Clock, MessageCircle } from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';
import WhatsAppModal from '../components/ui/WhatsAppModal';
import Toast from '../components/ui/Toast';
import { shipmentData } from '../data/dummyData';
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
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-display font-bold text-text-primary">Logistics Tracking</h1>
          <span className="text-xs font-mono font-medium text-accent-primary bg-accent-primary/10 px-2.5 py-1 rounded-full border border-accent-primary/20">
            {activeCount} Active
          </span>
        </div>
        <button className="flex items-center gap-2 bg-accent-primary hover:bg-accent-secondary text-white text-sm font-body font-medium px-4 py-2.5 rounded-md transition-colors duration-150">
          <Plus size={16} />
          New Shipment
        </button>
      </div>

      {/* Shipment Cards Grid */}
      <div className="grid grid-cols-2 gap-4">
        {shipmentData.map((s) => (
          <div
            key={s.id}
            className={`bg-bg-tertiary border border-border ${statusBorderColor[s.status]} border-l-[3px] rounded-md p-5 shadow-card hover:shadow-glow transition-shadow duration-200`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-text-muted">{s.id}</span>
              <StatusBadge status={s.status} />
            </div>

            {/* Client & Material */}
            <h3 className="text-sm font-body font-semibold text-text-primary">{s.client}</h3>
            <p className="text-xs font-body text-text-secondary mt-0.5">{s.quantity} MT {s.material}</p>
            <p className="text-xs font-body text-text-muted mt-0.5">Transporter: {s.transporter}</p>

            {/* Progress Stepper */}
            <div className="mt-5 mb-4">
              <div className="flex items-center justify-between relative">
                {/* Line behind dots */}
                <div className="absolute top-[9px] left-[9px] right-[9px] h-[2px] bg-border z-0" />
                <div
                  className="absolute top-[9px] left-[9px] h-[2px] bg-accent-primary z-0 transition-all duration-500"
                  style={{
                    width: `${(s.checkpoints.filter(c => c.completed).length - 1) / (s.checkpoints.length - 1) * 100}%`,
                    maxWidth: 'calc(100% - 18px)',
                  }}
                />

                {s.checkpoints.map((cp, idx) => (
                  <div key={idx} className="flex flex-col items-center z-10 relative">
                    <div
                      className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center
                        ${cp.completed ? 'bg-accent-primary border-accent-primary' : cp.current ? 'bg-bg-tertiary border-accent-primary pulse-blue' : 'bg-bg-tertiary border-border'}
                      `}
                    >
                      {cp.completed && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-[9px] font-body mt-1.5 text-center max-w-[56px] leading-tight
                      ${cp.completed || cp.current ? 'text-text-secondary' : 'text-text-muted'}`}>
                      {cp.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-1.5 text-xs font-body text-text-secondary">
                <MapPin size={12} className="text-text-muted" />
                {s.lastLocation}
                <span className="text-text-muted">· {s.lastUpdate}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-body text-text-secondary">
                <Clock size={12} className="text-text-muted" />
                ETA: {s.eta}
              </div>
            </div>

            {/* Notify Client Button */}
            <div className="mt-3 pt-3 border-t border-border">
              <button
                onClick={() => handleNotifyClient(s)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-body font-medium text-[#25D366] bg-[#25D366]/10 border border-[#25D366]/20 rounded-md hover:bg-[#25D366]/20 transition-colors w-full justify-center"
              >
                <MessageCircle size={12} />
                Notify Client via WhatsApp
              </button>
            </div>
          </div>
        ))}
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

export default LogisticsTracking;
