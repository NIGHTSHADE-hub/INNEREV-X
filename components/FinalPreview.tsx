import React from 'react';
import { KhataItem, TaxDetails } from '../types';
import { CheckCircle, Share2, Download, Home, Save } from 'lucide-react';

interface FinalPreviewProps {
  items: KhataItem[];
  taxDetails: TaxDetails;
  onReset: () => void;
}

const FinalPreview: React.FC<FinalPreviewProps> = ({ items, taxDetails, onReset }) => {
  return (
    <div className="max-w-md mx-auto text-center">
      <div className="mb-8">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-slate-800 shadow-sm transition-colors">
          <CheckCircle className="text-green-600 dark:text-green-400 w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Processing Complete!</h2>
        <p className="text-slate-500 dark:text-slate-400">Your data has been processed. Review the summary below before saving.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden text-left relative mb-8 transition-colors">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Transaction Preview</p>
              <p className="text-slate-800 dark:text-white font-mono text-sm">PENDING SAVE</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Date</p>
              <p className="text-slate-800 dark:text-white text-sm">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm py-1 border-b border-slate-50 dark:border-slate-800 last:border-0">
                <span className="text-slate-600 dark:text-slate-400 truncate max-w-[70%]">{item.description}</span>
                <span className="text-slate-900 dark:text-white font-medium">₹{item.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 -mx-6 -mb-6 p-6 border-t border-slate-100 dark:border-slate-800">
             <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Subtotal</span>
                <span className="text-sm text-slate-700 dark:text-slate-300">₹{taxDetails.subtotal.toFixed(2)}</span>
             </div>
             <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-slate-500 dark:text-slate-400">Total Tax (18%)</span>
                <span className="text-sm text-slate-700 dark:text-slate-300">₹{(taxDetails.cgst + taxDetails.sgst).toFixed(2)}</span>
             </div>
             <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-white">Total Amount</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 text-xl">₹{taxDetails.total.toFixed(2)}</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button className="flex items-center justify-center p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium text-sm transition-colors">
          <Download size={16} className="mr-2" /> Download PDF
        </button>
        <button className="flex items-center justify-center p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium text-sm transition-colors">
          <Share2 size={16} className="mr-2" /> Share Receipt
        </button>
      </div>

      <button 
        onClick={onReset}
        className="w-full bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 py-3.5 rounded-xl font-medium flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
      >
        <Save size={18} className="mr-2" />
        Save & Return to Dashboard
      </button>
    </div>
  );
};

export default FinalPreview;