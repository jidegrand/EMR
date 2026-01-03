import React, { useState } from 'react';
import { FlaskConical, X, Send } from 'lucide-react';
import { Button, Input, Select } from '../components/ui';
import { LAB_TESTS, LAB_FACILITIES } from '../data';
import { useToast } from '../contexts';

const LabOrderModal = ({ isOpen, onClose, onSave, patient }) => {
  const toast = useToast();
  const [selectedTests, setSelectedTests] = useState([]);
  const [priority, setPriority] = useState('routine');
  const [facility, setFacility] = useState('Toronto General Lab');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');

  const toggleTest = (test) => {
    setSelectedTests(prev => 
      prev.includes(test) ? prev.filter(t => t !== test) : [...prev, test]
    );
  };

  const handleSave = () => {
    if (selectedTests.length === 0) {
      toast.warning('Please select at least one test');
      return;
    }
    onSave({ tests: selectedTests, priority, facility, diagnosis, notes, patientId: patient?.id });
    toast.success(`${selectedTests.length} lab test(s) ordered from ${facility}`);
    setSelectedTests([]);
    setPriority('routine');
    setNotes('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-600 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-sky-400" />
            <h2 className="text-white font-medium">New Lab Order</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto flex-1">
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

          {/* Test Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Select Tests</label>
            <div className="space-y-3">
              {LAB_TESTS.map(category => (
                <div key={category.category}>
                  <p className="text-xs text-slate-500 mb-1">{category.category}</p>
                  <div className="flex flex-wrap gap-2">
                    {category.tests.map(test => (
                      <button
                        key={test}
                        onClick={() => toggleTest(test)}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                          selectedTests.includes(test)
                            ? 'bg-sky-600 border-sky-500 text-white'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-sky-500'
                        }`}
                      >
                        {test}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Tests Summary */}
          {selectedTests.length > 0 && (
            <div className="p-2 bg-sky-900/20 border border-sky-700 rounded">
              <p className="text-xs text-sky-400 mb-1">Selected: {selectedTests.length} tests</p>
              <p className="text-sm text-white">{selectedTests.join(', ')}</p>
            </div>
          )}

          {/* Priority & Facility */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              options={[
                { value: 'routine', label: 'Routine' },
                { value: 'urgent', label: 'Urgent' },
                { value: 'stat', label: 'STAT' },
              ]}
            />
            <Select
              label="Facility"
              value={facility}
              onChange={(e) => setFacility(e.target.value)}
              options={LAB_FACILITIES.map(f => ({ value: f, label: f }))}
            />
          </div>

          {/* Diagnosis & Notes */}
          <Input
            label="Clinical Indication"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Reason for ordering..."
          />
          <Input
            label="Special Instructions"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Fasting required, call with critical values, etc."
          />
        </div>

        <div className="px-4 py-3 bg-slate-900 border-t border-slate-700 flex items-center justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" icon={Send} onClick={handleSave} disabled={selectedTests.length === 0}>
            Send Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LabOrderModal;
