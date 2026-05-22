export interface QuoteItem {
  id: string;
  material: string;
  quantity: number;
  basePrice: number;
  projectGroup?: string;
  remarks?: string;
}

export interface FormatProps {
  rfqId: string;
  clientName: string;
  clientAddress: string;
  clientContact: string;
  clientEmail: string;
  items: QuoteItem[];
  gstPercent: number;
  freight: number;
  marginPercent: number;
  calc: {
    materialCost: number;
    gstAmount: number;
    margin: number;
    total: number;
  };
  today: string;
  quoteNumber: string;
}
