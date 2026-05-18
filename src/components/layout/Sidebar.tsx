import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Users,
  IndianRupee,
  Truck,
  CalendarCheck,
  Mail,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'OVERVIEW',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'OPERATIONS',
    items: [
      { label: 'RFQ Management', path: '/rfq', icon: FileText },
      { label: 'Quotation Builder', path: '/quotations', icon: ClipboardList },
    ],
  },
  {
    title: 'COMMUNICATIONS',
    items: [
      { label: 'Email & Messages', path: '/communications', icon: Mail },
    ],
  },
  {
    title: 'RELATIONSHIPS',
    items: [
      { label: 'Vendor Management', path: '/vendors', icon: Users },
    ],
  },
  {
    title: 'FINANCE',
    items: [
      { label: 'Payment Tracking', path: '/payments', icon: IndianRupee },
    ],
  },
  {
    title: 'LOGISTICS',
    items: [
      { label: 'Logistics Tracking', path: '/logistics', icon: Truck },
      { label: 'Follow-up Tracker', path: '/followups', icon: CalendarCheck },
    ],
  },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-[240px] h-[calc(100vh-60px)] bg-bg-secondary border-r border-border fixed left-0 top-[60px] overflow-y-auto py-5 z-30">
      <nav className="flex flex-col gap-6 px-3">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="text-[10px] font-body font-semibold text-text-muted uppercase tracking-[0.12em] px-3 mb-2">
              {section.title}
            </p>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-body font-medium transition-all duration-150 group relative
                    ${
                      isActive
                        ? 'text-accent-primary bg-accent-glow border-l-[3px] border-accent-primary -ml-[3px]'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                    }`
                  }
                >
                  <item.icon size={18} className="flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
