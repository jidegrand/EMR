import React from 'react';
import { Stethoscope, Search, Bell, Shield, LogOut, Sun, Moon, Settings, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts';
import { APP_INFO } from '../../data';

const TopHeader = ({ user, onLogout, onOpenSearch, onOpenSettings }) => {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <div className={`h-10 border-b flex items-center justify-between px-3 ${
      isDark 
        ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-slate-700' 
        : 'bg-gradient-to-r from-white via-slate-50 to-white border-slate-200'
    }`}>
      <div className="flex items-center gap-3">
        {/* App Name & Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-teal-400 to-cyan-500 rounded flex items-center justify-center">
            <Stethoscope className="w-4 h-4 text-white" />
          </div>
          <span className="text-teal-500 font-bold text-sm">{APP_INFO.name}</span>
        </div>
        
        {/* Divider */}
        <div className={`h-4 w-px ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
        
        {/* Version */}
        <div className="flex items-center gap-1.5">
          <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>v</span>
          <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{APP_INFO.version}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded ${
            APP_INFO.environment === 'PRD' 
              ? 'bg-emerald-900/30 text-emerald-400' 
              : APP_INFO.environment === 'TST'
                ? 'bg-amber-900/30 text-amber-400'
                : 'bg-sky-900/30 text-sky-400'
          }`}>
            {APP_INFO.environment}
          </span>
        </div>
        
        {/* Divider */}
        <div className={`h-4 w-px ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
        
        {/* Workstation ID */}
        <div className="flex items-center gap-1.5">
          <Monitor className={`w-3.5 h-3.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <span className={`text-xs font-mono ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
            {user?.workstationId || 'WS-001'}
          </span>
        </div>
        
        {/* Divider */}
        <div className={`h-4 w-px ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
        
        {/* Provider Name */}
        <div className="flex items-center gap-1.5">
          <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Provider:</span>
          <span className={`text-xs font-semibold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
            {user?.name?.toUpperCase() || 'NOT SIGNED IN'}
          </span>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-8">
        <button 
          onClick={onOpenSearch} 
          className={`w-full flex items-center gap-2 px-3 py-1.5 border rounded text-sm hover:border-teal-500 ${
            isDark 
              ? 'bg-slate-900 border-slate-700 text-slate-400' 
              : 'bg-white border-slate-300 text-slate-500'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Search (Ctrl+Space)</span>
        </button>
      </div>
      
      {/* Right Side Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className={`p-1.5 rounded transition-colors ${
            isDark 
              ? 'text-slate-400 hover:text-amber-400 hover:bg-slate-700' 
              : 'text-slate-500 hover:text-amber-500 hover:bg-slate-200'
          }`}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        
        <button className={`p-1.5 rounded ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'}`}>
          <Bell className="w-4 h-4" />
        </button>
        
        {/* Settings */}
        <button 
          onClick={onOpenSettings}
          className={`p-1.5 rounded ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'}`}
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
        
        <div className="flex items-center gap-2 px-2 py-1 bg-emerald-900/30 border border-emerald-700/50 rounded">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs text-emerald-400 font-medium">HIPAA</span>
        </div>
        <button 
          onClick={onLogout} 
          className={`p-1.5 rounded ${isDark ? 'text-slate-400 hover:text-rose-400 hover:bg-slate-700' : 'text-slate-500 hover:text-rose-500 hover:bg-slate-200'}`}
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TopHeader;
