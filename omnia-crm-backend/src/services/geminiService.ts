import { GoogleGenerativeAI } from '@google/generative-ai';
import { ExtractedEmailData } from '../types';

export const extractRFQFromEmail = async (emailContent: string): Promise<ExtractedEmailData> => {
  const prompt = `You are an expert steel procurement assistant for an Indian steel trading company.

Your job is to parse raw RFQ/procurement emails and convert them into structured JSON for quotation generation.

SUPPORTED RFQ TYPES:
* Simple RFQ emails
* Enterprise procurement templates
* HTML table emails
* Semi-structured procurement mails
* Plain text procurement requests

CORE TASKS:
1. Extract buyer/company/contact details
2. Detect project name
3. Detect delivery location
4. Extract all material line items
5. Normalize steel material names
6. Detect grades/specifications
7. Detect special compliance requirements
8. Detect payment/delivery terms
9. Return clean structured JSON

MATERIAL NORMALIZATION RULES:

PLATES:
* MS Plate / MS Chequered Plate
* Output format: "P[thickness]mm - [qty]mt"
Examples:
* MS Plate 12mm → P12mm - 6mt
* MS Chequered Plate 6mm → P6mm - 95mt

ANGLES:
* MS Angle / ISA
* Output format: "A[size]x[thickness] - [qty]mt"
Examples:
* ISA 70x70x6 → A70x6 - 35mt
* Angle 50x50x6 → A50x6 - 20mt

BEAMS:
* ISMB / MS Beam / UB
* Output format: "B[size] - [qty]mt"
Examples:
* ISMB 250 → B250 - 9mt

CHANNELS:
* ISMC / MS Channel
* Output format: "C[size] - [qty]mt"
Examples:
* ISMC 100 → C100 - 5mt

FLATS:
* MS Flat
* Output format: "F[width]x[thickness] - [qty]mt"
Examples:
* Flat 100x6 → F100x6 - 2mt

HOLLOW SECTIONS:
* RHS / SHS / Hollow Section / Pipe
* Output format: "[dimensions]mm - [qty]mt"
Examples:
* RHS 240x120x8 → 240x120x8mm - 3mt
* SHS 100x100x6 → 100x100x6mm - 2mt

ROUND BAR:
* Output format: "Round [dia]mm - [qty]mt"
Examples:
* Round Bar 12mm → Round 12mm - 5mt

TMT:
* Output format: "TMT [dia]mm [grade] - [qty]mt"
Examples:
* TMT 16mm Fe500D → TMT 16mm Fe500D - 12mt

RAILS:
* Output format: "Rail [grade] [section] - [qty]mt"
Examples:
* Industrial Use Rail 880 → Rail 880 IU - 299mt

GI / BINDING WIRE:
* Output format: "GI Wire [gsm/gauge] - [qty]mt"
Examples:
* GI Binding Wire 16G 40GSM → GI Wire 16G 40GSM - 1mt

GRADE DETECTION:
Detect and normalize:
* E250
* E250A
* E250BR
* E350
* YST310
* Fe500
* Fe500D
* IS2062
* IS1786

IMPORTANT PROCESSING RULES:
* Convert quantities into decimal MT values
* Preserve original description separately
* Detect IS standards/specifications
* Detect certifications:
  * MTC
  * RITES
  * NABL
  * Third-party inspection
* Detect delivery terms:
  * FOR Site
  * Ex-Works
  * Delivered
* Detect payment terms
* Detect lead times
* Detect urgency
* Detect project/location names
* Detect approved makes/brands
* Preserve buyer notes in remarks
* Remove duplicate spaces/symbols
* Normalize dimensions consistently

SPECIAL REQUIREMENTS DETECTION:
Extract separately:
* MTC mandatory
* RITES inspection mandatory
* Approved make only
* Primary material only
* GST requirements
* MSME requirements
* ESG requirements
* ABMS compliance
* Vendor registration requirements

OUTPUT RULES:
* Return ONLY valid JSON
* No markdown
* No explanation
* No extra text
* Empty values must use ""
* Missing numeric values use 0.0
* Always return valid parsable JSON

OUTPUT FORMAT:
{
  "client_name": "person name from signature",
  "company": "company name",
  "contact_number": "phone number",
  "delivery_location": "delivery city or address",
  "required_by": "YYYY-MM-DD or empty string",
  "project_name": "project name if mentioned",
  "items": [
    {
      "material_type": "normalized material name",
      "original_description": "original text from email",
      "grade": "steel grade",
      "specification": "IS standard or dimensions",
      "quantity_mt": 0.0,
      "uom": "MT",
      "remarks": "special requirements/certifications"
    }
  ],
  "special_requirements": "combined special requirements",
  "payment_terms": "payment terms if mentioned",
  "delivery_terms": "FOR site, ex-works etc"
}

INPUT EMAIL:
\${emailContent}`;

  const callGemini = async (apiKey: string) => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  };

  let responseText = "";
  try {
    responseText = await callGemini(process.env.GEMINI_API_KEY || '');
  } catch (err: any) {
    if (err.status === 429 || err.message?.includes('429') || err.message?.includes('Too Many Requests')) {
      console.log("Primary Gemini API key rate limited, using fallback...");
      responseText = await callGemini(process.env.GEMINI_FALLBACK_API_KEY || '');
    } else {
      throw err;
    }
  }
  
  console.log("Raw Gemini Response:", responseText);
  
  try {
    return JSON.parse(responseText.trim()) as ExtractedEmailData;
  } catch (error) {
    console.error("Failed to parse Gemini response as JSON:", responseText);
    throw new Error("Invalid JSON response from Gemini");
  }
};
