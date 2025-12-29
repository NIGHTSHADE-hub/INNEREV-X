import React, { useState } from 'react';
import { KhataItem } from '../types';
import { Trash2, Plus, Save, AlertCircle } from 'lucide-react';

interface DataVerificationProps {
  initialData: KhataItem[];
  onConfirm: (data: KhataItem[]) => void;
  onRetake: () => void;
}

const DataVerification: React.FC<DataVerificationProps> = ({ initialData, onConfirm, onRetake }) => {
  const [items, setItems] = useState<KhataItem[]>(initialData);

  const handleChange = (id: string, field: keyof KhataItem, value: string | number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAdd = () => {
    setItems(prev => [
      ...prev,
      { id: crypto.randomUUID(), date: new Date().toISOString().split('T')[0], description: '', amount: 0 }
    ]);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Verify Extracted Data</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Please check and correct the details below.</p>
        </div>
        <div className="flex items-center text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-full text-xs font-medium border border-amber-200 dark:border-amber-800">
          <AlertCircle size={14} className="mr-1" />
          Review Carefully
        </div>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                <th className="p-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</th>
                <th className="p-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount (₹)</th>
                <th className="p-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <td className="p-2">
                    <input
                      type="date"
                      value={item.date}
                      onChange={(e) => handleChange(item.id, 'date', e.target.value)}
                      className="w-full bg-transparent border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-blue-500 rounded px-2 py-1 text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-800 transition-all dark:[color-scheme:dark]"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                      placeholder="Item description"
                      className="w-full bg-transparent border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-blue-500 rounded px-2 py-1 text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-800 transition-all"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) => handleChange(item.id, 'amount', parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-blue-500 rounded px-2 py-1 text-slate-700 dark:text-slate-200 font-mono text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-800 transition-all"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={handleAdd}
          className="mt-4 flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 w-fit transition-colors"
        >
          <Plus size={16} className="mr-1" /> Add New Row
        </button>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 px-6 py-4 flex justify-between items-center border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={onRetake}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm font-medium px-4 py-2"
        >
          Retake Photo
        </button>
        <button
          onClick={() => onConfirm(items)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center shadow-md transition-all hover:shadow-lg"
        >
          <Save size={16} className="mr-2" />
          Proceed to Tax Analysis
        </button>
      </div>
    </div>
  );
};

export default DataVerification;