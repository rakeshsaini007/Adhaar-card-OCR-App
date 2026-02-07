
import { GoogleGenAI, Type } from "@google/genai";
import { OCRResult } from "../types.ts";

export const extractAadhaarDetails = async (base64Image: string): Promise<OCRResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const base64Data = base64Image.split(',')[1] || base64Image;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data,
            },
          },
          {
            text: "Analyze this image of an Indian Aadhaar Card. Extract the Full Name, Date of Birth (DOB), and the 12-digit Aadhaar Number. Return the result in a clean JSON format.",
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "The full name of the person as written on the card.",
          },
          dob: {
            type: Type.STRING,
            description: "The date of birth in DD/MM/YYYY format.",
          },
          aadhaarNumber: {
            type: Type.STRING,
            description: "The 12-digit Aadhaar number, formatted as XXXX XXXX XXXX if possible.",
          },
        },
        required: ["name", "dob", "aadhaarNumber"],
      },
    },
  });

  try {
    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as OCRResult;
  } catch (error) {
    console.error("Failed to parse AI response", error);
    throw new Error("Could not extract details accurately. Please try a clearer photo.");
  }
};
