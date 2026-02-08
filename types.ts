
export interface AadhaarData {
  id: string;
  name: string;
  hindiName: string;
  careOf: string;
  dob: string;
  gender: string;
  aadhaarNumber: string;
  photoUrl: string;
}

export interface OCRResult {
  name: string;
  hindiName: string;
  careOf: string;
  dob: string;
  gender: string;
  aadhaarNumber: string;
}

export type AppStep = 'UPLOAD' | 'VERIFY' | 'HISTORY';
