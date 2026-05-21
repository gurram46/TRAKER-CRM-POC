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
* RHS/SHS/PIPES: "RHS 240X120X8 YST310 - 2.9mt" -> "240x120x8mm -3mt"
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
