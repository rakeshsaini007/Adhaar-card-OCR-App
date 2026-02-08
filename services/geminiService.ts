
import { GoogleGenAI, Type } from "@google/genai";
import { OCRResult } from "../types.ts";

export const extractAadhaarDetails = async (base64Image: string): Promise<OCRResult> => {
  // Always initialize with the named parameter apiKey from process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const base64Data = base64Image.split(',')[1] || base64Image;

  // Use the recommended contents object structure (instead of array) for generating content.
  // Using 'gemini-3-flash-preview' for the OCR task.
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
          text: "Analyze this image of an Indian Aadhaar Card. Extract the Full Name, Date of Birth (DOB), Gender (usually Male/Female/Transgender), and the 12-digit Aadhaar Number. Return the result in a clean JSON format.",
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
            description: "The full name of the person as written on the card.",
          },
          dob: {
            type: Type.STRING,
            description: "The date of birth in DD/MM/YYYY format.",
          },
          gender: {
            type: Type.STRING,
            description: "The gender of the person (Male, Female, or Transgender).",
          },
          aadhaarNumber: {
            type: Type.STRING,
            description: "The 12-digit Aadhaar number, formatted as XXXX XXXX XXXX if possible.",
          },
        },
        required: ["name", "dob", "gender", "aadhaarNumber"],
        propertyOrdering: ["name", "dob", "gender", "aadhaarNumber"],
      },
    },
  });

  try {
    // Access the .text property directly (not as a method)
    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as OCRResult;
  } catch (error) {
    console.error("Failed to parse AI response", error);
    throw new Error("Could not extract details accurately. Please try a clearer photo.");
  }
};
