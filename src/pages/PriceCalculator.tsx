import React, { useState, useMemo } from 'react';
import { Calculator, Plus, Trash2, IndianRupee, TrendingUp, Truck } from 'lucide-react';
import { itemsData } from '../data/dummyData';

interface CalcRow {
  id: number;
  itemCode: string;
  qty: number;
  basePrice: number;
  marginPct: number;
  gstPct: number;
  transportPerMT: number;
}

const PriceCalculator: React.FC = () => {
  const [rows, setRows] = useState<CalcRow[]>([
    { id: 1, itemCode: '', qty: 10, basePrice: 50000, marginPct: 5, gstPct: 18, transportPerMT: 1500 }
  ]);

  const addRow = () => {
    setRows([...rows, { id: Date.now(), itemCode: '', qty: 10, basePrice: 50000, marginPct: 5, gstPct: 18, transportPerMT: 1500 }]);
  };

  const removeRow = (id: number) => {
    if (rows.length > 1) {
      setRows(rows.filter(r => r.id !== id));
    }
  };

  const updateRow = (id: number, field: keyof CalcRow, value: string | number) => {
    setRows(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, [field]: typeof value === 'string' && field !== 'itemCode' ? Number(value) : value };
      }
      return r;
    }));
  };

  const summary = useMemo(() => {
    let baseTotal = 0;
    let marginTotal = 0;
    let transportTotal = 0;
    let taxTotal = 0;
    let grandTotal = 0;

    rows.forEach(r => {
      const base = (r.qty || 0) * (r.basePrice || 0);
      const margin = base * ((r.marginPct || 0) / 100);
      const transport = (r.qty || 0) * (r.transportPerMT || 0);
      const subtotal = base + margin + transport;
      const tax = subtotal * ((r.gstPct || 0) / 100);
      
      baseTotal += base;
      marginTotal += margin;
      transportTotal += transport;
      taxTotal += tax;
      grandTotal += subtotal + tax;
    });

    return { baseTotal, marginTotal, transportTotal, taxTotal, grandTotal };
  }, [rows]);

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-display font-bold text-text-primary">Price Calculator</h1>
      </div>

      <div className="flex gap-6 items-start">
        {/* Left Panel: Input Form */}
        <div className="flex-1 bg-bg-tertiary border border-border rounded-md shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-display font-bold text-text-primary uppercase tracking-wider">Line Items</h2>
            <button 
              onClick={addRow}
              className="flex items-center gap-1.5 text-xs font-body font-medium text-accent-primary bg-accent-primary/10 px-3 py-1.5 rounded hover:bg-accent-primary/20 transition-colors"
            >
              <Plus size={14} /> Add Row
            </button>
          </div>

          <div className="space-y-4">
            {rows.map((row, index) => (
              <div key={row.id} className="p-4 bg-bg-secondary border border-border rounded-md relative group">
                <button 
                  onClick={() => removeRow(row.id)}
                  disabled={rows.length === 1}
                  className="absolute top-4 right-4 text-text-muted hover:text-status-danger disabled:opacity-30 transition-colors"
                >
                  <Trash2 size={16} />
                </button>

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-4">
                    <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Item Name</label>
                    <select 
                      value={row.itemCode}
                      onChange={(e) => updateRow(row.id, 'itemCode', e.target.value)}
                      className="w-full bg-bg-primary border border-border rounded py-2 px-2 text-sm font-body text-text-primary"
                    >
                      <option value="">Custom Item</option>
                      {itemsData.map(i => (
                        <option key={i.code} value={i.code}>{i.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Qty (MT)</label>
                    <input type="number" value={row.qty} onChange={e => updateRow(row.id, 'qty', e.target.value)} className="w-full bg-bg-primary border border-border rounded py-2 px-2 text-sm font-body text-text-primary text-right" />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Base Price/MT</label>
                    <input type="number" value={row.basePrice} onChange={e => updateRow(row.id, 'basePrice', e.target.value)} className="w-full bg-bg-primary border border-border rounded py-2 px-2 text-sm font-body text-text-primary text-right" />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Margin %</label>
                    <input type="number" value={row.marginPct} onChange={e => updateRow(row.id, 'marginPct', e.target.value)} className="w-full bg-bg-primary border border-border rounded py-2 px-2 text-sm font-body text-text-primary text-right" />
                  </div>
                  <div className="col-span-6 mt-2">
                    <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Transport Cost per MT</label>
                    <input type="number" value={row.transportPerMT} onChange={e => updateRow(row.id, 'transportPerMT', e.target.value)} className="w-full bg-bg-primary border border-border rounded py-2 px-2 text-sm font-body text-text-primary text-right" />
                  </div>
                  <div className="col-span-6 mt-2">
                    <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">GST %</label>
                    <select value={row.gstPct} onChange={(e) => updateRow(row.id, 'gstPct', e.target.value)} className="w-full bg-bg-primary border border-border rounded py-2 px-2 text-sm font-body text-text-primary">
                      <option value={18}>18%</option>
                      <option value={12}>12%</option>
                      <option value={5}>5%</option>
                      <option value={0}>0%</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Live Summary */}
        <div className="w-80 flex-shrink-0 sticky top-24">
          <div className="bg-bg-tertiary border border-border rounded-md shadow-card overflow-hidden">
            <div className="p-4 bg-accent-primary/5 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-display font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                <Calculator size={16} className="text-accent-primary" />
                Live Summary
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center text-sm font-body">
                <span className="text-text-secondary">Base Cost</span>
                <span className="font-mono text-text-primary font-medium">{formatCurrency(summary.baseTotal)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-body">
                <span className="text-text-secondary flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-status-success" />
                  Total Margin
                </span>
                <span className="font-mono text-status-success font-medium">+{formatCurrency(summary.marginTotal)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-body">
                <span className="text-text-secondary flex items-center gap-1.5">
                  <Truck size={14} className="text-text-muted" />
                  Transport
                </span>
                <span className="font-mono text-text-primary font-medium">{formatCurrency(summary.transportTotal)}</span>
              </div>
              
              <div className="h-px bg-border my-2 border-dashed"></div>
              
              <div className="flex justify-between items-center text-sm font-body">
                <span className="text-text-secondary font-medium">Subtotal</span>
                <span className="font-mono text-text-primary font-bold">{formatCurrency(summary.baseTotal + summary.marginTotal + summary.transportTotal)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-body">
                <span className="text-text-secondary">GST</span>
                <span className="font-mono text-text-secondary">+{formatCurrency(summary.taxTotal)}</span>
              </div>
              
              <div className="bg-bg-secondary border border-border rounded-md p-3 mt-4">
                <span className="block text-xs font-body font-semibold text-text-muted uppercase tracking-wider mb-1">Landed Cost</span>
                <span className="block text-2xl font-mono font-bold text-accent-primary">{formatCurrency(summary.grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceCalculator;
