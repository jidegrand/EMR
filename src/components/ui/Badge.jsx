import React from 'react';

const Badge = ({ children, variant = 'default', size = 'sm' }) => {
  const variants = {
    default: 'bg-slate-700 text-slate-300',
    success: 'bg-emerald-900/50 text-emerald-400 border border-emerald-700',
    warning: 'bg-amber-900/50 text-amber-400 border border-amber-700',
    danger: 'bg-rose-900/50 text-rose-400 border border-rose-700',
    info: 'bg-cyan-900/50 text-cyan-400 border border-cyan-700',
    purple: 'bg-violet-900/50 text-violet-400 border border-violet-700',
    live: 'bg-emerald-500 text-white animate-pulse',
  };
  
  const sizes = { 
    xs: 'px-1.5 py-0.5 text-xs', 
    sm: 'px-2 py-0.5 text-xs', 
    md: 'px-2.5 py-1 text-sm' 
  };
  
  return (
    <span className={`inline-flex items-center font-medium rounded ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

export default Badge;
