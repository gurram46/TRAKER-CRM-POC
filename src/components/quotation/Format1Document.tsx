import React from 'react';
import { FormatProps } from './types';

const formatINR = (n: number) => {
  if (!n || isNaN(n)) return '0.00';
  return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const Format1Document: React.FC<FormatProps> = ({ clientName, clientAddress, items, calc, today }) => {
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-black p-[20mm] font-sans text-[11pt] mx-auto shadow-md">
      <div className="mb-8">
        <h1 className="text-[14pt] font-bold underline mb-4">Quotation</h1>
        <p><b>To:</b> {clientName || 'Client Name'}</p>
        {clientAddress && <p className="whitespace-pre-wrap mt-1">{clientAddress}</p>}
        <p className="mt-3">Dear Sir / Ma'am,</p>
        <p className="mt-2">Please find our best offer for your below requirement:</p>
      </div>

      <table className="w-full border-collapse border border-black text-center mb-8">
        <thead>
          <tr>
            <th className="border border-black p-2 text-[12pt]">S. No</th>
            <th className="border border-black p-2 text-[12pt]">MATERIAL DESC.</th>
            <th className="border border-black p-2 text-[12pt]">QTY (MT)</th>
            <th className="border border-black p-2 text-[12pt]">RATE / MT (₹)</th>
            <th className="border border-black p-2 text-[12pt]">AMOUNT (₹)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const amount = item.quantity * item.basePrice;
            return (
              <tr key={item.id}>
                <td className="border border-black p-2">{index + 1}</td>
                <td className="border border-black p-2 text-left">{item.material || '—'}</td>
                <td className="border border-black p-2">{item.quantity}</td>
                <td className="border border-black p-2">{formatINR(item.basePrice)}</td>
                <td className="border border-black p-2 font-medium">{formatINR(amount)}</td>
              </tr>
            );
          })}
          <tr>
            <td className="border border-black p-2 font-bold text-right" colSpan={4}>SUBTOTAL</td>
            <td className="border border-black p-2 font-bold">{formatINR(calc.materialCost)}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold text-right" colSpan={4}>GST (18%)</td>
            <td className="border border-black p-2">{formatINR(calc.gstAmount)}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold text-right" colSpan={4}>FREIGHT</td>
            <td className="border border-black p-2">{formatINR(calc.total - calc.materialCost - calc.gstAmount - calc.margin)}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold text-right text-[12pt]" colSpan={4}>NET TOTAL</td>
            <td className="border border-black p-2 font-bold text-[12pt]">{formatINR(calc.total)}</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-16">
        <p>Regards,</p>
        <p><b>Omnia Steels Pvt Ltd</b></p>
      </div>
    </div>
  );
};

export default Format1Document;
