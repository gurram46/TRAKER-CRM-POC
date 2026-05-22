import { GoogleGenerativeAI } from '@google/generative-ai';
import { ExtractedEmailData } from '../types';

const appendUnique = (values: string[] = [], value: string) => {
  if (!value) return values || [];
  return values.some((existing) => existing.toLowerCase() === value.toLowerCase())
    ? values
    : [...values, value];
};

const cleanDashSpacing = (value: string) => value.replace(/\s+/g, ' ').trim();

const applyDeterministicRFQCleanup = (data: ExtractedEmailData, emailContent: string): ExtractedEmailData => {
  const cleaned: ExtractedEmailData = {
    ...data,
    items: data.items || [],
    approved_makes: data.approved_makes || [],
    certifications: data.certifications || [],
  };

  const siteMatch = emailContent.match(/(?:site\s+at|for\s+our\s+site\s+at)\s+([^.\n\r]+?project)/i);
  if (siteMatch) {
    const projectSite = cleanDashSpacing(siteMatch[1]);
    if (!cleaned.delivery_location || /not specified/i.test(cleaned.delivery_location)) {
      cleaned.delivery_location = projectSite;
    }
    if (!cleaned.project_name) {
      cleaned.project_name = projectSite;
    }
  }

  const mobileMatch = emailContent.match(/\b(?:mobile|mob|phone|contact)\s*[:\-]?\s*(\+?\d[\d\s-]{8,14}\d)/i);
  if (mobileMatch && !cleaned.contact_number) {
    cleaned.contact_number = mobileMatch[1].replace(/[^\d+]/g, '');
  }

  const signatureMatch = emailContent.match(/(?:thanks|regards)[,\s]+([A-Z][A-Za-z .]+?)\s+([A-Z][A-Za-z .&]+?(?:Construction|Constructions|Limited|Ltd|Pvt Ltd|Infra|Projects))/i);
  if (signatureMatch) {
    if (!cleaned.client_name) {
      cleaned.client_name = cleanDashSpacing(signatureMatch[1]);
    }
    if (!cleaned.company || /unknown|not specified/i.test(cleaned.company)) {
      cleaned.company = cleanDashSpacing(signatureMatch[2]);
    }
  }

  if (/primary\s+make\s+preferred/i.test(emailContent)) {
    cleaned.approved_makes = appendUnique(cleaned.approved_makes, 'Primary make preferred');
  }

  if (/gst\s+bill\s+required/i.test(emailContent)) {
    cleaned.special_requirements = cleanDashSpacing(
      `${cleaned.special_requirements || ''} GST bill required.`.trim()
    );
    cleaned.certifications = cleaned.certifications.filter((cert) => !/gst|standard/i.test(cert));
  }

  if (/need\s+within\s+2\s+days|within\s+2\s+days/i.test(emailContent) && !cleaned.delivery_terms) {
    cleaned.delivery_terms = 'Need within 2 days';
  }

  return cleaned;
};

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
* BINDING WIRE (MS): "Binding wire 16/18/20SWG" -> "MS Binding Wire 16G/18G/20G -[qty]mt"
* BINDING WIRE (GI): If GSM is given (e.g. 20-30 GSM), mention it: "GI Binding Wire 16G/18G/20G, 20-30 GSM -[qty]mt"
* RAILS: "RAIL; SUB-TYPE :- Industrial Use (IU) Rail; GRADE :- 880" -> "Rail 880 IU - [qty]mt"

GRADE NORMALIZATION:
Always mention grade. If it's standard E250, use "E250". If E350 is given, use E350A/BR etc.
If the email does NOT mention a grade, leave grade empty instead of inventing E250.

COMPACT NUMBERED RFQ RULES:
Emails may contain lines like "1. MS Angle 50x50x5mm - 6 MTR - 8 MT".
For those lines:
* Treat the final MT value as quantity_mt.
* Treat "6 MTR", "9-12 MTR", dimensions, width, thickness, or length as specification.
* Do not copy quantity into specification.
* If the email says "site at <project> project", put that full phrase in delivery_location and project_name.
* "Primary make preferred" is an approved make note, not a certification.
* "GST bill required" is a special requirement, not a certification.

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
    const parsed = JSON.parse(responseText.trim()) as ExtractedEmailData;
    return applyDeterministicRFQCleanup(parsed, emailContent);
  } catch (error) {
    console.error("Failed to parse Gemini response as JSON:", responseText);
    throw new Error("Invalid JSON response from Gemini");
  }
};
