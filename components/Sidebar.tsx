import React from 'react';
import { AppView, User, ShopType } from '../types';
import { LayoutDashboard, FileBarChart, Megaphone, Settings, Store, LogOut, Cloud } from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, user, onLogout }) => {
  const menuItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.REPORTS, label: 'Reports', icon: FileBarChart },
    { id: AppView.MARKETING, label: 'Marketing AI', icon: Megaphone },
    { id: AppView.SETTINGS, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen flex flex-col hidden md:flex transition-colors">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-3">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <Store size={20} />
        </div>
        <div>
          <h1 className="font-bold text-lg text-slate-800 dark:text-white tracking-tight">KhataLens</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Pro Edition</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                currentView === item.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-4">
           <div className="flex items-center space-x-3 mb-2">
             <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">
                {user.name.charAt(0)}
             </div>
             <div className="overflow-hidden">
               <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{user.name}</p>
               <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.shopType}</p>
             </div>
           </div>
           <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-2">
             <Cloud size={12} className="mr-1" />
             Data Synced
           </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 py-2 transition-colors text-sm"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;