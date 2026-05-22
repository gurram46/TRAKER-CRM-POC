// ── Omnia Steels CRM — All Dummy Data ──

export const materials = [
  'HR Coil', 'CR Sheet', 'MS Pipe', 'Angle Iron',
  'TMT Bars', 'Chequered Plate', 'GI Sheet', 'Structural Steel',
] as const;

export type MaterialType = typeof materials[number];

export interface Contact {
  id: string;
  name: string;
  company: string;
  type: 'Client' | 'Vendor' | 'Transporter';
  phone: string;
  email: string;
  city: string;
  deals: number;
  value: string;
  lastActive: string;
  avatar: string;
}

export const contactsData: Contact[] = [
  { id: 'C-001', name: 'Vijaya Constructions', company: 'Vijaya Constructions Pvt Ltd', type: 'Client', phone: '9876543210', email: 'vijaya@constructions.com', city: 'Hyderabad', deals: 4, value: '₹18.2L', lastActive: '15 May 2026', avatar: 'VC' },
  { id: 'C-002', name: 'Sri Lakshmi Steels', company: 'Sri Lakshmi Steels Ltd', type: 'Client', phone: '9845612378', email: 'srilakshmi@steels.com', city: 'Vijayawada', deals: 6, value: '₹31.4L', lastActive: '14 May 2026', avatar: 'SL' },
  { id: 'C-003', name: 'Prasad Infrastructure', company: 'Prasad Infra Pvt Ltd', type: 'Client', phone: '9912345678', email: 'prasad@infra.com', city: 'Visakhapatnam', deals: 3, value: '₹21.3L', lastActive: '12 May 2026', avatar: 'PI' },
  { id: 'C-004', name: 'KVR Builders', company: 'KVR Builders & Developers', type: 'Client', phone: '9988776655', email: 'kvr@builders.com', city: 'Guntur', deals: 5, value: '₹44.1L', lastActive: '10 May 2026', avatar: 'KB' },
  { id: 'C-005', name: 'Ravi Structures', company: 'Ravi Structures Pvt Ltd', type: 'Client', phone: '9944332211', email: 'ravi@structures.com', city: 'Kurnool', deals: 2, value: '₹9.8L', lastActive: '08 May 2026', avatar: 'RS' },
  { id: 'C-006', name: 'Amaravati Developers', company: 'Amaravati Dev Corp', type: 'Client', phone: '9722110099', email: 'amara@dev.com', city: 'Amaravati', deals: 7, value: '₹62.5L', lastActive: '18 May 2026', avatar: 'AD' },
  { id: 'V-001', name: 'Narayana Steel Suppliers', company: 'Narayana Steel Suppliers', type: 'Vendor', phone: '9876543210', email: 'narayana@steels.com', city: 'Hyderabad', deals: 12, value: '₹84.0L', lastActive: '15 May 2026', avatar: 'NS' },
  { id: 'V-002', name: 'Andhra Steel Works', company: 'Andhra Steel Works', type: 'Vendor', phone: '9845612378', email: 'andhra@steelworks.com', city: 'Vijayawada', deals: 8, value: '₹56.2L', lastActive: '13 May 2026', avatar: 'AS' },
  { id: 'V-003', name: 'Deccan Metal Corp', company: 'Deccan Metal Corp', type: 'Vendor', phone: '9912345678', email: 'deccan@metals.com', city: 'Visakhapatnam', deals: 5, value: '₹38.7L', lastActive: '11 May 2026', avatar: 'DM' },
  { id: 'T-001', name: 'Deccan Logistics', company: 'Deccan Logistics Pvt Ltd', type: 'Transporter', phone: '9833221100', email: 'deccan@logistics.com', city: 'Hyderabad', deals: 22, value: '₹18.4L', lastActive: '19 May 2026', avatar: 'DL' },
  { id: 'T-002', name: 'Krishna Transport Co', company: 'Krishna Transport Co', type: 'Transporter', phone: '9988776655', email: 'krishna@transport.com', city: 'Vijayawada', deals: 15, value: '₹12.1L', lastActive: '17 May 2026', avatar: 'KT' },
];

export interface RFQItem {
  material: MaterialType;
  quantity: number;
  unit: string;
}

