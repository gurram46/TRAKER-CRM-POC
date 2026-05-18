import React from 'react';

type StatusType =
  | 'New' | 'Sent' | 'Responded' | 'Converted'
  | 'Overdue' | 'Paid' | 'Partial' | 'Unpaid'
  | 'Pending' | 'Active' | 'Inactive'
  | 'In Transit' | 'Delivered' | 'Delayed' | 'Pending Dispatch'
  | 'Today' | 'Upcoming' | 'Completed';

const statusStyles: Record<string, string> = {
  New: 'bg-status-info/15 text-status-info border-status-info/25',
  Sent: 'bg-accent-primary/15 text-accent-primary border-accent-primary/25',
  Responded: 'bg-status-warning/15 text-status-warning border-status-warning/25',
  Converted: 'bg-status-success/15 text-status-success border-status-success/25',
  Overdue: 'bg-status-danger/15 text-status-danger border-status-danger/25',
  Paid: 'bg-status-success/15 text-status-success border-status-success/25',
  Partial: 'bg-status-warning/15 text-status-warning border-status-warning/25',
  Unpaid: 'bg-status-danger/15 text-status-danger border-status-danger/25',
  Pending: 'bg-status-neutral/15 text-status-neutral border-status-neutral/25',
  Active: 'bg-status-success/15 text-status-success border-status-success/25',
  Inactive: 'bg-status-neutral/15 text-status-neutral border-status-neutral/25',
  'In Transit': 'bg-accent-primary/15 text-accent-primary border-accent-primary/25',
  Delivered: 'bg-status-success/15 text-status-success border-status-success/25',
  Delayed: 'bg-status-danger/15 text-status-danger border-status-danger/25',
  'Pending Dispatch': 'bg-status-warning/15 text-status-warning border-status-warning/25',
  Today: 'bg-status-warning/15 text-status-warning border-status-warning/25',
  Upcoming: 'bg-accent-primary/15 text-accent-primary border-accent-primary/25',
  Completed: 'bg-status-success/15 text-status-success border-status-success/25',
};

interface StatusBadgeProps {
  status: StatusType;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const style = statusStyles[status] || statusStyles['Pending'];
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${style}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
