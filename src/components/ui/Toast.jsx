import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const Toast = ({ 
  id,
  message, 
  variant = 'info', 
  duration = 4000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  // Variant styles and icons
  const variants = {
    success: {
      bg: 'bg-emerald-900/90 border-emerald-600',
      icon: CheckCircle,
      iconColor: 'text-emerald-400',
    },
    error: {
      bg: 'bg-rose-900/90 border-rose-600',
      icon: XCircle,
      iconColor: 'text-rose-400',
    },
    warning: {
      bg: 'bg-amber-900/90 border-amber-600',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
    },
    info: {
      bg: 'bg-cyan-900/90 border-cyan-600',
      icon: Info,
      iconColor: 'text-cyan-400',
    },
  };

  const config = variants[variant] || variants.info;
  const Icon = config.icon;

  // Animate in on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Auto-dismiss
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => handleClose(), duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => onClose?.(id), 300); // Wait for exit animation
  };

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg backdrop-blur-sm
        transition-all duration-300 ease-out
        ${config.bg}
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}
      `}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
      <p className="text-sm text-white flex-1">{message}</p>
      <button
        onClick={handleClose}
        className="p-1 text-slate-400 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
