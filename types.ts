
export interface AadhaarData {
  id: string;
  name: string;
  dob: string;
  aadhaarNumber: string;
  photoUrl: string;
  timestamp: string;
}

export interface OCRResult {
  name: string;
  dob: string;
  aadhaarNumber: string;
}

export type AppStep = 'UPLOAD' | 'VERIFY' | 'HISTORY';
