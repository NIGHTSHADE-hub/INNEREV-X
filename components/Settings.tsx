import React from 'react';
import { ShopType } from '../types';
import { Store, Save } from 'lucide-react';

interface SettingsProps {
  currentType: ShopType;
  onTypeChange: (type: ShopType) => void;
}

const Settings: React.FC<SettingsProps> = ({ currentType, onTypeChange }) => {
  return (
    <div className="animate-fade-in max-w-2xl">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Settings</h2>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
          <h3 className="font-semibold text-slate-800 dark:text-white flex items-center">
            <Store size={18} className="mr-2 text-blue-500" />
            Shop Configuration
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            This helps our AI understand your receipts better for validation.
          </p>
        </div>
        
        <div className="p-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Business Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.values(ShopType).map((type) => (
              <div 
                key={type}
                onClick={() => onTypeChange(type)}
                className={`cursor-pointer p-3 rounded-lg border-2 flex items-center transition-all ${
                  currentType === type
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  currentType === type ? 'border-blue-500' : 'border-slate-400'
                }`}>
                  {currentType === type && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                </div>
                <span className="text-sm font-medium">{type}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 flex justify-end">
          <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors">
            <Save size={16} className="mr-2" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;