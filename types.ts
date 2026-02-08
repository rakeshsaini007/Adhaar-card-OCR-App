
export interface AadhaarData {
  name: string;
  hindiName: string;
  dob: string;
  gender: string;
  aadhaarNumber: string;
  photoUrl: string;
  timestamp: string;
}

export interface OCRResult {
  name: string;
  hindiName: string;
  dob: string;
  gender: string;
  aadhaarNumber: string;
}

export type AppStep = 'UPLOAD' | 'VERIFY' | 'HISTORY';