export interface RFQ {
  id: string;
  clientName: string;
  company: string;
  deliveryLocation: string;
  contactNumber: string;
  items: RFQItem[];
  requiredBy: string;
  specialRequirements: string;
  status: 'New' | 'In Progress' | 'Quoted' | 'Closed';
  source: 'Email — Auto Parsed' | 'Manual';
  createdAt: string;
  rfqType?: string;
  approvedMakes?: string[];
  certifications?: string[];
  confidenceScore?: number;
  paymentTerms?: string;
  deliveryTerms?: string;
}

export const rfqData: any[] = [
  { id: '#RFQ-2024-0047', client: 'Vijaya Constructions', contact: '9876543210', material: 'HR Coil', quantity: 120, requiredBy: '2024-12-22', vendorsSent: 3, status: 'New', created: '2024-12-18' },
  { id: '#RFQ-2024-0046', client: 'Sri Lakshmi Steels', contact: '9845612378', material: 'TMT Bars', quantity: 80, requiredBy: '2024-12-25', vendorsSent: 4, status: 'Sent', created: '2024-12-16' },
  { id: '#RFQ-2024-0045', client: 'Prasad Infrastructure', contact: '9912345678', material: 'CR Sheet', quantity: 45, requiredBy: '2024-12-20', vendorsSent: 2, status: 'Responded', created: '2024-12-15' },
  { id: '#RFQ-2024-0044', client: 'KVR Builders', contact: '9988776655', material: 'MS Pipe', quantity: 200, requiredBy: '2024-12-28', vendorsSent: 5, status: 'Converted', created: '2024-12-14' },
  { id: '#RFQ-2024-0043', client: 'Srinivasa Pipes', contact: '9866554433', material: 'Angle Iron', quantity: 35, requiredBy: '2024-12-19', vendorsSent: 2, status: 'Sent', created: '2024-12-13' },
  { id: '#RFQ-2024-0042', client: 'Ravi Structures', contact: '9944332211', material: 'GI Sheet', quantity: 60, requiredBy: '2024-12-30', vendorsSent: 3, status: 'New', created: '2024-12-12' },
  { id: '#RFQ-2024-0041', client: 'Bharat Steel Corp', contact: '9833221100', material: 'Chequered Plate', quantity: 25, requiredBy: '2024-12-21', vendorsSent: 1, status: 'Responded', created: '2024-12-11' },
  { id: '#RFQ-2024-0040', client: 'Amaravati Developers', contact: '9722110099', material: 'Structural Steel', quantity: 500, requiredBy: '2025-01-05', vendorsSent: 6, status: 'Sent', created: '2024-12-10' },
  { id: '#RFQ-2024-0039', client: 'Sai Krishna Infra', contact: '9611009988', material: 'HR Coil', quantity: 150, requiredBy: '2024-12-24', vendorsSent: 3, status: 'Converted', created: '2024-12-09' },
  { id: '#RFQ-2024-0038', client: 'Lakshmi Narasimha Steels', contact: '9500889977', material: 'TMT Bars', quantity: 90, requiredBy: '2024-12-26', vendorsSent: 4, status: 'New', created: '2024-12-08' },
  { id: '#RFQ-2024-0037', client: 'Vishal Enterprises', contact: '9477665544', material: 'CR Sheet', quantity: 70, requiredBy: '2024-12-23', vendorsSent: 2, status: 'Sent', created: '2024-12-07' },
  { id: '#RFQ-2024-0036', client: 'Devi Constructions', contact: '9366554433', material: 'MS Pipe', quantity: 110, requiredBy: '2024-12-29', vendorsSent: 3, status: 'Responded', created: '2024-12-06' },
];

export interface Vendor {
  id: string;
  name: string;
  city: string;
  state: string;
  materials: MaterialType[];
  contact: string;
  lastPrice: number;
  primaryMaterial: MaterialType;
  rating: number;
  lastOrder: string;
  status: 'Active' | 'Inactive';
}

