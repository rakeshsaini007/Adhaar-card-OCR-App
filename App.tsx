
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout.tsx';
import { CaptureCard } from './components/CaptureCard.tsx';
import { DataVerification } from './components/DataVerification.tsx';
import { RecordsTable } from './components/RecordsTable.tsx';
import { AppStep, AadhaarData, OCRResult } from './types.ts';
import { saveToGoogleSheets } from './services/sheetService.ts';

const STORAGE_KEY = 'aadhaar_records_v1';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('UPLOAD');
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [ocrData, setOcrData] = useState<OCRResult | null>(null);
  const [records, setRecords] = useState<AadhaarData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setRecords(JSON.parse(saved));
    }
  }, []);

  const saveRecordsLocal = (newRecords: AadhaarData[]) => {
    setRecords(newRecords);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecords));
  };

  const handleCapture = (imageData: string, data: OCRResult) => {
    setCurrentImage(imageData);
    setOcrData(data);
    setStep('VERIFY');
    setError(null);
  };

  const handleConfirm = async (finalData: OCRResult) => {
    setIsSyncing(true);
    setError(null);

    const newRecord: AadhaarData = {
      ...finalData,
      photoUrl: currentImage!,
      timestamp: new Date().toISOString(),
    };
    
    try {
      await saveToGoogleSheets(newRecord);
      saveRecordsLocal([newRecord, ...records]);
      setStep('HISTORY');
      setCurrentImage(null);
      setOcrData(null);
    } catch (err: any) {
      setError("Sync failed: " + err.message + ". Record saved locally.");
      saveRecordsLocal([newRecord, ...records]);
      setStep('HISTORY');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDelete = (timestamp: string) => {
    const filtered = records.filter(r => r.timestamp !== timestamp);
    saveRecordsLocal(filtered);
  };

  return (
    <Layout currentStep={step} onNavigate={setStep}>
      <div className="max-w-4xl mx-auto py-8 px-4">
        {step === 'UPLOAD' && (
          <CaptureCard 
            onCaptured={handleCapture} 
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            setError={setError}
            error={error}
          />
        )}

        {step === 'VERIFY' && ocrData && currentImage && (
          <DataVerification 
            initialData={ocrData}
            image={currentImage}
            onConfirm={handleConfirm}
            onCancel={() => setStep('UPLOAD')}
            isSaving={isSyncing}
          />
        )}

        {step === 'HISTORY' && (
          <RecordsTable 
            records={records} 
            onDelete={handleDelete}
            onAdd={() => setStep('UPLOAD')}
          />
        )}
      </div>
    </Layout>
  );
};

export default App;
