import React, { useState, useMemo } from 'react';
import { Calculator, Plus, Trash2, TrendingUp, Truck, Download, FileText, RefreshCw } from 'lucide-react';
import { itemsData } from '../data/dummyData';

interface CalcRow {
  id: number;
  itemCode: string;
  itemName: string;
  specification: string;
  grade: string;
  qty: number;
  basePrice: number;
  marginPct: number;
  gstPct: number;
  transportPerMT: number;
  processingPerMT: number;
}

const quickFillItems = [
  { name: 'ISMB 200', spec: 'IS 2062 E250', grade: 'Fe 500', price: 58000 },
  { name: 'ISMB 300', spec: 'IS 2062 E250', grade: 'Fe 500', price: 62000 },
  { name: 'TMT Bar 12mm', spec: 'IS 1786', grade: 'Fe 500D', price: 55000 },
  { name: 'TMT Bar 16mm', spec: 'IS 1786', grade: 'Fe 500D', price: 54000 },
  { name: 'MS Plate 10mm', spec: 'IS 2062', grade: 'E250A', price: 67000 },
  { name: 'HR Coil 3mm', spec: 'IS 10748', grade: 'E250', price: 52000 },
  { name: 'MS Angle 50x50x6', spec: 'IS 2062', grade: 'E250', price: 59000 },
  { name: 'MS Channel 100', spec: 'IS 2062', grade: 'E250', price: 61000 },
];

