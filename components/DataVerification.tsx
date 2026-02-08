
import React, { useState } from 'react';
import { OCRResult } from '../types';
import { X, User, Calendar, Hash, Save, Loader2, VenusAndMars, Languages, Heart } from 'lucide-react';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
      <div className="flex flex-col lg:flex-row">
        {/* Card Preview */}
        <div className="lg:w-1/3 p-6 bg-slate-900 flex flex-col items-center justify-center min-h-[300px]">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Verification Image</h3>
          <div className="relative">
            <img 
              src={image} 
              alt="Aadhaar Card" 
              className="max-w-full h-auto rounded-xl shadow-2xl border border-slate-700"
            />
            <div className="absolute inset-0 bg-blue-600/5 rounded-xl pointer-events-none border border-blue-500/20"></div>
          </div>
        </div>

        {/* Form Details */}
        <div className="lg:w-2/3 p-8">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Verify Extraction</h2>
              <p className="text-slate-500 text-sm">Review all fields captured by the AI.</p>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100">
              AI PROCESSED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name (English)</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input name="name" value={formData.name} onChange={handleChange} disabled={isSaving} className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div className="col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">नाम (Hindi)</label>
              <div className="relative">
                <Languages className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input name="hindiName" value={formData.hindiName} onChange={handleChange} disabled={isSaving} className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Care of (C/O)</label>
              <div className="relative">
                <Heart className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input name="careOf" value={formData.careOf} onChange={handleChange} disabled={isSaving} placeholder="Father or Husband name" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div className="col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input name="dob" value={formData.dob} onChange={handleChange} disabled={isSaving} placeholder="DD/MM/YYYY" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div className="col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Gender</label>
              <div className="relative">
                <VenusAndMars className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select name="gender" value={formData.gender} onChange={handleChange} disabled={isSaving} className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Transgender">Transgender</option>
                </select>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Aadhaar Number</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} disabled={isSaving} placeholder="XXXX XXXX XXXX" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button onClick={onCancel} disabled={isSaving} className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-semibold transition-colors flex items-center justify-center gap-2">
              <X size={16} /> Cancel
            </button>
            <button onClick={() => onConfirm(formData)} disabled={isSaving} className="flex-[2] px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
              {isSaving ? <><Loader2 size={16} className="animate-spin" /> Syncing...</> : <><Save size={16} /> Confirm & Save</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
