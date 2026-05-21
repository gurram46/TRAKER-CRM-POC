import { GoogleGenerativeAI } from '@google/generative-ai';
import { ExtractedEmailData } from '../types';

export const extractRFQFromEmail = async (emailContent: string): Promise<ExtractedEmailData> => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
  
  const prompt = `You are a data extraction assistant for a steel trading company in India. Extract ALL information from this email and return ONLY a valid JSON object with no markdown, no backticks:
{
  "client_name": "company or person name",
  "contact_number": "phone if found else empty string",
  "company": "company name",
  "delivery_location": "delivery address or city",
  "items": [
    {
      "material_type": "material name and description",
      "quantity_mt": 0,
      "specification": "grade/spec if mentioned",
      "remarks": "any special requirements"
    }
  ],
  "required_by": "YYYY-MM-DD or empty string",
  "special_requirements": "any other notes"
}
Extract ALL line items from tables. Email content: ${emailContent}`;
  
  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  console.log("Raw Gemini Response:", responseText);
  
  try {
    return JSON.parse(responseText.trim()) as ExtractedEmailData;
  } catch (error) {
    console.error("Failed to parse Gemini response as JSON:", responseText);
    throw new Error("Invalid JSON response from Gemini");
  }
};
