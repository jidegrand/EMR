import React from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  icon: Icon, 
  className = '', 
  small = false, 
  rows 
}) => (
  <div className={className}>
    {label && (
      <label className="block text-xs font-medium text-slate-400 mb-1">
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <div className="absolute left-2 top-2.5 text-slate-500">
          <Icon className="w-3.5 h-3.5" />
        </div>
      )}
      {rows ? (
        <textarea 
          value={value} 
          onChange={onChange} 
          placeholder={placeholder} 
          rows={rows} 
          className="w-full border rounded outline-none transition-all bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 px-2 py-1.5 text-sm resize-none" 
        />
      ) : (
        <input 
          type={type} 
          value={value} 
          onChange={onChange} 
          placeholder={placeholder} 
          className={`w-full border rounded outline-none transition-all bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 ${Icon ? 'pl-8' : 'px-2'} ${small ? 'py-1 text-xs' : 'py-1.5 text-sm'}`} 
        />
      )}
    </div>
  </div>
);

export default Input;
