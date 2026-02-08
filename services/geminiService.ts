
import { GoogleGenAI, Type } from "@google/genai";
import { OCRResult } from "../types.ts";

export const extractAadhaarDetails = async (base64Image: string): Promise<OCRResult> => {
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
          text: `Analyze this Indian Aadhaar Card image and extract data with maximum precision.
          
          Extraction Rules:
          1. Name: Full name in English.
          2. Hindi Name (नाम): Full name in Hindi script.
          3. Care of (C/O): Extract the father's or husband's name often preceded by C/O, S/O, W/O, or D/O.
          4. DOB: Date of Birth in DD/MM/YYYY format.
          5. Gender: 'Male', 'Female', or 'Transgender'.
          6. Aadhaar Number: The 12-digit number (XXXX XXXX XXXX).
          
          Return only a valid JSON object.`,
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          hindiName: { type: Type.STRING },
          careOf: { type: Type.STRING, description: "Father/Husband name (C/O)" },
          dob: { type: Type.STRING },
          gender: { 
            type: Type.STRING, 
            enum: ["Male", "Female", "Transgender"] 
          },
          aadhaarNumber: { type: Type.STRING },
        },
        required: ["name", "hindiName", "careOf", "dob", "gender", "aadhaarNumber"],
      },
    },
  });

  try {
    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const result = JSON.parse(text) as OCRResult;
    
    // Normalization logic
    if (result.gender) {
      const g = result.gender.trim().toLowerCase();
      if (g.includes('female') || g.includes('महिला')) result.gender = 'Female';
      else if (g.includes('male') || g.includes('पुरुष')) result.gender = 'Male';
      else if (g.includes('trans')) result.gender = 'Transgender';
      else result.gender = 'Male';
    }

    return result;
  } catch (error) {
    console.error("OCR Parse Error:", error);
    throw new Error("Could not extract details clearly. Please ensure the photo is bright and clear.");
  }
};
