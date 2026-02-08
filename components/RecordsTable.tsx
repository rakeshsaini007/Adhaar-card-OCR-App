
import React from 'react';
import { AadhaarData } from '../types';
import { Trash2, ExternalLink, Plus, Search, FileSpreadsheet, Download } from 'lucide-react';

interface RecordsTableProps {
  records: AadhaarData[];
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export const RecordsTable: React.FC<RecordsTableProps> = ({ records, onDelete, onAdd }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileSpreadsheet className="text-emerald-600" />
            Digital Ledger
          </h2>
          <p className="text-sm text-slate-500">{records.length} records processed successfully</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={onAdd}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            Capture New
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {records.length === 0 ? (
          <div className="py-20 text-center">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <FileSpreadsheet size={32} />
            </div>
            <p className="text-slate-800 font-semibold">No records yet</p>
            <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">Start by capturing an Aadhaar card to build your digital secure log.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Aadhaar Holder</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Aadhaar Number</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0">
                          <img src={record.photoUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-semibold text-slate-800">{record.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">DOB: {record.dob}</span>
                    </td>
                    <td className="px-6 py-4">
                      <code className="bg-slate-100 px-2 py-1 rounded text-slate-800 font-mono text-sm">
                        {record.aadhaarNumber}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-400">
                        {new Date(record.timestamp).toLocaleDateString()} {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => window.open(record.photoUrl, '_blank')}
                          className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                          title="View Source Image"
                        >
                          <ExternalLink size={18} />
                        </button>
                        <button 
                          onClick={() => onDelete(record.id)}
                          className="p-2 text-slate-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete Record"
                        >
                          <Trash2 size={18} />
                        </button>
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