export const vendorData: Vendor[] = [
  { id: 'V-001', name: 'Narayana Steel Suppliers', city: 'Hyderabad', state: 'Telangana', materials: ['HR Coil', 'CR Sheet', 'GI Sheet'], contact: '9876543210', lastPrice: 52000, primaryMaterial: 'HR Coil', rating: 4.5, lastOrder: '2024-12-15', status: 'Active' },
  { id: 'V-002', name: 'Andhra Steel Works', city: 'Vijayawada', state: 'AP', materials: ['TMT Bars', 'Structural Steel'], contact: '9845612378', lastPrice: 58000, primaryMaterial: 'TMT Bars', rating: 4.0, lastOrder: '2024-12-10', status: 'Active' },
  { id: 'V-003', name: 'Deccan Metal Corp', city: 'Visakhapatnam', state: 'AP', materials: ['CR Sheet', 'Chequered Plate'], contact: '9912345678', lastPrice: 61000, primaryMaterial: 'CR Sheet', rating: 3.5, lastOrder: '2024-11-28', status: 'Active' },
  { id: 'V-004', name: 'Telangana Steel Hub', city: 'Warangal', state: 'Telangana', materials: ['MS Pipe', 'Angle Iron'], contact: '9988776655', lastPrice: 48000, primaryMaterial: 'MS Pipe', rating: 4.2, lastOrder: '2024-12-12', status: 'Active' },
  { id: 'V-005', name: 'Krishna Valley Metals', city: 'Guntur', state: 'AP', materials: ['HR Coil', 'TMT Bars', 'GI Sheet'], contact: '9866554433', lastPrice: 53000, primaryMaterial: 'HR Coil', rating: 3.8, lastOrder: '2024-12-08', status: 'Active' },
  { id: 'V-006', name: 'Bhagyanagar Steel Traders', city: 'Karimnagar', state: 'Telangana', materials: ['Structural Steel', 'Angle Iron'], contact: '9944332211', lastPrice: 55000, primaryMaterial: 'Structural Steel', rating: 4.7, lastOrder: '2024-12-18', status: 'Active' },
  { id: 'V-007', name: 'Coastal Iron & Steel', city: 'Visakhapatnam', state: 'AP', materials: ['GI Sheet', 'Chequered Plate', 'CR Sheet'], contact: '9833221100', lastPrice: 49000, primaryMaterial: 'GI Sheet', rating: 3.2, lastOrder: '2024-11-20', status: 'Inactive' },
  { id: 'V-008', name: 'Godavari Metals Pvt Ltd', city: 'Vijayawada', state: 'AP', materials: ['HR Coil', 'MS Pipe'], contact: '9722110099', lastPrice: 51500, primaryMaterial: 'HR Coil', rating: 4.1, lastOrder: '2024-12-05', status: 'Active' },
  { id: 'V-009', name: 'Nizam Steel Corporation', city: 'Hyderabad', state: 'Telangana', materials: ['TMT Bars', 'CR Sheet', 'Structural Steel'], contact: '9611009988', lastPrice: 59000, primaryMaterial: 'TMT Bars', rating: 4.8, lastOrder: '2024-12-17', status: 'Active' },
  { id: 'V-010', name: 'Rayalaseema Steels', city: 'Kurnool', state: 'AP', materials: ['Angle Iron', 'MS Pipe'], contact: '9500889977', lastPrice: 46000, primaryMaterial: 'Angle Iron', rating: 3.6, lastOrder: '2024-11-25', status: 'Inactive' },
];

export interface Transporter {
  id: string;
  name: string;
  coverage: string;
  rate: number;
  vehicleTypes: string[];
  contact: string;
  reliability: number;
  status: 'Active' | 'Inactive';
}

