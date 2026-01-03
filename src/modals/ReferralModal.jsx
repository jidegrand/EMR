import React, { useState } from 'react';
import { Share2, X, Send } from 'lucide-react';
import { Button, Input, Select } from '../components/ui';
import { SPECIALTIES } from '../data';
import { useToast } from '../contexts';

const ReferralModal = ({ isOpen, onClose, onSave, patient }) => {
  const toast = useToast();
  const [refData, setRefData] = useState({
    specialty: '', provider: '', facility: '', reason: '', priority: 'routine', notes: ''
  });

  const handleSave = () => {
    if (!refData.specialty || !refData.reason) {
      toast.warning('Please select specialty and enter reason');
      return;
    }
    onSave({ ...refData, patientId: patient?.id });
    toast.success(`Referral to ${refData.specialty} sent`);
    setRefData({ specialty: '', provider: '', facility: '', reason: '', priority: 'routine', notes: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-600 w-full max-w-lg overflow-hidden">
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-violet-400" />
            <h2 className="text-white font-medium">New Referral</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Patient Banner */}
          <div className="flex items-center gap-3 p-2 bg-slate-900 rounded-lg border border-slate-700">
            <div className="w-8 h-8 bg-teal-600 rounded flex items-center justify-center text-white text-sm font-bold">
              {patient?.name?.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="text-sm text-white font-medium">{patient?.name}</p>
              <p className="text-xs text-slate-400">{patient?.age}yo</p>
            </div>
          </div>

          {/* Specialty Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Specialty</label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {SPECIALTIES.map(spec => (
                <button
                  key={spec}
                  onClick={() => setRefData(prev => ({ ...prev, specialty: spec }))}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                    refData.specialty === spec
                      ? 'bg-violet-600 border-violet-500 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-violet-500'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Refer to Provider (optional)"
              value={refData.provider}
              onChange={(e) => setRefData(prev => ({ ...prev, provider: e.target.value }))}
              placeholder="Dr. ..."
            />
            <Select
              label="Priority"
              value={refData.priority}
              onChange={(e) => setRefData(prev => ({ ...prev, priority: e.target.value }))}
              options={[
                { value: 'routine', label: 'Routine' },
                { value: 'urgent', label: 'Urgent' },
              ]}
            />
          </div>

          <Input
            label="Facility (optional)"
            value={refData.facility}
            onChange={(e) => setRefData(prev => ({ ...prev, facility: e.target.value }))}
            placeholder="Hospital or clinic name..."
          />

          <Input
            label="Reason for Referral"
            rows={2}
            value={refData.reason}
            onChange={(e) => setRefData(prev => ({ ...prev, reason: e.target.value }))}
            placeholder="Clinical indication and what you need from the consultant..."
          />

          <Input
            label="Clinical Notes"
            rows={2}
            value={refData.notes}
            onChange={(e) => setRefData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Relevant history, current medications, etc."
          />
        </div>

        <div className="px-4 py-3 bg-slate-900 border-t border-slate-700 flex items-center justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button 
            variant="primary" 
            size="sm" 
            icon={Send} 
            onClick={handleSave} 
            disabled={!refData.specialty || !refData.reason}
          >
            Send Referral
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReferralModal;
