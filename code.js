
/**
 * GOOGLE APPS SCRIPT SETUP:
 * 1. Open a Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Paste this code.
 * 4. Click 'Deploy' > 'New Deployment'.
 * 5. Select 'Web App'.
 * 6. Set 'Execute as' to 'Me'.
 * 7. Set 'Who has access' to 'Anyone'.
 * 8. Copy the Web App URL and paste it into 'services/sheetService.ts' in your React app.
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Create headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["ID", "Name", "DOB", "Aadhaar Number", "Photo (Base64)", "Timestamp"]);
      sheet.getRange(1, 1, 1, 6).setFontWeight("bold").setBackground("#f3f4f6");
    }
    
    // Append the record
    // Note: Google Sheets has a limit of 50,000 characters per cell. 
    // High-res base64 images might be truncated if they exceed this.
    sheet.appendRow([
      data.id,
      data.name,
      data.dob,
      data.aadhaarNumber,
      data.photoUrl,
      data.timestamp
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "result": "success", "row": sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Handle GET requests to check connectivity
function doGet() {
  return ContentService.createTextOutput("Aadhaar OCR Backend is Running!")
    .setMimeType(ContentService.MimeType.TEXT);
}