export const transporterData: Transporter[] = [
  { id: 'T-001', name: 'Ravi Logistics', coverage: 'Hyd → Vizag, Hyd → Vijayawada', rate: 3.2, vehicleTypes: ['10T', '20T', 'Flatbed'], contact: '9876001122', reliability: 92, status: 'Active' },
  { id: 'T-002', name: 'Sai Transport Services', coverage: 'Hyd → Guntur, Hyd → Kurnool', rate: 2.8, vehicleTypes: ['10T', '20T'], contact: '9845002233', reliability: 85, status: 'Active' },
  { id: 'T-003', name: 'AP Cargo Movers', coverage: 'Vijayawada → Vizag, Hyd → Warangal', rate: 3.5, vehicleTypes: ['20T', 'Flatbed', 'Trailer'], contact: '9912003344', reliability: 78, status: 'Active' },
  { id: 'T-004', name: 'Telangana Freight Lines', coverage: 'Hyd → Karimnagar, Hyd → Warangal', rate: 2.5, vehicleTypes: ['10T', 'Flatbed'], contact: '9988004455', reliability: 95, status: 'Active' },
  { id: 'T-005', name: 'Deccan Express Transport', coverage: 'Hyd → All AP cities', rate: 3.8, vehicleTypes: ['10T', '20T', 'Flatbed', 'Trailer'], contact: '9866005566', reliability: 88, status: 'Active' },
  { id: 'T-006', name: 'Godavari Carriers', coverage: 'Vijayawada → Guntur, Hyd → Nalgonda', rate: 2.2, vehicleTypes: ['10T'], contact: '9944006677', reliability: 72, status: 'Inactive' },
];

export interface Payment {
  id: string;
  invoiceNo: string;
  client: string;
  rfqRef: string;
  invoiceDate: string;
  dueDate: string;
  invoiceAmt: number;
  paidAmt: number;
  status: 'Paid' | 'Partial' | 'Unpaid' | 'Overdue';
}

export const paymentData: Payment[] = [
  { id: 'P-001', invoiceNo: 'INV-2024-0089', client: 'Vijaya Constructions', rfqRef: '#RFQ-2024-0047', invoiceDate: '2024-12-01', dueDate: '2024-12-15', invoiceAmt: 624000, paidAmt: 624000, status: 'Paid' },
  { id: 'P-002', invoiceNo: 'INV-2024-0088', client: 'KVR Builders', rfqRef: '#RFQ-2024-0044', invoiceDate: '2024-11-28', dueDate: '2024-12-12', invoiceAmt: 960000, paidAmt: 500000, status: 'Partial' },
  { id: 'P-003', invoiceNo: 'INV-2024-0087', client: 'Sri Lakshmi Steels', rfqRef: '#RFQ-2024-0046', invoiceDate: '2024-11-25', dueDate: '2024-12-09', invoiceAmt: 464000, paidAmt: 0, status: 'Overdue' },
  { id: 'P-004', invoiceNo: 'INV-2024-0086', client: 'Prasad Infrastructure', rfqRef: '#RFQ-2024-0045', invoiceDate: '2024-12-05', dueDate: '2024-12-19', invoiceAmt: 274500, paidAmt: 274500, status: 'Paid' },
  { id: 'P-005', invoiceNo: 'INV-2024-0085', client: 'Ravi Structures', rfqRef: '#RFQ-2024-0042', invoiceDate: '2024-11-20', dueDate: '2024-12-04', invoiceAmt: 294000, paidAmt: 150000, status: 'Overdue' },
  { id: 'P-006', invoiceNo: 'INV-2024-0084', client: 'Amaravati Developers', rfqRef: '#RFQ-2024-0040', invoiceDate: '2024-12-10', dueDate: '2024-12-24', invoiceAmt: 1500000, paidAmt: 0, status: 'Unpaid' },
  { id: 'P-007', invoiceNo: 'INV-2024-0083', client: 'Bharat Steel Corp', rfqRef: '#RFQ-2024-0041', invoiceDate: '2024-12-08', dueDate: '2024-12-22', invoiceAmt: 152500, paidAmt: 152500, status: 'Paid' },
  { id: 'P-008', invoiceNo: 'INV-2024-0082', client: 'Sai Krishna Infra', rfqRef: '#RFQ-2024-0039', invoiceDate: '2024-11-15', dueDate: '2024-11-29', invoiceAmt: 780000, paidAmt: 400000, status: 'Overdue' },
  { id: 'P-009', invoiceNo: 'INV-2024-0081', client: 'Srinivasa Pipes', rfqRef: '#RFQ-2024-0043', invoiceDate: '2024-12-02', dueDate: '2024-12-16', invoiceAmt: 168000, paidAmt: 0, status: 'Unpaid' },
  { id: 'P-010', invoiceNo: 'INV-2024-0080', client: 'Devi Constructions', rfqRef: '#RFQ-2024-0036', invoiceDate: '2024-12-06', dueDate: '2024-12-20', invoiceAmt: 528000, paidAmt: 528000, status: 'Paid' },
];

