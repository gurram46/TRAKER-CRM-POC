import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { rfqStatusBreakdown } from '../../data/dummyData';

const total = rfqStatusBreakdown.reduce((sum, item) => sum + item.value, 0);

const RFQDonutChart: React.FC = () => {
  return (
    <div className="bg-bg-tertiary border border-border rounded-md p-5 shadow-card">
      <h3 className="text-sm font-display font-semibold text-text-primary mb-4">RFQ Status Breakdown</h3>
      <div className="h-[240px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={rfqStatusBreakdown}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {rfqStatusBreakdown.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-display font-bold text-text-primary">{total}</span>
          <span className="text-[11px] font-body text-text-secondary">Total RFQs</span>
        </div>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-3">
        {rfqStatusBreakdown.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[11px] font-body text-text-secondary">{item.name} ({item.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RFQDonutChart;
