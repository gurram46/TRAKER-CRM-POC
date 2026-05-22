import { GoogleGenerativeAI } from '@google/generative-ai';
import { ExtractedEmailData } from '../types';

export const extractRFQFromEmail = async (emailContent: string): Promise<ExtractedEmailData> => {
  const prompt = `You are an expert steel procurement assistant for an Indian steel trading company.

Your job is to parse raw RFQ/procurement emails and convert them into structured JSON for quotation generation.

CLASSIFY RFQ TYPE:
Analyze the text and classify "rfq_type" into exactly one of these:
* "Simple RFQ" - Basic list of materials
* "Enterprise Techno-Commercial RFQ" - Contains complex T&C, approved makes lists, GST/freight scopes (e.g. L&T SUFIN formats)
* "Rail/Inspection RFQ" - Focuses on Rails, MTC, RITES inspection, yield strength

MATERIAL NORMALIZATION RULES (STRICT):
You MUST normalize material descriptions into these exact shorthand formats.
Always round the MT quantity to the nearest higher whole number (e.g. 1.3mt -> 2mt, 12.6mt -> 13mt, 124.07 -> 125mt) EXCEPT for Rails where you preserve exact metric tons.

* PLATES: "MS PLATE 12mm width 2.5mtr lenth 6.3mtr -1.480 mt" -> "P12mm, 2500x6300 -2mt"
* ANGLES: "MS Angle 50x50x6mm -6.3mt" -> "A50x6 -7mt"
* BEAMS: "MS Beam or ISMB 250x125x6mm -8.9mt" -> "B250 -9mt"
* CHANNELS: "MS Channel or ISMc 100x50x5mm -19.2mt" -> "C100 -20mt"
* FLATS: "MS Flat 100x6mm -1.2mt" -> "F100x6 -2mt"
* RHS/SHS/PIPES: "MS HOLLOW SECTION; SUB-TYPE :- Square hollow section; ... SIDE 1 :- 32 mm; SIDE 2 :- 32 mm; THICKNESS :- 3.2 mm" -> "32x32x3.2mm -[qty]mt"
* RHS/SHS/PIPES (Rectangular): "SUB-TYPE :- Rectangular hollow section; ... SIDE 1 :- 80 mm; SIDE 2 :- 40 mm; THICKNESS :- 4.8 mm" -> "80x40x4.8mm -[qty]mt"
* ROUND BARS: "MS Round Bar 12mm -35.2mt" -> "Round 12mm -36mt"
* SQUARE BARS: "MS Square Bar 12x12mm -5.8mt" -> "Sq 12x12 -6mt"
* BINDING WIRE (MS): "Binding wire 16/18/20SWG" -> "MS Binding Wire 16G/18G/202G -[qty]mt"
* BINDING WIRE (GI): If GSM is given (e.g. 20-30 GSM), mention it: "GI Binding Wire 16G/18G/202G, 20-30 GSM -[qty]mt"
* RAILS: "RAIL; SUB-TYPE :- Industrial Use (IU) Rail; GRADE :- 880" -> "Rail 880 IU - [qty]mt"

GRADE NORMALIZATION:
Always mention grade. If it's standard E250, use "E250". If E350 is given, use E350A/BR etc.

EXTRACTION GOALS:
1. Extract buyer, company, and contact details.
2. Detect project name and delivery location.
3. Extract and normalize all material line items.
4. Extract "approved_makes" (e.g. Surya pipes, HI Tech pipes, JSW, Tata, SAIL, VMC, APL Apollo).
5. Extract "certifications" (e.g. MTC, RITES inspection).
6. Extract "payment_terms" and "delivery_terms".
7. Assign a "confidence_score" (0-100) based on how well you understood the email.

BUYER / COMPANY RULES:
* Do NOT blindly use procurement platform or template names as the buyer company.
* If text says "Greeting From L&T SUFIN" or uses an L&T SuFin techno-commercial format, treat "L&T SuFin" as the sourcing portal/template unless the email explicitly says L&T SuFin is the buyer.
* Prefer the actual project/customer from the subject/body, e.g. "CMRL Project in Chennai", over portal names.
* If the only reliable business context is a project, set "company" to that project/customer name and keep the contact person from the body.
* If the sender is forwarding a requirement and the body has "Vendor Name:" blank, do not invent the vendor as the buyer.

OUTPUT RULES:
* Return ONLY valid JSON
* No markdown, no explanation, no extra text
* Empty arrays should be []
* Empty strings should be ""
* Missing numeric values use 0.0

OUTPUT FORMAT:
{
  "rfq_type": "Simple RFQ | Enterprise Techno-Commercial RFQ | Rail/Inspection RFQ",
  "confidence_score": 95,
  "client_name": "person name from signature or text",
  "company": "company name",
  "contact_number": "phone number",
  "delivery_location": "delivery city or address",
  "required_by": "YYYY-MM-DD or empty string",
  "project_name": "project name if mentioned",
  "items": [
    {
      "material_type": "STRICTLY NORMALIZED SHORTHAND (e.g. P12mm, 2500x6300 -2mt)",
      "original_description": "original text from email",
      "grade": "steel grade (e.g. E250)",
      "specification": "dimensions or IS standard",
      "quantity_mt": 2,
      "uom": "MT",
      "remarks": "special requirements per item"
    }
  ],
  "special_requirements": "combined special requirements",
  "approved_makes": ["JSW", "Tata", "SAIL"],
  "certifications": ["MTC", "RITES"],
  "payment_terms": "extracted payment terms",
  "delivery_terms": "extracted delivery terms"
}

INPUT EMAIL:
${emailContent}`;

  const callGemini = async (apiKey: string) => {
    if (!apiKey) {
      throw new Error("Gemini API key is not configured");
    }

    const modelName = process.env.GEMINI_MODEL || "gemini-3.5-flash";
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });
    console.log(`Calling Gemini model: ${modelName}`);
    const result = await model.generateContent(prompt);
    return result.response.text();
  };

  let responseText = "";
  try {
    responseText = await callGemini(process.env.GEMINI_API_KEY || '');
  } catch (err: any) {
    const shouldTryFallback =
      err.status === 403 ||
      err.status === 429 ||
      err.message?.includes('403') ||
      err.message?.includes('429') ||
      err.message?.includes('reported as leaked') ||
      err.message?.includes('Too Many Requests');

    if (shouldTryFallback && process.env.GEMINI_FALLBACK_API_KEY) {
      console.log("Primary Gemini API key failed, using fallback key...");
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
