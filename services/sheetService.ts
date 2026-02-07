
import { AadhaarData } from "../types";

/**
 * IMPORTANT: Replace this with your actual Google Apps Script Deployment URL
 * Example: https://script.google.com/macros/s/AKfyc.../exec
 */
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz7YlCxd700k0trpveN-P5VKx365RYFKRn8YBpI1jGcUMMOGxvwTJAIapJC0_2FHqh_/exec';

export const saveToGoogleSheets = async (data: AadhaarData): Promise<boolean> => {
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'PASTE_YOUR_DEPLOYED_SCRIPT_URL_HERE') {
    console.warn("Google Script URL not configured. Data saved locally only.");
    return false;
  }

  try {
    // We use 'no-cors' mode because Google Apps Script redirects (302) 
    // which can be tricky with standard CORS in simple web apps.
    // If you need to read the response, you might need a proxy or different GAS settings.
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // standard for GAS web app triggers
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
