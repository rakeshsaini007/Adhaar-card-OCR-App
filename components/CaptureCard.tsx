
import React, { useRef, useState } from 'react';
import { Upload, Camera, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { extractAadhaarDetails } from '../services/geminiService';
import { OCRResult } from '../types';

interface CaptureCardProps {
  onCaptured: (image: string, data: OCRResult) => void;
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
  setError: (err: string | null) => void;
  error: string | null;
}

export const CaptureCard: React.FC<CaptureCardProps> = ({ 
  onCaptured, 
  setIsLoading, 
  isLoading, 
  setError, 
  error 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const processImage = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setPreview(base64);
      try {
        const data = await extractAadhaarDetails(base64);
        onCaptured(base64, data);
      } catch (err: any) {
        setError(err.message || "An error occurred during extraction");
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-8 text-center border-b border-slate-50">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Capture Aadhaar Card</h2>
        <p className="text-slate-500">Upload a clear photo of the front of the Aadhaar card for AI extraction.</p>
      </div>

      <div className="p-8">
        {!isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-4 p-10 border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all group"
            >
              <div className="bg-blue-100 text-blue-600 p-4 rounded-full group-hover:scale-110 transition-transform">
                <Upload size={32} />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Upload Photo</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 10MB</p>
              </div>
            </button>

            <button 
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.setAttribute('capture', 'environment');
                  fileInputRef.current.click();
                }
              }}
              className="flex flex-col items-center justify-center gap-4 p-10 border-2 border-dashed border-slate-200 rounded-xl hover:border-emerald-400 hover:bg-emerald-50 transition-all group"
            >
              <div className="bg-emerald-100 text-emerald-600 p-4 rounded-full group-hover:scale-110 transition-transform">
                <Camera size={32} />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Use Camera</p>
                <p className="text-xs text-slate-500 mt-1">Take a live photo</p>
              </div>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <div className="text-center">
              <p className="font-semibold text-slate-800 text-lg">AI Extracting Details...</p>
              <p className="text-slate-500 max-w-xs mx-auto">Gemini is reading the card data. This usually takes a few seconds.</p>
            </div>
            {preview && (
              <div className="mt-6 border rounded-lg p-2 bg-slate-50">
                <img src={preview} alt="Preview" className="h-32 rounded-md opacity-50 grayscale" />
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-6 flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
            <AlertCircle className="shrink-0" size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
        />
      </div>

      <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center gap-4">
        <div className="flex -space-x-2">
           {[1,2,3].map(i => (
             <img key={i} src={`https://picsum.photos/seed/${i}/40`} className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
           ))}
        </div>
        <p className="text-xs text-slate-500 font-medium italic">
          Join 2,400+ users processing documents securely.
        </p>
      </div>
    </div>
  );
};
