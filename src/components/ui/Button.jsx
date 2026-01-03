import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  onClick, 
  disabled, 
  className = '', 
  type = 'button' 
}) => {
  const variants = {
    primary: 'bg-gradient-to-b from-teal-500 to-teal-600 text-white hover:from-teal-400 hover:to-teal-500 border border-teal-400',
    secondary: 'bg-slate-700 text-slate-200 border border-slate-600 hover:bg-slate-600',
    ghost: 'text-slate-300 hover:bg-slate-700',
    danger: 'bg-rose-700 text-white hover:bg-rose-600 border border-rose-600',
    success: 'bg-emerald-600 text-white hover:bg-emerald-500 border border-emerald-500',
    toolbar: 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white',
    video: 'bg-gradient-to-b from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 border border-emerald-400',
  };
  
  const sizes = { 
    xs: 'px-2 py-1 text-xs', 
    sm: 'px-3 py-1.5 text-xs', 
    md: 'px-4 py-2 text-sm', 
    lg: 'px-6 py-2.5 text-sm' 
  };
  
  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled} 
      className={`inline-flex items-center justify-center gap-1.5 font-medium rounded transition-all ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

export default Button;
