import React, { useState } from 'react';
import { X, Calendar, Clock, User, FileText, Save } from 'lucide-react';
import { Button, Input, Select } from '../components/ui';
import { useToast } from '../contexts';
import { MOCK_PATIENTS } from '../data';

const AppointmentModal = ({ isOpen, onClose, onSave }) => {
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    patientId: '',
    date: '',
    time: '',
    duration: '30',
    type: 'Office Visit',
    provider: 'Dr. Jide Grand',
    reason: '',
    notes: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.patientId || !formData.date || !formData.time || !formData.reason) {
      toast.warning('Please fill in all required fields');
      return;
    }

    const patient = MOCK_PATIENTS.find(p => p.id === formData.patientId);
    const endTime = calculateEndTime(formData.time, parseInt(formData.duration));

    const newAppointment = {
      id: `APT-${Date.now()}`,
      patientId: formData.patientId,
      patientName: patient?.name || 'Unknown',
      date: formData.date,
      time: formData.time,
      endTime,
      type: formData.type,
      provider: formData.provider,
      status: 'scheduled',
      reason: formData.reason,
      notes: formData.notes,
    };

    onSave(newAppointment);
    toast.success(`Appointment scheduled for ${patient?.name}`);
    
    // Reset form
    setFormData({
      patientId: '',
      date: '',
      time: '',
      duration: '30',
      type: 'Office Visit',
      provider: 'Dr. Jide Grand',
      reason: '',
      notes: '',
    });
    onClose();
  };

  const calculateEndTime = (startTime, durationMins) => {
    const [hours, mins] = startTime.split(':').map(Number);
    const totalMins = hours * 60 + mins + durationMins;
    const endHours = Math.floor(totalMins / 60);
    const endMins = totalMins % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-lg border border-slate-600 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-900/50 rounded-lg">
              <Calendar className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Schedule Appointment</h2>
              <p className="text-xs text-slate-400">Book a new patient appointment</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-4 space-y-4">
          {/* Patient Selection */}
          <Select
            label="Patient *"
            value={formData.patientId}
            onChange={(e) => handleChange('patientId', e.target.value)}
            options={[
              { value: '', label: 'Select a patient' },
              ...MOCK_PATIENTS.map(p => ({ value: p.id, label: `${p.name} (${p.mrn})` }))
            ]}
          />

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date *"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              icon={Calendar}
            />
            <Select
              label="Time *"
              value={formData.time}
              onChange={(e) => handleChange('time', e.target.value)}
              options={[
                { value: '', label: 'Select time' },
                ...timeSlots.map(t => ({ value: t, label: t }))
              ]}
            />
          </div>

          {/* Duration and Type */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Duration"
              value={formData.duration}
              onChange={(e) => handleChange('duration', e.target.value)}
              options={[
                { value: '15', label: '15 minutes' },
                { value: '30', label: '30 minutes' },
                { value: '45', label: '45 minutes' },
                { value: '60', label: '60 minutes' },
              ]}
            />
            <Select
              label="Appointment Type"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              options={[
                { value: 'Office Visit', label: 'Office Visit' },
                { value: 'Telemedicine', label: 'Telemedicine' },
                { value: 'Follow-up', label: 'Follow-up' },
                { value: 'New Patient', label: 'New Patient' },
                { value: 'Annual Physical', label: 'Annual Physical' },
                { value: 'Lab Review', label: 'Lab Review' },
                { value: 'Consultation', label: 'Consultation' },
              ]}
            />
          </div>

          {/* Provider */}
          <Select
            label="Provider"
            value={formData.provider}
            onChange={(e) => handleChange('provider', e.target.value)}
            options={[
              { value: 'Dr. Jide Grand', label: 'Dr. Jide Grand' },
              { value: 'Dr. Sarah Chen', label: 'Dr. Sarah Chen' },
              { value: 'Dr. Michael Torres', label: 'Dr. Michael Torres' },
            ]}
          />

          {/* Reason */}
          <Input
            label="Reason for Visit *"
            value={formData.reason}
            onChange={(e) => handleChange('reason', e.target.value)}
            placeholder="Brief description of visit purpose"
            icon={FileText}
          />

          {/* Notes */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Additional notes for this appointment..."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 resize-none"
              rows={3}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-4 py-3 bg-slate-900 border-t border-slate-700">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" icon={Save} onClick={handleSubmit}>
            Schedule Appointment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
