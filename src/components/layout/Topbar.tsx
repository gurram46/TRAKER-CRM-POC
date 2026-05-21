import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Command, Mail, MessageCircle, IndianRupee, Truck, RefreshCw, Loader2 } from 'lucide-react';
import Toast from '../ui/Toast';
import ThemeToggle from '../ui/ThemeToggle';

interface NotificationItem {
  id: string;
  type: 'email' | 'whatsapp' | 'payment' | 'logistics';
  title: string;
  subtitle: string;
  time: string;
  isRead: boolean;
}

const notifications: NotificationItem[] = [
  { id: 'N1', type: 'email', title: 'New reply from Rajesh Gupta', subtitle: 'RE: Quotation for HR Coil — 50MT', time: '25m ago', isRead: false },
  { id: 'N2', type: 'email', title: 'Order confirmed — Priya Sharma', subtitle: 'RE: TMT Bars — Order Confirmation', time: '1h ago', isRead: false },
  { id: 'N3', type: 'payment', title: 'Payment received — ₹3,67,500', subtitle: 'Nagar Constructions · UTR: HDFC...4532', time: '5h ago', isRead: false },
  { id: 'N4', type: 'logistics', title: 'Shipment delayed — SHP-2024-0032', subtitle: 'CR Sheet 30MT · Near Kurnool bypass', time: '6h ago', isRead: true },
  { id: 'N5', type: 'whatsapp', title: 'WhatsApp delivered', subtitle: 'Payment reminder sent to KVR Builders', time: '1d ago', isRead: true },
];

const iconMap: Record<string, React.ElementType> = {
  email: Mail,
  whatsapp: MessageCircle,
  payment: IndianRupee,
  logistics: Truck,
};

const iconColorMap: Record<string, string> = {
  email: 'text-accent-primary bg-accent-primary/15',
  whatsapp: 'text-[#25D366] bg-[#25D366]/15',
  payment: 'text-status-warning bg-status-warning/15',
  logistics: 'text-status-info bg-status-info/15',
};

const Topbar: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="h-[60px] bg-bg-secondary border-b border-border flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-40">
      {/* Left — Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md overflow-hidden bg-bg-primary flex items-center justify-center border border-border">
          <img src="/logo.png" alt="TRACKING Logo" className="w-full h-full object-cover" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-display font-bold text-[15px] text-text-primary tracking-wide">TRACKING</span>
          <span className="font-display font-semibold text-[13px] text-accent-primary">CRM</span>
        </div>
      </div>

      {/* Center — Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search clients, RFQs, vendors..."
            className="w-full bg-bg-primary border border-border rounded-md py-2 pl-9 pr-20 text-sm font-body text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:shadow-glow transition-all duration-150"
            readOnly
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-text-muted">
            <kbd className="text-[10px] font-mono bg-bg-tertiary border border-border rounded px-1.5 py-0.5 flex items-center gap-0.5">
              <Command size={10} />K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right — Bell + Avatar */}
      <div className="flex items-center gap-4">
        {/* Sync Now Button */}
        <button
          onClick={() => {
            setIsSyncing(true);
            setTimeout(() => {
              setIsSyncing(false);
              setShowToast(true);
            }, 2000);
          }}
          disabled={isSyncing}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-bg-tertiary border border-border text-text-secondary hover:text-text-primary hover:border-border-accent transition-all text-xs font-body font-medium"
        >
          {isSyncing ? (
            <Loader2 size={14} className="animate-spin text-accent-primary" />
          ) : (
            <RefreshCw size={14} />
          )}
          {isSyncing ? 'Syncing...' : 'Sync Now'}
        </button>
        <ThemeToggle />
        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-9 h-9 flex items-center justify-center rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors duration-150"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-status-danger rounded-full text-[9px] font-mono font-medium text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-[380px] bg-bg-tertiary border border-border rounded-lg shadow-dropdown z-50 overflow-hidden animate-modal-enter">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="text-sm font-display font-semibold text-text-primary">Notifications</span>
                <button className="text-[11px] font-body text-accent-primary hover:underline">Mark all read</button>
              </div>
              <div className="max-h-[360px] overflow-y-auto">
                {notifications.map((n) => {
                  const Icon = iconMap[n.type];
                  return (
                    <button
                      key={n.id}
                      onClick={() => {
                        setShowNotifications(false);
                        if (n.type === 'email') navigate('/communications');
                        if (n.type === 'payment') navigate('/payments');
                        if (n.type === 'logistics') navigate('/logistics');
                        if (n.type === 'whatsapp') navigate('/followups');
                      }}
                      className={`w-full flex items-start gap-3 px-4 py-3 border-b border-border text-left hover:bg-bg-hover transition-colors duration-100
                        ${!n.isRead ? 'bg-bg-secondary' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${iconColorMap[n.type]}`}>
                        <Icon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-accent-primary flex-shrink-0" />}
                          <span className={`text-xs font-body truncate ${!n.isRead ? 'font-semibold text-text-primary' : 'font-medium text-text-secondary'}`}>
                            {n.title}
                          </span>
                        </div>
                        <p className="text-[11px] font-body text-text-muted truncate">{n.subtitle}</p>
                      </div>
                      <span className="text-[10px] font-mono text-text-muted flex-shrink-0 mt-0.5">{n.time}</span>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => {
                  setShowNotifications(false);
                  navigate('/communications');
                }}
                className="w-full px-4 py-2.5 text-xs font-body font-medium text-accent-primary hover:bg-bg-hover transition-colors text-center border-t border-border"
              >
                View All Communications →
              </button>
            </div>
          )}
        </div>

        {/* User Profile / Logout Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-white font-display font-bold text-[11px] hover:opacity-90 transition-opacity focus:outline-none"
          >
            RS
          </button>
          
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-bg-tertiary border border-border rounded-lg shadow-dropdown z-50 overflow-hidden animate-modal-enter">
              <div className="px-4 py-2.5 border-b border-border">
                <p className="text-xs font-semibold text-text-primary">Rajesh Sharma</p>
                <p className="text-[10px] text-text-muted">admin@yourcompany.com</p>
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  localStorage.removeItem('crm_authenticated');
                  navigate('/login');
                }}
                className="w-full text-left px-4 py-2 text-xs text-status-danger hover:bg-bg-hover transition-colors font-medium"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      <Toast 
        message="Zoho CRM synced — 3 new contacts imported" 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
    </header>
  );
};

export default Topbar;
