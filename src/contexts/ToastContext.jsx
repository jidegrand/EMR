import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/ui/Toast';

// Create context
const ToastContext = createContext(null);

// Generate unique IDs
let toastId = 0;
const generateId = () => `toast-${++toastId}`;

// Provider component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Add a toast
  const showToast = useCallback((message, options = {}) => {
    const id = generateId();
    const toast = {
      id,
      message,
      variant: options.variant || 'info',
      duration: options.duration ?? 4000,
    };
    
    setToasts(prev => [...prev, toast]);
    return id;
  }, []);

  // Remove a toast by ID
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Convenience methods
  const toast = {
    show: showToast,
    success: (message, options) => showToast(message, { ...options, variant: 'success' }),
    error: (message, options) => showToast(message, { ...options, variant: 'error' }),
    warning: (message, options) => showToast(message, { ...options, variant: 'warning' }),
    info: (message, options) => showToast(message, { ...options, variant: 'info' }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      
      {/* Toast Container - fixed position, top right */}
      <div className="fixed top-14 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map(t => (
          <Toast
            key={t.id}
            id={t.id}
            message={t.message}
            variant={t.variant}
            duration={t.duration}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Hook for consuming toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