export interface Shipment {
  id: string;
  client: string;
  material: MaterialType;
  quantity: number;
  transporter: string;
  status: 'Pending Dispatch' | 'In Transit' | 'Delivered' | 'Delayed';
  checkpoints: { name: string; completed: boolean; current: boolean }[];
  lastUpdate: string;
  lastLocation: string;
  eta: string;
}

export const shipmentData: Shipment[] = [
  {
    id: 'SHP-2024-0034', client: 'Vijaya Constructions', material: 'HR Coil', quantity: 50, transporter: 'Ravi Logistics', status: 'In Transit',
    checkpoints: [
      { name: 'Order Placed', completed: true, current: false },
      { name: 'Dispatched', completed: true, current: false },
      { name: 'Shadnagar Toll', completed: false, current: true },
      { name: 'Kurnool', completed: false, current: false },
      { name: 'Destination', completed: false, current: false },
    ],
    lastUpdate: '2h ago', lastLocation: 'Shadnagar Toll', eta: 'Tomorrow 6:00 PM',
  },
  {
    id: 'SHP-2024-0033', client: 'KVR Builders', material: 'MS Pipe', quantity: 200, transporter: 'Sai Transport Services', status: 'Delivered',
    checkpoints: [
      { name: 'Order Placed', completed: true, current: false },
      { name: 'Dispatched', completed: true, current: false },
      { name: 'Shadnagar Toll', completed: true, current: false },
      { name: 'Kurnool', completed: true, current: false },
      { name: 'Destination', completed: true, current: true },
    ],
    lastUpdate: '1d ago', lastLocation: 'Delivered', eta: 'Delivered',
  },
  {
    id: 'SHP-2024-0032', client: 'Prasad Infrastructure', material: 'CR Sheet', quantity: 45, transporter: 'AP Cargo Movers', status: 'Delayed',
    checkpoints: [
      { name: 'Order Placed', completed: true, current: false },
      { name: 'Dispatched', completed: true, current: false },
      { name: 'Shadnagar Toll', completed: true, current: false },
      { name: 'Kurnool', completed: false, current: true },
      { name: 'Destination', completed: false, current: false },
    ],
    lastUpdate: '6h ago', lastLocation: 'Near Kurnool bypass', eta: 'Delayed — ETA unknown',
  },
  {
    id: 'SHP-2024-0031', client: 'Amaravati Developers', material: 'Structural Steel', quantity: 500, transporter: 'Deccan Express Transport', status: 'Pending Dispatch',
    checkpoints: [
      { name: 'Order Placed', completed: true, current: true },
      { name: 'Dispatched', completed: false, current: false },
      { name: 'Shadnagar Toll', completed: false, current: false },
      { name: 'Kurnool', completed: false, current: false },
      { name: 'Destination', completed: false, current: false },
    ],
    lastUpdate: '3h ago', lastLocation: 'Yard — awaiting dispatch', eta: 'Dec 22, 2024',
  },
  {
    id: 'SHP-2024-0030', client: 'Sai Krishna Infra', material: 'HR Coil', quantity: 150, transporter: 'Telangana Freight Lines', status: 'In Transit',
    checkpoints: [
      { name: 'Order Placed', completed: true, current: false },
      { name: 'Dispatched', completed: true, current: false },
      { name: 'Shadnagar Toll', completed: true, current: false },
      { name: 'Kurnool', completed: true, current: false },
      { name: 'Destination', completed: false, current: true },
    ],
    lastUpdate: '45m ago', lastLocation: 'Approaching Vijayawada', eta: 'Today 8:00 PM',
  },
  {
    id: 'SHP-2024-0029', client: 'Bharat Steel Corp', material: 'Chequered Plate', quantity: 25, transporter: 'Ravi Logistics', status: 'In Transit',
    checkpoints: [
      { name: 'Order Placed', completed: true, current: false },
      { name: 'Dispatched', completed: true, current: true },
      { name: 'Shadnagar Toll', completed: false, current: false },
      { name: 'Kurnool', completed: false, current: false },
      { name: 'Destination', completed: false, current: false },
    ],
    lastUpdate: '1h ago', lastLocation: 'Left Attapur yard', eta: 'Dec 21, 10:00 AM',
  },
];

