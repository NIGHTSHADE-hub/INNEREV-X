import React from 'react';
import { KhataRecord, ShopType } from '../types';
import { Download, Printer, TrendingUp, CalendarRange, AlertCircle } from 'lucide-react';

interface ReportsProps {
  history: KhataRecord[];
  shopType: ShopType;
}

const Reports: React.FC<ReportsProps> = ({ history, shopType }) => {
  const totalRevenue = history.reduce((sum, r) => sum + r.taxDetails.total, 0);
  const totalTax = history.reduce((sum, r) => sum + (r.taxDetails.cgst + r.taxDetails.sgst), 0);
  
  // Group by date (simple mock for daily)
  const today = new Date().toISOString().split('T')[0];
  const todaysRevenue = history
    .filter(h => h.timestamp.startsWith(today))
    .reduce((sum, h) => sum + h.taxDetails.total, 0);

  const handleDownload = () => {
    // Basic simulation of downloading a CSV/Report
    const headers = "Date,Transaction ID,Items,Subtotal,Tax,Total\n";
    const rows = history.map(h => {
        const date = new Date(h.timestamp).toLocaleDateString();
        const items = h.items.map(i => i.description).join('; ');
        return `${date},${h.id},"${items}",${h.taxDetails.subtotal},${h.taxDetails.cgst + h.taxDetails.sgst},${h.taxDetails.total}`;
    }).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KhataLens_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Financial Reports</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Compliance-ready summaries for {shopType}</p>
        </div>
        <div className="flex space-x-2">
           <button 
             onClick={() => window.print()}
             className="flex items-center space-x-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
           >
             <Printer size={16} />
             <span className="hidden sm:inline">Print</span>
           </button>
           <button 
             onClick={handleDownload}
             className="flex items-center space-x-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
           >
             <Download size={16} />
             <span>Download CSV</span>
           </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
           <div className="flex justify-between items-start mb-4">
             <div>
               <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Today's Revenue</p>
               <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">₹{todaysRevenue.toFixed(2)}</h3>
             </div>
             <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg">
               <TrendingUp size={20} />
             </div>
           </div>
           <div className="text-xs text-green-600 dark:text-green-400 flex items-center">
             +12% from yesterday
           </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
           <div className="flex justify-between items-start mb-4">
             <div>
               <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Revenue (All Time)</p>
               <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">₹{totalRevenue.toFixed(2)}</h3>
             </div>
             <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
               <CalendarRange size={20} />
             </div>
           </div>
           <div className="text-xs text-slate-500 dark:text-slate-400">
             Across {history.length} transactions
           </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
           <div className="flex justify-between items-start mb-4">
             <div>
               <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Tax Liability (GST)</p>
               <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">₹{totalTax.toFixed(2)}</h3>
             </div>
             <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg">
               <AlertCircle size={20} />
             </div>
           </div>
           <div className="text-xs text-amber-600 dark:text-amber-400">
             Estimated payable
           </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="font-semibold text-slate-800 dark:text-white">Transaction Ledger</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Transaction ID</th>
                <th className="px-6 py-3">Taxable Value</th>
                <th className="px-6 py-3">GST</th>
                <th className="px-6 py-3 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
              {history.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-750">
                  <td className="px-6 py-3">{new Date(record.timestamp).toLocaleDateString()}</td>
                  <td className="px-6 py-3 font-mono text-xs">{record.id.slice(0, 8)}...</td>
                  <td className="px-6 py-3">₹{record.taxDetails.subtotal.toFixed(2)}</td>
                  <td className="px-6 py-3">₹{(record.taxDetails.cgst + record.taxDetails.sgst).toFixed(2)}</td>
                  <td className="px-6 py-3 text-right font-medium">₹{record.taxDetails.total.toFixed(2)}</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400 dark:text-slate-500">
                    No transactions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;