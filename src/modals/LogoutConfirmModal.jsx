import React from 'react';
import { LogOut, AlertTriangle, X } from 'lucide-react';
import { Button } from '../components/ui';

const LogoutConfirmModal = ({ isOpen, onClose, onConfirm, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-md border border-slate-600 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-900/50 rounded-lg">
              <LogOut className="w-5 h-5 text-rose-400" />
            </div>
            <h2 className="text-white font-semibold">Sign Out</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-900/30 rounded-full">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">Are you sure you want to sign out?</h3>
              <p className="text-sm text-slate-400 mb-4">
                You are currently signed in as <span className="text-white font-medium">{userName}</span>.
              </p>
              <ul className="text-sm text-slate-500 space-y-1">
                <li>- Any unsaved work will be lost</li>
                <li>- Active telemedicine sessions will be disconnected</li>
                <li>- You will need to re-authenticate to access patient data</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-4 py-3 bg-slate-900 border-t border-slate-700">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" icon={LogOut} onClick={onConfirm}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
