
import React, { useState } from 'react';
import { OCRResult } from '../types';
import { Check, X, User, Calendar, Hash, Save, Loader2 } from 'lucide-react';

interface DataVerificationProps {
  initialData: OCRResult;
  image: string;
  onConfirm: (data: OCRResult) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export const DataVerification: React.FC<DataVerificationProps> = ({ 
  initialData, 
  image, 
  onConfirm, 
  onCancel,
  isSaving = false
}) => {
  const [formData, setFormData] = useState<OCRResult>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
      <div className="flex flex-col lg:flex-row">
        {/* Card Preview */}
        <div className="lg:w-1/2 p-6 bg-slate-900 flex flex-col items-center justify-center min-h-[300px]">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Verification Image</h3>
          <div className="relative group">
            <img 
              src={image} 
              alt="Aadhaar Card" 
              className="max-w-full h-auto rounded-xl shadow-2xl border border-slate-700"
            />
            <div className="absolute inset-0 bg-blue-600/10 rounded-xl pointer-events-none border-2 border-blue-500/30"></div>
          </div>
          <p className="text-slate-500 text-xs mt-4">Please verify the text against the image above.</p>
        </div>

        {/* Form Details */}
        <div className="lg:w-1/2 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Verify Extraction</h2>
            <p className="text-slate-500 text-sm">Review and edit the AI-extracted details if necessary.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 text-slate-400">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSaving}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-800 font-medium disabled:opacity-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 text-slate-400">Date of Birth</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Calendar size={18} />
                  </div>
                  <input 
                    type="text"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    disabled={isSaving}
                    placeholder="DD/MM/YYYY"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-800 font-medium disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 text-slate-400">Aadhaar Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Hash size={18} />
                  </div>
                  <input 
                    type="text"
                    name="aadhaarNumber"
                    value={formData.aadhaarNumber}
                    onChange={handleChange}
                    disabled={isSaving}
                    placeholder="XXXX XXXX XXXX"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-800 font-medium disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button 
              onClick={onCancel}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-semibold transition-colors disabled:opacity-50"
            >
              <X size={18} />
              Cancel
            </button>
            <button 
              onClick={() => onConfirm(formData)}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 disabled:bg-blue-400 disabled:translate-y-0"
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Syncing to Sheet...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Confirm & Sync
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
