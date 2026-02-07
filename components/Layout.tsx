
import React from 'react';
import { Camera, History, ShieldCheck } from 'lucide-react';
import { AppStep } from '../types.ts';

interface LayoutProps {
  children: React.ReactNode;
  currentStep: AppStep;
  onNavigate: (step: AppStep) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentStep, onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">AadhaarSecure</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => onNavigate('UPLOAD')}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${currentStep === 'UPLOAD' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <Camera size={18} />
              New Capture
            </button>
            <button 
              onClick={() => onNavigate('HISTORY')}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${currentStep === 'HISTORY' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <History size={18} />
              Records Log
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">
            Secure Aadhaar Processing System. AI extraction powered by Gemini.
          </p>
        </div>
      </footer>
    </div>
  );
};
