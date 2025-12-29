import React, { useState } from 'react';
import { KhataRecord, User } from '../types';
import { Plus, History, Calendar, DollarSign, ChevronRight, Search, ChevronDown, List } from 'lucide-react';

interface DashboardProps {
  user: User;
  history: KhataRecord[];
  onNewScan: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, history, onNewScan }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">Welcome back, {user.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">Manage your digital ledger entries</p>
        </div>
        <button 
          onClick={onNewScan}
          className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium items-center shadow-lg shadow-blue-200 dark:shadow-blue-900/20 transition-all transform hover:-translate-y-0.5"
        >
          <Plus size={20} className="mr-2" />
          New Khata Entry
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
              <History size={20} />
            </div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Total Entries</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">{history.length}</p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
           <div className="flex items-center justify-between mb-4">
            <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded-lg text-green-600 dark:text-green-400">
              <DollarSign size={20} />
            </div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Total Value</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">
            ₹{history.reduce((acc, curr) => acc + curr.taxDetails.total, 0).toFixed(0)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-5 rounded-xl text-white shadow-lg flex flex-col justify-center items-start cursor-pointer md:hidden active:scale-95 transition-transform" onClick={onNewScan}>
          <div className="flex items-center mb-2">
            <Plus size={24} className="mr-2" />
            <span className="font-bold text-lg">New Scan</span>
          </div>
          <p className="text-blue-100 text-sm">Tap to digitize a receipt</p>
        </div>
      </div>

      {/* Recent History */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 dark:text-white flex items-center">
            <List size={18} className="mr-2 text-slate-500 dark:text-slate-400" />
            Recent History
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200 w-32 md:w-48 placeholder-slate-400 dark:placeholder-slate-600 transition-colors"
            />
          </div>
        </div>

        {history.length === 0 ? (
          <div className="p-10 text-center text-slate-400 dark:text-slate-500">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <History size={24} className="opacity-50" />
            </div>
            <p>No records found. Start your first scan!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {history.map((record) => (
              <div key={record.id} className="group transition-colors">
                {/* Main Row */}
                <div 
                  className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center justify-between cursor-pointer ${expandedId === record.id ? 'bg-slate-50 dark:bg-slate-750' : ''}`}
                  onClick={() => toggleExpand(record.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-300 font-bold text-xs transition-colors">
                      {new Date(record.timestamp).getDate()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">
                        {record.items.length} Items
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center mt-0.5">
                        <Calendar size={12} className="mr-1" />
                        {new Date(record.timestamp).toLocaleDateString()} &bull; {new Date(record.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-bold text-slate-800 dark:text-white">₹{record.taxDetails.total.toFixed(2)}</p>
                      <p className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-1.5 py-0.5 rounded-full inline-block mt-0.5">Paid</p>
                    </div>
                    {expandedId === record.id ? (
                      <ChevronDown size={16} className="text-blue-500" />
                    ) : (
                      <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-500" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === record.id && (
                  <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 p-4 pl-16 animate-fade-in transition-colors">
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-medium">
                          <tr>
                            <th className="px-4 py-2">Item</th>
                            <th className="px-4 py-2 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                          {record.items.map((item, idx) => (
                            <tr key={idx}>
                              <td className="px-4 py-2">{item.description}</td>
                              <td className="px-4 py-2 text-right">₹{item.amount.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 font-medium border-t border-slate-200 dark:border-slate-700">
                          <tr>
                            <td className="px-4 py-2">Subtotal</td>
                            <td className="px-4 py-2 text-right">₹{record.taxDetails.subtotal.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-xs text-slate-500 dark:text-slate-400">Tax (18% GST)</td>
                            <td className="px-4 py-2 text-right text-xs text-slate-500 dark:text-slate-400">
                              +₹{(record.taxDetails.cgst + record.taxDetails.sgst).toFixed(2)}
                            </td>
                          </tr>
                          <tr className="font-bold text-slate-900 dark:text-white">
                            <td className="px-4 py-2">Total</td>
                            <td className="px-4 py-2 text-right">₹{record.taxDetails.total.toFixed(2)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;