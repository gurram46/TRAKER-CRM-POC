import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { revenueData } from '../../data/dummyData';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-secondary border border-border rounded-md px-3 py-2 shadow-dropdown">
        <p className="text-xs font-body text-text-secondary">{label}</p>
        <p className="text-sm font-mono font-medium text-accent-primary">₹{payload[0].value}L</p>
      </div>
    );
  }
  return null;
};

const RevenueChart: React.FC = () => {
  return (
    <div className="bg-bg-tertiary border border-border rounded-md p-5 shadow-card">
      <h3 className="text-sm font-display font-semibold text-text-primary mb-4">Revenue This Month</h3>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={revenueData} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 12, fontFamily: 'DM Sans' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 12, fontFamily: 'JetBrains Mono' }}
              tickFormatter={(v) => `₹${v}L`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59,130,246,0.05)' }} />
            <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
