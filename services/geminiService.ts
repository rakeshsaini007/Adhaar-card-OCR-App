
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
          text: `Analyze this Indian Aadhaar Card. Extract:
          1. Name: English name.
          2. Hindi Name: Name in Hindi script (नाम).
          3. Care of: Father/Husband name (usually C/O, S/O, W/O).
          4. DOB: DD/MM/YYYY.
          5. Gender: Male, Female, or Transgender.
          6. Aadhaar Number: 12-digit number.
          Return valid JSON only.`,
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
          careOf: { type: Type.STRING },
          dob: { type: Type.STRING },
          gender: { type: Type.STRING, enum: ["Male", "Female", "Transgender"] },
          aadhaarNumber: { type: Type.STRING },
        },
        required: ["name", "hindiName", "careOf", "dob", "gender", "aadhaarNumber"],
      },
    },
  });

  try {
    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as OCRResult;
  } catch (error) {
    console.error("OCR Error:", error);
    throw new Error("Could not extract details clearly. Use a bright, focused photo.");
  }
};