export interface FollowUp {
  id: string;
  client: string;
  initials: string;
  rfqRef: string;
  subject: string;
  lastContact: string;
  lastContactMethod: string;
  nextAction: string;
  dueDate: string;
  status: 'Overdue' | 'Today' | 'Upcoming' | 'Completed';
  daysOverdue?: number;
}

export const followUpData: FollowUp[] = [
  { id: 'FU-001', client: 'Vijaya Constructions', initials: 'VC', rfqRef: '#RFQ-2024-0034', subject: 'Price revision discussion', lastContact: 'May 12', lastContactMethod: 'WhatsApp', nextAction: 'Call to confirm order', dueDate: '2024-12-15', status: 'Overdue', daysOverdue: 3 },
  { id: 'FU-002', client: 'Sri Lakshmi Steels', initials: 'SL', rfqRef: '#RFQ-2024-0046', subject: 'TMT Bars quotation follow-up', lastContact: 'May 14', lastContactMethod: 'Call', nextAction: 'Send revised quote via email', dueDate: '2024-12-16', status: 'Overdue', daysOverdue: 2 },
  { id: 'FU-003', client: 'Prasad Infrastructure', initials: 'PI', rfqRef: '#RFQ-2024-0045', subject: 'CR Sheet sample approval', lastContact: 'May 16', lastContactMethod: 'Email', nextAction: 'Visit site for quality check', dueDate: '2024-12-17', status: 'Overdue', daysOverdue: 1 },
  { id: 'FU-004', client: 'KVR Builders', initials: 'KB', rfqRef: '#RFQ-2024-0044', subject: 'Payment reminder — partial pending', lastContact: 'May 15', lastContactMethod: 'WhatsApp', nextAction: 'Call accounts department', dueDate: '2024-12-18', status: 'Today' },
  { id: 'FU-005', client: 'Srinivasa Pipes', initials: 'SP', rfqRef: '#RFQ-2024-0043', subject: 'Angle Iron availability check', lastContact: 'May 13', lastContactMethod: 'Call', nextAction: 'WhatsApp updated stock list', dueDate: '2024-12-18', status: 'Today' },
  { id: 'FU-006', client: 'Ravi Structures', initials: 'RS', rfqRef: '#RFQ-2024-0042', subject: 'GI Sheet delivery confirmation', lastContact: 'May 17', lastContactMethod: 'WhatsApp', nextAction: 'Confirm delivery date', dueDate: '2024-12-18', status: 'Today' },
  { id: 'FU-007', client: 'Amaravati Developers', initials: 'AD', rfqRef: '#RFQ-2024-0040', subject: 'Large order negotiation', lastContact: 'May 10', lastContactMethod: 'Visit', nextAction: 'Schedule meeting with MD', dueDate: '2024-12-18', status: 'Today' },
  { id: 'FU-008', client: 'Bharat Steel Corp', initials: 'BS', rfqRef: '#RFQ-2024-0041', subject: 'Repeat order discussion', lastContact: 'May 16', lastContactMethod: 'Email', nextAction: 'Send catalog with new rates', dueDate: '2024-12-20', status: 'Upcoming' },
  { id: 'FU-009', client: 'Sai Krishna Infra', initials: 'SK', rfqRef: '#RFQ-2024-0039', subject: 'Logistics update needed', lastContact: 'May 14', lastContactMethod: 'Call', nextAction: 'Share tracking details', dueDate: '2024-12-21', status: 'Upcoming' },
  { id: 'FU-010', client: 'Devi Constructions', initials: 'DC', rfqRef: '#RFQ-2024-0036', subject: 'New project requirements', lastContact: 'May 12', lastContactMethod: 'WhatsApp', nextAction: 'Prepare custom quote', dueDate: '2024-12-22', status: 'Upcoming' },
  { id: 'FU-011', client: 'Vishal Enterprises', initials: 'VE', rfqRef: '#RFQ-2024-0037', subject: 'CR Sheet order confirmed', lastContact: 'May 17', lastContactMethod: 'Call', nextAction: 'Order processed', dueDate: '2024-12-14', status: 'Completed' },
  { id: 'FU-012', client: 'Lakshmi Narasimha Steels', initials: 'LN', rfqRef: '#RFQ-2024-0038', subject: 'Payment collected in full', lastContact: 'May 18', lastContactMethod: 'Visit', nextAction: 'Receipt sent', dueDate: '2024-12-13', status: 'Completed' },
];

