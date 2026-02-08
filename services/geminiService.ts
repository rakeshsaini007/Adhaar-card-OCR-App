
import { GoogleGenAI, Type } from "@google/genai";
import { OCRResult } from "../types.ts";

export const extractAadhaarDetails = async (base64Image: string): Promise<OCRResult> => {
  // Always initialize with the named parameter apiKey from process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const base64Data = base64Image.split(',')[1] || base64Image;

  // Use a targeted prompt that guides the model through bilingual patterns commonly found on Aadhaar cards.
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Data,
          },
        },
        {
          text: "Analyze this Indian Aadhaar Card image and extract the following details precisely:\n\n1. Name: Full name in English characters.\n2. Date of Birth (DOB): In DD/MM/YYYY format.\n3. Gender: Look for the label. It often appears as 'Male / पुरुष' or 'Female / महिला'. Extract strictly as 'Male', 'Female', or 'Transgender'.\n4. Aadhaar Number: The 12-digit number (usually formatted as XXXX XXXX XXXX).\n\nReturn only a valid JSON object matching the schema.",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "Person's full name.",
          },
          dob: {
            type: Type.STRING,
            description: "Date of Birth (format: DD/MM/YYYY).",
          },
          gender: {
            type: Type.STRING,
            description: "Gender: Must be 'Male', 'Female', or 'Transgender'. If it says 'Male / पुरुष', use 'Male'.",
          },
          aadhaarNumber: {
            type: Type.STRING,
            description: "12-digit Aadhaar number with spaces.",
          },
        },
        required: ["name", "dob", "gender", "aadhaarNumber"],
      },
    },
  });

  try {
    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const result = JSON.parse(text) as OCRResult;
    
    // Normalization logic: Ensures the extracted string matches the exact case and value 
    // expected by the React state and the <select> component.
    if (result.gender) {
      const g = result.gender.trim().toLowerCase();
      if (g.includes('female') || g === 'f' || g.includes('महिला')) {
        result.gender = 'Female';
      } else if (g.includes('male') || g === 'm' || g.includes('पुरुष')) {
        result.gender = 'Male';
      } else if (g.includes('trans')) {
        result.gender = 'Transgender';
      } else {
        // Fallback to Male if unsure, as it's the first option in the select dropdown
        result.gender = 'Male';
      }
    } else {
      result.gender = 'Male';
    }

    return result;
  } catch (error) {
    console.error("Failed to parse AI response", error);
    throw new Error("AI could not reliably identify the gender or other details. Please try a clearer, brighter photo.");
  }
};
