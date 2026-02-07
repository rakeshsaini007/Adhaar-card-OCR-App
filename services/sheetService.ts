
import { AadhaarData } from "../types.ts";

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz7YlCxd700k0trpveN-P5VKx365RYFKRn8YBpI1jGcUMMOGxvwTJAIapJC0_2FHqh_/exec';

export const saveToGoogleSheets = async (data: AadhaarData): Promise<boolean> => {
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('PASTE_YOUR_DEPLOYED')) {
    console.warn("Google Script URL not configured. Data saved locally only.");
    return false;
  }

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return true;
  } catch (error) {
    console.error("Failed to sync with Google Sheets:", error);
    throw new Error("Cloud sync failed. Please check your Script URL.");
  }
};
