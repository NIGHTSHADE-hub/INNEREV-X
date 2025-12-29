import React, { useMemo } from 'react';
import { KhataItem, TaxDetails } from '../types';
import { Calculator, ArrowRight } from 'lucide-react';

interface TaxViewProps {
  items: KhataItem[];
  onFinish: (taxDetails: TaxDetails) => void;
}

const TaxView: React.FC<TaxViewProps> = ({ items, onFinish }) => {
  const taxDetails = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const cgst = subtotal * 0.09;
    const sgst = subtotal * 0.09;
    const total = subtotal + cgst + sgst;
    return { subtotal, cgst, sgst, total };
  }, [items]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-white/20 p-2 rounded-lg">
              <Calculator size={24} />
            </div>
            <h2 className="text-xl font-bold">GST Analysis</h2>
          </div>
          <p className="text-blue-100 text-sm opacity-90">Automated tax calculation based on verified inputs.</p>
        </div>

        <div className="p-8">
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Total Taxable Value</span>
              <span className="text-slate-900 dark:text-white font-bold text-lg">₹{taxDetails.subtotal.toFixed(2)}</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">CGST (9%)</span>
                <span className="text-slate-700 dark:text-slate-300 font-mono">+ ₹{taxDetails.cgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">SGST (9%)</span>
                <span className="text-slate-700 dark:text-slate-300 font-mono">+ ₹{taxDetails.sgst.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 uppercase font-semibold tracking-wider">Grand Total</span>
                  <div className="text-3xl font-bold text-slate-800 dark:text-white mt-1">
                    ₹{taxDetails.total.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-1 rounded font-medium border border-green-200 dark:border-green-800">
                    Tax Included
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={() => onFinish(taxDetails)}
              className="w-full bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 py-4 rounded-xl font-medium flex items-center justify-center transition-all group shadow-lg hover:shadow-xl"
            >
              Generate Final Preview
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxView;