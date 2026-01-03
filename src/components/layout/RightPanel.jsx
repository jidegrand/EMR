import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Input from '../ui/Input';
import { useTheme } from '../../contexts';

const RightPanel = ({ collapsed, onToggle }) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`border-l flex flex-col transition-all ${collapsed ? 'w-10' : 'w-52'} ${
      isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      <div className={`flex items-center justify-between px-2 py-2 border-b ${
        isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'
      }`}>
        <button 
          onClick={onToggle} 
          className={`p-1 rounded ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'}`}
        >
          {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {!collapsed && (
          <span className="text-xs font-semibold text-teal-500">Item Filters</span>
        )}
      </div>
      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-2 space-y-3">
          <Input label="Text Search" small />
          <div>
            <div className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Status</div>
            <div className="flex flex-wrap gap-1">
              <button className="px-2 py-1 text-xs bg-teal-600 text-white rounded">All</button>
              <button className={`px-2 py-1 text-xs rounded ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>Active</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightPanel;
