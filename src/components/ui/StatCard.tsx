import React, { useEffect, useRef, useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color: 'blue' | 'amber' | 'red' | 'green';
}

const colorMap = {
  blue: { border: 'border-t-accent-primary', iconBg: 'bg-accent-primary/10', iconText: 'text-accent-primary' },
  amber: { border: 'border-t-status-warning', iconBg: 'bg-status-warning/10', iconText: 'text-status-warning' },
  red: { border: 'border-t-status-danger', iconBg: 'bg-status-danger/10', iconText: 'text-status-danger' },
  green: { border: 'border-t-status-success', iconBg: 'bg-status-success/10', iconText: 'text-status-success' },
};

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType = 'neutral', icon: Icon, color }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAnimated(true);
    // Count-up effect for numeric values
    const numericMatch = value.replace(/[₹,]/g, '').match(/^(\d+)/);
    if (numericMatch) {
      const target = parseInt(numericMatch[1]);
      const prefix = value.match(/^[₹]/) ? '₹' : '';
      const suffix = value.replace(/^[₹]?[\d,]+/, '');
      let current = 0;
      const steps = 30;
      const increment = target / steps;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          clearInterval(timer);
          setDisplayValue(value);
        } else {
          setDisplayValue(prefix + Math.floor(current).toLocaleString('en-IN') + suffix);
        }
      }, 20);
      return () => clearInterval(timer);
    }
  }, [value]);

  const { border, iconBg, iconText } = colorMap[color];
  const changeColor = changeType === 'positive' ? 'text-status-success' : changeType === 'negative' ? 'text-status-danger' : 'text-text-secondary';

  return (
    <div
      ref={ref}
      className={`bg-bg-tertiary border border-border ${border} border-t-[3px] rounded-md p-5 shadow-card
        hover:scale-[1.01] transition-transform duration-150 ease-out relative overflow-hidden
        ${animated ? 'animate-count-up' : 'opacity-0'}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-body font-medium text-text-secondary uppercase tracking-[0.08em] mb-2">
            {title}
          </p>
          <p className="text-[28px] font-display font-bold text-text-primary leading-tight">
            {displayValue}
          </p>
          <p className={`text-xs font-body mt-2 ${changeColor}`}>
            {change}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-md flex items-center justify-center ${iconBg}`}>
          <Icon size={20} className={iconText} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
