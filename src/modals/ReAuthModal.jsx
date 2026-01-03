import React, { useState } from 'react';
import { X, Shield, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { useToast } from '../contexts';
import { DEMO_CREDENTIALS } from '../data';

const ReAuthModal = ({ isOpen, onClose, onSuccess, action = 'view', itemName = 'this item' }) => {
  const toast = useToast();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setError('');
    setIsVerifying(true);
    
    // Simulate verification delay
    await new Promise(r => setTimeout(r, 500));
    
    if (password === DEMO_CREDENTIALS.password) {
      toast.success('Identity verified');
      setPassword('');
      onSuccess();
      onClose();
    } else {
      setError('Incorrect password. Please try again.');
      toast.error('Verification failed');
    }
    
    setIsVerifying(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  if (!isOpen) return null;

  const actionLabels = {
    view: 'View',
    download: 'Download',
    export: 'Export',
    print: 'Print',
    delete: 'Delete',
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-md border border-slate-600 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-amber-900/30 border-b border-amber-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-900/50 rounded-lg">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Authentication Required</h2>
              <p className="text-xs text-amber-300/70">HIPAA Security Verification</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div className="flex items-start gap-3 p-3 bg-slate-900 rounded-lg border border-slate-700">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-slate-300">
              <p className="font-medium text-white mb-1">Sensitive Action</p>
              <p>You are attempting to <strong>{actionLabels[action] || action}</strong> {itemName}.</p>
              <p className="mt-1 text-slate-400">Please verify your identity to continue.</p>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2 bg-slate-900 border border-slate-600 rounded text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <p className="text-xs text-rose-400 mt-1">{error}</p>
            )}
          </div>

          <div className="text-xs text-slate-500">
            <p>Demo password: <span className="font-mono text-slate-400">SecurePass123!</span></p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-4 py-3 bg-slate-900 border-t border-slate-700">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleVerify}
            disabled={!password || isVerifying}
          >
            {isVerifying ? 'Verifying...' : 'Verify & Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReAuthModal;
