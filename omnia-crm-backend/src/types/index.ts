export interface RFQ {
  id?: number;
  rfq_number: string;
  client_name: string;
  company?: string;
  delivery_location?: string;
  contact_number: string;
  items: any[];
  required_by: Date;
  special_requirements?: string;
  status: string;
  source: string;
  raw_email?: string;
  created_at?: Date;
}

export interface ExtractedEmailData {
  client_name: string;
  contact_number: string;
  company: string;
  delivery_location: string;
  project_name?: string;
  items: {
    material_type: string;
    original_description?: string;
    grade?: string;
    quantity_mt: number;
    specification: string;
    remarks: string;
    uom?: string;
  }[];
  required_by: string;
  special_requirements: string;
  payment_terms?: string;
  delivery_terms?: string;
}
