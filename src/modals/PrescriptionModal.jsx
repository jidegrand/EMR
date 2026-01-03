import React, { useState } from 'react';
import { Pill, X, Search, Send, ShieldCheck } from 'lucide-react';
import { Button, Input, Select } from '../components/ui';
import { MEDICATIONS_DB, SIG_TEMPLATES, PHARMACIES } from '../data';
import { useToast } from '../contexts';

const PrescriptionModal = ({ isOpen, onClose, onSave, patient }) => {
  const toast = useToast();
  const [drugSearch, setDrugSearch] = useState('');
  const [showDrugDropdown, setShowDrugDropdown] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [rxData, setRxData] = useState({
    strength: '', form: '', quantity: '', daysSupply: '', refills: '0',
    sig: '', pharmacy: 'Shoppers Drug Mart #1234', notes: ''
  });

  const filteredDrugs = MEDICATIONS_DB.filter(d => 
    d.name.toLowerCase().includes(drugSearch.toLowerCase())
  );

  const handleSelectDrug = (drug) => {
    setSelectedDrug(drug);
    setDrugSearch(drug.name);
    setShowDrugDropdown(false);
    setRxData(prev => ({
      ...prev,
      strength: drug.strengths[0],
      form: drug.forms[0]
    }));
  };

  const handleSave = () => {
    if (!selectedDrug || !rxData.quantity || !rxData.sig) {
      toast.warning('Please complete all required fields');
      return;
    }
    onSave({
      drug: selectedDrug.name,
      ...rxData,
      patientId: patient?.id,
      patientName: patient?.name
    });
    toast.success(`${selectedDrug.name} sent to ${rxData.pharmacy}`);
    // Reset
    setSelectedDrug(null);
    setDrugSearch('');
    setRxData({ strength: '', form: '', quantity: '', daysSupply: '', refills: '0', sig: '', pharmacy: 'Shoppers Drug Mart #1234', notes: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-600 w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-cyan-400" />
            <h2 className="text-white font-medium">New Prescription</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Patient Banner */}
          <div className="flex items-center gap-3 p-2 bg-slate-900 rounded-lg border border-slate-700">
            <div className="w-8 h-8 bg-teal-600 rounded flex items-center justify-center text-white text-sm font-bold">
              {patient?.name?.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="text-sm text-white font-medium">{patient?.name}</p>
              <p className="text-xs text-slate-400">{patient?.age}yo • Allergies: {patient?.allergies?.join(', ') || 'NKDA'}</p>
            </div>
          </div>

          {/* Drug Search */}
          <div className="relative">
            <Input
              label="Medication"
              value={drugSearch}
              onChange={(e) => { setDrugSearch(e.target.value); setShowDrugDropdown(true); setSelectedDrug(null); }}
              placeholder="Search medication..."
              icon={Search}
            />
            {showDrugDropdown && drugSearch && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-600 rounded-lg shadow-xl z-10 max-h-48 overflow-y-auto">
                {filteredDrugs.length > 0 ? filteredDrugs.map(d => (
                  <button 
                    key={d.name} 
                    onClick={() => handleSelectDrug(d)} 
                    className="w-full px-3 py-2 text-left text-sm hover:bg-teal-600 text-slate-300"
                  >
                    {d.name}
                  </button>
                )) : <p className="px-3 py-2 text-sm text-slate-500">No medications found</p>}
              </div>
            )}
          </div>

          {/* Strength & Form */}
          {selectedDrug && (
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Strength"
                value={rxData.strength}
                onChange={(e) => setRxData(prev => ({ ...prev, strength: e.target.value }))}
                options={selectedDrug.strengths.map(s => ({ value: s, label: s }))}
              />
              <Select
                label="Form"
                value={rxData.form}
                onChange={(e) => setRxData(prev => ({ ...prev, form: e.target.value }))}
                options={selectedDrug.forms.map(f => ({ value: f, label: f }))}
              />
            </div>
          )}

          {/* Quantity, Days Supply, Refills */}
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Quantity"
              type="number"
              value={rxData.quantity}
              onChange={(e) => setRxData(prev => ({ ...prev, quantity: e.target.value }))}
              placeholder="30"
            />
            <Input
              label="Days Supply"
              type="number"
              value={rxData.daysSupply}
              onChange={(e) => setRxData(prev => ({ ...prev, daysSupply: e.target.value }))}
              placeholder="30"
            />
            <Select
              label="Refills"
              value={rxData.refills}
              onChange={(e) => setRxData(prev => ({ ...prev, refills: e.target.value }))}
              options={[0,1,2,3,4,5].map(n => ({ value: String(n), label: String(n) }))}
            />
          </div>

          {/* Sig */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Sig (Directions)</label>
            <Input
              value={rxData.sig}
              onChange={(e) => setRxData(prev => ({ ...prev, sig: e.target.value }))}
              placeholder="Take 1 tablet by mouth..."
            />
            <div className="flex flex-wrap gap-1 mt-2">
              {SIG_TEMPLATES.slice(0, 4).map((sig, i) => (
                <button 
                  key={i} 
                  onClick={() => setRxData(prev => ({ ...prev, sig }))} 
                  className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded hover:bg-slate-600"
                >
                  {sig.substring(0, 25)}...
                </button>
              ))}
            </div>
          </div>

          {/* Pharmacy */}
          <Select
            label="Pharmacy"
            value={rxData.pharmacy}
            onChange={(e) => setRxData(prev => ({ ...prev, pharmacy: e.target.value }))}
            options={PHARMACIES.map(p => ({ value: p, label: p }))}
          />
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-slate-900 border-t border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            EPCS Compliant • DEA# AJ1234567
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
            <Button 
              variant="primary" 
              size="sm" 
              icon={Send} 
              onClick={handleSave} 
              disabled={!selectedDrug || !rxData.quantity || !rxData.sig}
            >
              Send to Pharmacy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionModal;
