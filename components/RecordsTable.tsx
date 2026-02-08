
import React from 'react';
import { AadhaarData } from '../types';
import { Trash2, ExternalLink, Plus, FileSpreadsheet } from 'lucide-react';

interface RecordsTableProps {
  records: AadhaarData[];
  onDelete: (timestamp: string) => void;
  onAdd: () => void;
}

export const RecordsTable: React.FC<RecordsTableProps> = ({ records, onDelete, onAdd }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileSpreadsheet className="text-emerald-600" />
            Digital Ledger
          </h2>
          <p className="text-sm text-slate-500">{records.length} secure records processed</p>
        </div>
        <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          <Plus size={16} /> Capture New
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {records.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-slate-400 italic">No records found. Start by capturing an Aadhaar card.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Aadhaar Holder</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Care of</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Gender/DOB</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Aadhaar Number</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((record) => (
                  <tr key={record.timestamp} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={record.photoUrl} className="w-10 h-10 rounded object-cover border border-slate-200" />
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{record.name}</p>
                          <p className="text-xs text-slate-500">{record.hindiName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{record.careOf}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-800 font-medium">{record.gender}</p>
                      <p className="text-xs text-slate-500">{record.dob}</p>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono">{record.aadhaarNumber}</code>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => window.open(record.photoUrl, '_blank')} className="p-2 text-slate-400 hover:text-blue-600"><ExternalLink size={16} /></button>
                        <button onClick={() => onDelete(record.timestamp)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
