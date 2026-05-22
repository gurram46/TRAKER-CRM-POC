import React from 'react';
import { FormatProps } from './types';

const formatINR = (n: number) => {
  if (!n || isNaN(n)) return '0.00';
  return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const Format3Document: React.FC<FormatProps> = ({ items }) => {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-black p-[20mm] font-serif text-[11pt] mx-auto shadow-md">
      <div className="mb-6">
        <p className="mb-2">Dear Sir,</p>
        <p className="mb-4">Greetings for the day !!</p>
        <p>Please find the below Rail requirement for our ongoing project, kindly confirm your competitive offer and lead time for supply of the same.</p>
      </div>

      <table className="w-full border-collapse mb-6 text-[10pt]">
        <thead>
          <tr className="bg-blue-50 text-blue-900 border border-blue-200">
            <th className="border border-blue-200 p-2 font-normal">Sl No</th>
            <th className="border border-blue-200 p-2 font-normal text-center">Material Description</th>
            <th className="border border-blue-200 p-2 font-normal text-center">UoM</th>
            <th className="border border-blue-200 p-2 font-normal text-center">Qty</th>
            <th className="border border-blue-200 p-2 font-normal text-center">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td className="border border-blue-200 p-2 text-center font-bold">1</td>
              <td className="border border-blue-200 p-2"></td>
              <td className="border border-blue-200 p-2 text-center font-bold">MT</td>
              <td className="border border-blue-200 p-2 text-center font-bold"></td>
              <td className="border border-blue-200 p-2 text-center font-bold"></td>
            </tr>
          ) : (
            items.map((item, index) => (
              <tr key={item.id || index}>
                <td className="border border-blue-200 p-2 text-center font-bold">{index + 1}</td>
                <td className="border border-blue-200 p-2 font-bold">{item.material}</td>
                <td className="border border-blue-200 p-2 text-center font-bold">MT</td>
                <td className="border border-blue-200 p-2 text-center font-bold">{item.quantity > 0 ? item.quantity : ''}</td>
                <td className="border border-blue-200 p-2 text-center font-bold text-blue-900"></td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="text-[10pt] mb-8 space-y-2">
        <p>• The material of the Rail shall be Mn steel ("Industrial Use" grade of rail) having yield strength close to 85 Kg/mm2.</p>
        <p>• The Rail shall be of free from any defect & to be perfectly straight throughout the entire length.</p>
        <p className="font-bold text-blue-900 mt-4">**MTC and RITES inspection certificate are mandatory requirement.</p>
        <p className="text-blue-900 mt-4">Delivery - F.O.R. Larsen & Toubro Limited., Engineering Workshop, NH4 Bangalore Highway, Nirvaloor village, Kanchipuram. 631561</p>
        <p className="text-blue-900 mt-4">We look forward to your prompt response and the best possible offer.</p>
      </div>
      
      <div className="mt-8 text-[10pt] leading-tight">
        <p className="font-bold">Thanks & regards,</p>
        <p className="font-bold text-blue-900">K Sivasubramaniyan</p>
        <p className="font-bold text-gray-700">Larsen & Toubro Limited. | Engineering Workshop, Kanchipuram.</p>
        <p className="font-bold">Mobile:+91-8349992357</p>
        <p className="font-bold">Email : <a href="mailto:shivas@lntecc.com" className="underline">shivas@lntecc.com</a></p>
      </div>
    </div>
  );
};

export default Format3Document;