const PriceCalculator: React.FC = () => {
  const [rows, setRows] = useState<CalcRow[]>([
    { id: 1, itemCode: '', itemName: 'ISMB 200', specification: 'IS 2062 E250', grade: 'Fe 500', qty: 1, basePrice: 0, marginPct: 12, gstPct: 18, transportPerMT: 0, processingPerMT: 0 }
  ]);
  const [defaultMargin, setDefaultMargin] = useState(12);
  const [defaultGst, setDefaultGst] = useState(18);
  const [defaultTransport, setDefaultTransport] = useState(0);

  const addRow = () => {
    setRows([...rows, { id: Date.now(), itemCode: '', itemName: '', specification: '', grade: '', qty: 1, basePrice: 0, marginPct: defaultMargin, gstPct: defaultGst, transportPerMT: defaultTransport, processingPerMT: 0 }]);
  };

  const applyDefaults = () => {
    setRows(prev => prev.map(r => ({ ...r, marginPct: defaultMargin, gstPct: defaultGst, transportPerMT: defaultTransport })));
  };

  const applyQuickFill = (rowId: number, item: typeof quickFillItems[0]) => {
    setRows(prev => prev.map(r => r.id === rowId ? { ...r, itemName: item.name, specification: item.spec, grade: item.grade, basePrice: item.price } : r));
  };

  const removeRow = (id: number) => {
    if (rows.length > 1) {
      setRows(rows.filter(r => r.id !== id));
    }
  };

  const updateRow = (id: number, field: keyof CalcRow, value: string | number) => {
    setRows(prev => prev.map(r => {
      if (r.id === id) {
        const isStringField = ['itemCode', 'itemName', 'specification', 'grade'].includes(field);
        return { ...r, [field]: typeof value === 'string' && !isStringField ? Number(value) : value };
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
      const processing = (r.qty || 0) * (r.processingPerMT || 0);
      const subtotal = base + margin + transport + processing;
      const tax = subtotal * ((r.gstPct || 0) / 100);
      
      baseTotal += base;
      marginTotal += margin;
      transportTotal += transport + processing;
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

  const totalQty = rows.reduce((s, r) => s + (r.qty || 0), 0);
  const grossMarginPct = summary.baseTotal > 0 ? ((summary.marginTotal / summary.baseTotal) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">Price Calculator</h1>
          <p className="text-sm text-text-secondary mt-0.5">Calculate sell price, margin and GST for steel items</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 border border-border bg-bg-secondary hover:bg-bg-hover text-text-primary text-sm font-body font-medium px-4 py-2.5 rounded-md transition-colors">
            <Download size={15} />
            Export PDF
          </button>
          <button className="flex items-center gap-2 bg-accent-primary hover:bg-accent-secondary text-white text-sm font-body font-medium px-4 py-2.5 rounded-md transition-colors">
            <FileText size={15} />
            Save as Quote
          </button>
        </div>
      </div>

      {/* Defaults Bar */}
      <div className="flex items-center gap-4 bg-bg-tertiary border border-border rounded-xl px-5 py-3">
        <span className="text-[11px] font-body font-bold text-text-muted uppercase tracking-widest">Defaults</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary font-body">Margin %</span>
          <input type="number" value={defaultMargin} onChange={e => setDefaultMargin(Number(e.target.value))} className="w-14 bg-bg-primary border border-border rounded py-1 px-2 text-sm font-mono text-text-primary text-center" />
          <span className="text-xs text-text-muted">%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary font-body">GST %</span>
          <input type="number" value={defaultGst} onChange={e => setDefaultGst(Number(e.target.value))} className="w-14 bg-bg-primary border border-border rounded py-1 px-2 text-sm font-mono text-text-primary text-center" />
          <span className="text-xs text-text-muted">%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary font-body">Transport ₹/MT</span>
          <input type="number" value={defaultTransport} onChange={e => setDefaultTransport(Number(e.target.value))} className="w-20 bg-bg-primary border border-border rounded py-1 px-2 text-sm font-mono text-text-primary text-center" />
        </div>
        <button onClick={applyDefaults} className="ml-auto flex items-center gap-1.5 text-xs font-body font-medium text-accent-primary hover:text-accent-secondary transition-colors">
          <RefreshCw size={13} />
          Apply to all rows
        </button>
      </div>

      <div className="flex gap-6 items-start">
        {/* Left Panel: Input Form */}
        <div className="flex-1 bg-bg-tertiary border border-border rounded-md shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-display font-bold text-text-primary uppercase tracking-wider">Line Items</h2>
          </div>

          <div className="space-y-4">
            {rows.map((row, index) => {
              const costPerMT = (row.basePrice || 0) + (row.processingPerMT || 0) + (row.transportPerMT || 0);
              const sellPerMT = costPerMT * (1 + (row.marginPct || 0) / 100);
              const gstPerMT = sellPerMT * ((row.gstPct || 0) / 100);
              const totalValue = (row.qty || 0) * (sellPerMT + gstPerMT);
              return (
              <div key={row.id} className="bg-bg-secondary border border-border rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
                  <span className="text-xs font-body font-bold text-text-muted uppercase tracking-wider">Item {index + 1}</span>
                  <div className="flex items-center gap-2">
                    <select onChange={e => { const item = quickFillItems.find(i => i.name === e.target.value); if(item) applyQuickFill(row.id, item); }}
                      className="bg-bg-primary border border-border rounded py-1 px-2 text-xs font-body text-text-secondary w-36">
                      <option value="">Quick fill...</option>
                      {quickFillItems.map(i => <option key={i.name} value={i.name}>{i.name}</option>)}
                    </select>
                    <button onClick={() => removeRow(row.id)} disabled={rows.length === 1}
                      className="text-text-muted hover:text-red-400 disabled:opacity-30 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-body text-text-secondary mb-1">Item Name</label>
                    <input value={row.itemName} onChange={e => updateRow(row.id, 'itemName', e.target.value)} placeholder="ISMB 200" className="w-full bg-bg-primary border border-border rounded py-2 px-3 text-sm font-body text-text-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-body text-text-secondary mb-1">Specification</label>
                    <input value={row.specification} onChange={e => updateRow(row.id, 'specification', e.target.value)} placeholder="IS 2062 E250" className="w-full bg-bg-primary border border-border rounded py-2 px-3 text-sm font-body text-text-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-body text-text-secondary mb-1">Grade</label>
                    <input value={row.grade} onChange={e => updateRow(row.id, 'grade', e.target.value)} placeholder="Fe 500" className="w-full bg-bg-primary border border-border rounded py-2 px-3 text-sm font-body text-text-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-body text-text-secondary mb-1">Quantity (MT)</label>
                    <div className="flex items-center gap-1">
                      <input type="number" value={row.qty} onChange={e => updateRow(row.id, 'qty', e.target.value)} className="w-full bg-bg-primary border border-border rounded py-2 px-3 text-sm font-mono text-text-primary" />
                      <span className="text-xs text-text-muted font-body">MT</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-body text-text-secondary mb-1">Base Price (₹/MT)</label>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-text-muted">₹</span>
                      <input type="number" value={row.basePrice} onChange={e => updateRow(row.id, 'basePrice', e.target.value)} className="w-full bg-bg-primary border border-border rounded py-2 px-3 text-sm font-mono text-text-primary" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-body text-text-secondary mb-1">Transport (₹/MT)</label>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-text-muted">₹</span>
                      <input type="number" value={row.transportPerMT} onChange={e => updateRow(row.id, 'transportPerMT', e.target.value)} className="w-full bg-bg-primary border border-border rounded py-2 px-3 text-sm font-mono text-text-primary" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-body text-text-secondary mb-1">Processing (₹/MT)</label>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-text-muted">₹</span>
                      <input type="number" value={row.processingPerMT} onChange={e => updateRow(row.id, 'processingPerMT', e.target.value)} className="w-full bg-bg-primary border border-border rounded py-2 px-3 text-sm font-mono text-text-primary" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-body text-text-secondary mb-1">Margin %</label>
                    <input type="number" value={row.marginPct} onChange={e => updateRow(row.id, 'marginPct', e.target.value)} className="w-full bg-bg-primary border border-border rounded py-2 px-3 text-sm font-mono text-text-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-body text-text-secondary mb-1">GST %</label>
                    <select value={row.gstPct} onChange={e => updateRow(row.id, 'gstPct', e.target.value)} className="w-full bg-bg-primary border border-border rounded py-2 px-3 text-sm font-body text-text-primary">
                      <option value={18}>18</option>
                      <option value={12}>12</option>
                      <option value={5}>5</option>
                      <option value={0}>0</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-4 border-t border-border">
                  {[
                    { label: 'COST/MT', value: `₹${Math.round(costPerMT).toLocaleString('en-IN')}` },
                    { label: 'SELL/MT', value: `₹${Math.round(sellPerMT).toLocaleString('en-IN')}` },
                    { label: 'GST/MT', value: `₹${Math.round(gstPerMT).toLocaleString('en-IN')}` },
                    { label: 'TOTAL VALUE', value: `₹${Math.round(totalValue).toLocaleString('en-IN')}` },
                  ].map(s => (
                    <div key={s.label} className="text-center py-2.5 border-r border-border last:border-r-0">
                      <p className="text-sm font-mono font-bold text-text-primary">{s.value}</p>
                      <p className="text-[10px] text-text-muted uppercase tracking-wide">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              );
            })}
          </div>
          <button onClick={addRow} className="w-full mt-4 flex items-center justify-center gap-2 border-2 border-dashed border-border hover:border-accent-primary/40 rounded-xl py-3 text-sm font-body text-text-muted hover:text-accent-primary transition-all">
            <Plus size={16} />
            Add Item
          </button>
        </div>

        {/* Right Panel */}
        <div className="w-72 flex-shrink-0 sticky top-24 space-y-4">
          <div className="bg-bg-tertiary border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border">
              <h2 className="text-sm font-display font-bold text-text-primary uppercase tracking-wider">Summary</h2>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between text-sm font-body">
                <span className="text-text-secondary">Total Quantity</span>
                <span className="font-mono font-bold text-text-primary">{totalQty.toFixed(1)} MT</span>
              </div>
              <div className="flex justify-between text-sm font-body">
                <span className="text-text-secondary">Total Cost</span>
                <span className="font-mono text-text-primary">{formatCurrency(summary.baseTotal)}</span>
              </div>
              <div className="flex justify-between text-sm font-body">
                <span className="text-text-secondary">Total Sell (ex-GST)</span>
                <span className="font-mono text-text-primary">{formatCurrency(summary.baseTotal + summary.marginTotal + summary.transportTotal)}</span>
              </div>
              <div className="flex justify-between text-sm font-body">
                <span className="text-text-secondary">GST Amount</span>
                <span className="font-mono text-text-primary">{formatCurrency(summary.taxTotal)}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between text-sm font-body font-bold">
                <span className="text-text-primary">Grand Total</span>
                <span className="font-mono text-text-primary">{formatCurrency(summary.grandTotal)}</span>
              </div>
            </div>
          </div>

          <div className="bg-bg-tertiary border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border">
              <h2 className="text-sm font-display font-bold text-text-primary uppercase tracking-wider">Margin Analysis</h2>
            </div>
            <div className="p-5">
              <p className="text-3xl font-mono font-bold text-text-primary">{formatCurrency(summary.marginTotal)}</p>
              <p className="text-xs text-text-muted mt-1">Gross margin earned</p>
              <div className="mt-3 flex items-center gap-2">
                <span className={`text-xs font-body font-bold px-2 py-1 rounded ${Number(grossMarginPct) >= 12 ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>{grossMarginPct}%</span>
                <span className="text-xs text-text-muted">Target: 12% · {Number(grossMarginPct) >= 12 ? `${(Number(grossMarginPct) - 12).toFixed(1)}% above` : `${(12 - Number(grossMarginPct)).toFixed(1)}% below`} target</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceCalculator;
