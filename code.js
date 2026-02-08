
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["ID", "Name", "नाम", "Care of", "DOB", "Gender", "Aadhaar Number", "Photo (Base64)"]);
      sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#f3f4f6");
    }
    
    sheet.appendRow([
      data.id,
      data.name,
      data.hindiName,
      data.careOf,
      data.dob,
      data.gender,
      data.aadhaarNumber,
      data.photoUrl
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput("Aadhaar OCR Backend is Running!");
}