export const revenueData = [
  { month: 'Jul', revenue: 28 },
  { month: 'Aug', revenue: 34 },
  { month: 'Sep', revenue: 22 },
  { month: 'Oct', revenue: 41 },
  { month: 'Nov', revenue: 38 },
  { month: 'Dec', revenue: 45 },
];

export const rfqStatusBreakdown = [
  { name: 'New', value: 12, color: '#6366F1' },
  { name: 'Sent', value: 15, color: '#3B82F6' },
  { name: 'Responded', value: 10, color: '#F59E0B' },
  { name: 'Converted', value: 10, color: '#10B981' },
];

export const dashboardFollowUps = [
  { client: 'Vijaya Constructions', about: 'HR Coil price revision', daysOverdue: 3 },
  { client: 'Sri Lakshmi Steels', about: 'TMT quotation pending', daysOverdue: 2 },
  { client: 'Prasad Infrastructure', about: 'CR Sheet delivery confirmation', daysOverdue: 5 },
  { client: 'Srinivasa Pipes', about: 'Angle Iron availability', daysOverdue: 1 },
  { client: 'Ravi Structures', about: 'Payment reminder — ₹1.4L pending', daysOverdue: 4 },
];

// ── Zoho Mail Integration — Dummy Emails ──

export interface IncomingEmail {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  receivedAt: string;
  isUnread: boolean;
  // Extracted data for auto-fill
  extractedClient: string;
  extractedContact: string;
  extractedMaterial: MaterialType;
  extractedQuantity: number;
  extractedRequiredBy: string;
}

export interface Quotation {
  id: string;
  client: string;
  project: string;
  items: string;
  value: string;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired';
  validUntil: string;
  assigned: string;
  created: string;
}

export const quotationData: Quotation[] = [
  { id: 'OSQ-0148', client: 'Vijaya Constructions', project: 'Kukatpally Phase 3', items: 'TMT Fe500D 20mm – 180 MT', value: '₹12.6L', status: 'Sent', validUntil: '28 May 2026', assigned: 'Adil', created: '2026-05-18' },
  { id: 'OSQ-0147', client: 'Sri Lakshmi Steels', project: 'Ruwi Commercial Tower', items: 'ISMB 200 IS2062 – 45 MT', value: '₹8.4L', status: 'Accepted', validUntil: '26 May 2026', assigned: 'Adil', created: '2026-05-16' },
  { id: 'OSQ-0146', client: 'Prasad Infrastructure', project: 'Seeb Residential Complex', items: 'MS Plates 10mm – 220 MT', value: '₹15.4L', status: 'Sent', validUntil: '25 May 2026', assigned: 'Adil', created: '2026-05-15' },
  { id: 'OSQ-0145', client: 'KVR Builders', project: 'Amaravati Phase 1', items: 'MS Angles 75x75 – 60 MT', value: '₹4.8L', status: 'Rejected', validUntil: '23 May 2026', assigned: 'Adil', created: '2026-05-13' },
  { id: 'OSQ-0144', client: 'Ravi Structures', project: 'Guntur Township', items: 'HR Coil 2mm – 95 MT', value: '₹9.1L', status: 'Accepted', validUntil: '22 May 2026', assigned: 'Adil', created: '2026-05-12' },
  { id: 'OSQ-0143', client: 'Amaravati Developers', project: 'Capital City Infra', items: 'Structural Steel – 500 MT', value: '₹44.5L', status: 'Draft', validUntil: '30 May 2026', assigned: 'Adil', created: '2026-05-11' },
  { id: 'OSQ-0142', client: 'Bharat Steel Corp', project: 'Vizag Port Project', items: 'GI Sheet 0.5mm – 75 MT', value: '₹6.2L', status: 'Expired', validUntil: '18 May 2026', assigned: 'Adil', created: '2026-05-08' },
  { id: 'OSQ-0141', client: 'Sai Krishna Infra', project: 'Hyderabad Metro Ext', items: 'CR Sheet 1mm – 130 MT', value: '₹11.7L', status: 'Accepted', validUntil: '20 May 2026', assigned: 'Adil', created: '2026-05-07' },
];

