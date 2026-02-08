
import { GoogleGenAI, Type } from "@google/genai";
import { OCRResult } from "../types.ts";

export const extractAadhaarDetails = async (base64Image: string): Promise<OCRResult> => {
  // Always initialize with the named parameter apiKey from process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const base64Data = base64Image.split(',')[1] || base64Image;

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
          text: `Analyze this Indian Aadhaar Card image and extract data with high precision. 
          Focus on identifying both the English name and the name written in Hindi script.
          
          Extraction Rules:
          1. Name: Full name in English characters.
          2. Hindi Name (नाम): Full name written in Hindi script. This is usually located above or next to the English name.
          3. DOB: Date of Birth in DD/MM/YYYY format.
          4. Gender: Identify the gender label (e.g., 'Male / पुरुष' or 'Female / महिला'). 
             - If you see 'Male' or 'पुरुष', return 'Male'.
             - If you see 'Female' or 'महिला', return 'Female'.
             - If it is 'Transgender', return 'Transgender'.
          5. Aadhaar Number: The 12-digit number formatted as XXXX XXXX XXXX.
          
          Return only a valid JSON object.`,
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
            description: "Full name in English.",
          },
          hindiName: {
            type: Type.STRING,
            description: "Full name in Hindi (नाम).",
          },
          dob: {
            type: Type.STRING,
            description: "Date of birth (DD/MM/YYYY).",
          },
          gender: {
            type: Type.STRING,
            description: "Strictly 'Male', 'Female', or 'Transgender'.",
            enum: ["Male", "Female", "Transgender"],
          },
          aadhaarNumber: {
            type: Type.STRING,
            description: "12-digit number with spaces.",
          },
        },
        required: ["name", "hindiName", "dob", "gender", "aadhaarNumber"],
      },
    },
  });

  try {
    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const result = JSON.parse(text) as OCRResult;
    
    // Safety Normalization Layer for Gender
    if (result.gender) {
      const g = result.gender.trim().toLowerCase();
      if (g.includes('female') || g.includes('महिला') || g === 'f') {
        result.gender = 'Female';
      } else if (g.includes('male') || g.includes('पुरुष') || g === 'm') {
        result.gender = 'Male';
      } else if (g.includes('trans')) {
        result.gender = 'Transgender';
      } else {
        result.gender = 'Male'; // Default fallback
      }
    }

    return result;
  } catch (error) {
    console.error("OCR Parse Error:", error);
    throw new Error("Could not extract details. Please ensure the card is well-lit and the text is clearly visible.");
  }
};
