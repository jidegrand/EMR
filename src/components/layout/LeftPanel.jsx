import React from 'react';
import { ChevronRight, ChevronLeft, Search, User, UserPlus } from 'lucide-react';
import { useTheme } from '../../contexts';

const LeftPanel = ({ collapsed, onToggle, onOpenSearch, onRegisterPatient, recentRecords }) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`border-r flex flex-col transition-all ${collapsed ? 'w-10' : 'w-60'} ${
      isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      <div className={`flex items-center justify-between px-2 py-2 border-b ${
        isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'
      }`}>
        {!collapsed && (
          <span className="text-xs font-semibold text-teal-500">≡ Record Selection</span>
        )}
        <button 
          onClick={onToggle} 
          className={`p-1 rounded ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'}`}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
      {!collapsed && (
        <>
          <div className={`p-2 space-y-2 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <button 
              onClick={onOpenSearch} 
              className={`w-full flex items-center gap-2 px-2 py-2 text-xs text-left rounded border hover:border-teal-500 ${
                isDark 
                  ? 'text-slate-300 border-slate-700 hover:bg-teal-900/30 hover:text-teal-400' 
                  : 'text-slate-600 border-slate-300 hover:bg-teal-50 hover:text-teal-600'
              }`}
            >
              <Search className="w-4 h-4" />
              Search for a Patient...
            </button>
            <button 
              onClick={onRegisterPatient} 
              className={`w-full flex items-center gap-2 px-2 py-2 text-xs text-left rounded border hover:border-emerald-500 ${
                isDark 
                  ? 'text-slate-300 border-slate-700 hover:bg-emerald-900/30 hover:text-emerald-400' 
                  : 'text-slate-600 border-slate-300 hover:bg-emerald-50 hover:text-emerald-600'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Register New Patient
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <div className={`text-xs font-medium mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Recent Patients</div>
            {recentRecords.length > 0 ? (
              recentRecords.map(r => (
                <button 
                  key={r.id} 
                  className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs text-left rounded ${
                    isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="truncate">{r.name}</span>
                </button>
              ))
            ) : (
              <p className={`text-xs italic ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>No recent records</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LeftPanel;
