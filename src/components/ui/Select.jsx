import React from 'react';

const Select = ({ 
  label, 
  value, 
  onChange, 
  options, 
  className = '', 
  small = false 
}) => (
  <div className={className}>
    {label && (
      <label className="block text-xs font-medium text-slate-400 mb-1">
        {label}
      </label>
    )}
    <select 
      value={value} 
      onChange={onChange} 
      className={`w-full border rounded outline-none bg-slate-900 border-slate-700 text-slate-200 focus:border-teal-500 px-2 ${small ? 'py-1 text-xs' : 'py-1.5 text-sm'}`}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default Select;