export const incomingEmails: IncomingEmail[] = [
  {
    id: 'EM-001',
    from: 'Rajesh Gupta',
    fromEmail: 'rajesh@megabuilders.in',
    subject: 'Enquiry for HR Coil — 50MT',
    preview: 'Dear Sir, We need 50 MT of HR Coil for our upcoming project in Kukatpally. Please share your best rates with delivery timeline...',
    receivedAt: '25 min ago',
    isUnread: true,
    extractedClient: 'Mega Builders Pvt Ltd',
    extractedContact: '9876012345',
    extractedMaterial: 'HR Coil',
    extractedQuantity: 50,
    extractedRequiredBy: '2025-01-10',
  },
  {
    id: 'EM-002',
    from: 'Priya Sharma',
    fromEmail: 'procurement@shantiinfra.com',
    subject: 'Request for Quotation — TMT Bars 100MT',
    preview: 'Hi Omnia Team, We require 100 MT of TMT Bars (Fe 500D grade) for our Shamshabad township project. Need delivery in 2 weeks...',
    receivedAt: '1h ago',
    isUnread: true,
    extractedClient: 'Shanti Infrastructure Ltd',
    extractedContact: '9845098765',
    extractedMaterial: 'TMT Bars',
    extractedQuantity: 100,
    extractedRequiredBy: '2025-01-05',
  },
  {
    id: 'EM-003',
    from: 'Venkat Rao',
    fromEmail: 'venkat@sristeels.co.in',
    subject: 'Urgent — CR Sheet 30MT for Vizag project',
    preview: 'Namaskar, We urgently need 30 MT of CR Sheet for our Visakhapatnam warehouse project. Please confirm availability and pricing ASAP...',
    receivedAt: '3h ago',
    isUnread: true,
    extractedClient: 'Sri Sai Steels & Alloys',
    extractedContact: '9912076543',
    extractedMaterial: 'CR Sheet',
    extractedQuantity: 30,
    extractedRequiredBy: '2024-12-28',
  },
  {
    id: 'EM-004',
    from: 'Anand Kumar',
    fromEmail: 'anand.k@nagarconstructions.in',
    subject: 'GI Sheet pricing — 75MT order',
    preview: 'Dear Omnia Steels, We are looking for competitive rates on GI Sheet (0.5mm thickness) for our ongoing government project in Warangal...',
    receivedAt: '5h ago',
    isUnread: true,
    extractedClient: 'Nagar Constructions',
    extractedContact: '9866034567',
    extractedMaterial: 'GI Sheet',
    extractedQuantity: 75,
    extractedRequiredBy: '2025-01-15',
  },
];

// ── Masters Data — Items ──

export interface Item {
  code: string;
  name: string;
  category: string;
  specification: string;
  grade: string;
  uom: string;
}

export const itemsData: Item[] = [
  { code: 'ITM-001', name: 'HR Coil 2.5mm', category: 'HR Coil', specification: '2.5mm x 1250mm', grade: 'IS 2062 E250', uom: 'MT' },
  { code: 'ITM-002', name: 'CR Sheet 1mm', category: 'CR Sheet', specification: '1.0mm x 1250mm x 2500mm', grade: 'IS 513 CRCA', uom: 'MT' },
  { code: 'ITM-003', name: 'MS Pipe 4"', category: 'MS Pipe', specification: '4" NB Med', grade: 'IS 1239', uom: 'MT' },
  { code: 'ITM-004', name: 'Angle 50x50x5', category: 'Angle Iron', specification: '50x50x5 mm', grade: 'IS 2062 E250A', uom: 'MT' },
  { code: 'ITM-005', name: 'TMT Bar 12mm', category: 'TMT Bars', specification: '12mm', grade: 'Fe 500D', uom: 'MT' },
  { code: 'ITM-006', name: 'TMT Bar 16mm', category: 'TMT Bars', specification: '16mm', grade: 'Fe 500D', uom: 'MT' },
  { code: 'ITM-007', name: 'Chequered Plate 5mm', category: 'Chequered Plate', specification: '5mm x 1250mm x 2500mm', grade: 'IS 3502', uom: 'MT' },
];
