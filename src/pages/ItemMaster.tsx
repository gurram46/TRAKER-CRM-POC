import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { itemsData } from '../data/dummyData';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';

const ItemMaster: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewItem, setShowNewItem] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const filteredItems = itemsData.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-display font-bold text-text-primary">Item Master</h1>
          <span className="text-xs font-mono font-medium text-accent-primary bg-accent-primary/10 px-2.5 py-1 rounded-full border border-accent-primary/20">
            {itemsData.length} Items
          </span>
        </div>
        <button
          onClick={() => setShowNewItem(true)}
          className="flex items-center gap-2 bg-accent-primary hover:bg-accent-secondary text-white text-sm font-body font-medium px-4 py-2.5 rounded-md transition-colors duration-150"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by code, name, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg-primary border border-border rounded-md py-2.5 pl-9 pr-4 text-sm font-body text-text-primary placeholder:text-text-muted transition-all duration-150"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 text-xs font-body font-medium text-text-secondary border border-border rounded-md hover:bg-bg-hover transition-colors duration-150">
          <Filter size={14} />
          Filters
        </button>
      </div>

      <div className="bg-bg-tertiary border border-border rounded-md shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-bg-secondary">
                {['Item Code', 'Item Name', 'Category', 'Specification', 'Grade', 'UOM', 'Actions'].map((h) => (
                  <th key={h} className="text-[11px] font-body font-semibold text-text-muted uppercase tracking-[0.06em] px-4 py-3 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, idx) => (
                <tr key={item.code} className={`border-b border-border hover:bg-bg-hover transition-colors duration-150 ${idx % 2 === 0 ? 'bg-bg-tertiary' : 'bg-transparent'}`}>
                  <td className="px-4 py-3 text-xs font-mono font-medium text-text-primary">{item.code}</td>
                  <td className="px-4 py-3 text-sm font-body font-medium text-text-primary">{item.name}</td>
                  <td className="px-4 py-3 text-sm font-body text-text-secondary">{item.category}</td>
                  <td className="px-4 py-3 text-sm font-body text-text-secondary">{item.specification}</td>
                  <td className="px-4 py-3 text-sm font-body text-text-secondary">{item.grade}</td>
                  <td className="px-4 py-3 text-xs font-mono text-text-secondary">{item.uom}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="text-text-muted hover:text-accent-primary transition-colors"><Edit size={14} /></button>
                      <button className="text-text-muted hover:text-status-danger transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showNewItem}
        onClose={() => setShowNewItem(false)}
        title="Add New Item"
        footer={
          <>
            <button onClick={() => setShowNewItem(false)} className="px-4 py-2 text-sm font-body text-text-secondary border border-border rounded-md hover:bg-bg-hover transition-colors">Cancel</button>
            <button onClick={() => { setShowNewItem(false); setShowToast(true); }} className="px-4 py-2 text-sm font-body font-medium text-white bg-accent-primary hover:bg-accent-secondary rounded-md transition-colors">Save Item</button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Item Code</label>
              <input type="text" className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary" placeholder="Auto-generated or custom" />
            </div>
            <div>
              <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Category</label>
              <select className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-secondary">
                <option>HR Coil</option>
                <option>CR Sheet</option>
                <option>MS Pipe</option>
                <option>TMT Bars</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Item Name</label>
            <input type="text" className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary" placeholder="Enter item name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Specification / Size</label>
              <input type="text" className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary" placeholder="e.g., 2.5mm x 1250mm" />
            </div>
            <div>
              <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">Grade</label>
              <input type="text" className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-primary" placeholder="e.g., IS 2062 E250" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">UOM (Unit of Measure)</label>
            <select className="w-full bg-bg-primary border border-border rounded-md py-2.5 px-3 text-sm font-body text-text-secondary">
              <option>MT</option>
              <option>KGs</option>
              <option>Pieces</option>
              <option>Meters</option>
            </select>
          </div>
        </div>
      </Modal>
      
      <Toast message="Item added successfully" isVisible={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
};

export default ItemMaster;
