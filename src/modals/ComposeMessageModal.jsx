import React, { useState } from 'react';
import { X, Send, Paperclip, User, Users } from 'lucide-react';
import { Button, Input, Select } from '../components/ui';
import { useToast } from '../contexts';
import { MOCK_PATIENTS } from '../data';

const ComposeMessageModal = ({ isOpen, onClose, onSend, replyTo }) => {
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    recipientType: replyTo?.fromType || 'patient',
    recipientId: replyTo?.fromId || '',
    recipientName: replyTo?.from || '',
    subject: replyTo ? `Re: ${replyTo.subject}` : '',
    body: '',
    priority: 'normal',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-fill recipient name when selecting a patient
    if (field === 'recipientId' && formData.recipientType === 'patient') {
      const patient = MOCK_PATIENTS.find(p => p.id === value);
      if (patient) {
        setFormData(prev => ({ ...prev, recipientName: patient.name }));
      }
    }
  };

  const handleSend = () => {
    if (!formData.recipientId || !formData.subject || !formData.body) {
      toast.warning('Please fill in all required fields');
      return;
    }

    const newMessage = {
      id: `MSG-${Date.now()}`,
      type: 'sent',
      from: 'Dr. Jide Grand',
      fromType: 'provider',
      fromId: 'PROV-001',
      to: formData.recipientName,
      toType: formData.recipientType,
      toId: formData.recipientId,
      subject: formData.subject,
      body: formData.body,
      timestamp: new Date().toISOString(),
      read: true,
      starred: false,
      priority: formData.priority,
    };

    onSend(newMessage);
    toast.success('Message sent successfully');
    
    // Reset form
    setFormData({
      recipientType: 'patient',
      recipientId: '',
      recipientName: '',
      subject: '',
      body: '',
      priority: 'normal',
    });
    onClose();
  };

  const providers = [
    { id: 'PROV-002', name: 'Dr. Sarah Chen' },
    { id: 'PROV-003', name: 'Dr. Michael Torres' },
  ];

  const departments = [
    { id: 'LAB', name: 'Lab Services' },
    { id: 'RADIOLOGY', name: 'Radiology' },
    { id: 'PHARMACY', name: 'Pharmacy' },
    { id: 'BILLING', name: 'Billing' },
    { id: 'ADMIN', name: 'Administration' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl border border-slate-600 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-900/50 rounded-lg">
              <Send className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">New Message</h2>
              <p className="text-xs text-slate-400">Compose and send a secure message</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Recipient Type */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Recipient Type"
              value={formData.recipientType}
              onChange={(e) => {
                handleChange('recipientType', e.target.value);
                handleChange('recipientId', '');
                handleChange('recipientName', '');
              }}
              options={[
                { value: 'patient', label: 'Patient' },
                { value: 'provider', label: 'Provider' },
                { value: 'department', label: 'Department' },
              ]}
            />

            {/* Recipient Selection */}
            {formData.recipientType === 'patient' && (
              <Select
                label="Select Patient *"
                value={formData.recipientId}
                onChange={(e) => handleChange('recipientId', e.target.value)}
                options={[
                  { value: '', label: 'Choose a patient' },
                  ...MOCK_PATIENTS.map(p => ({ value: p.id, label: `${p.name} (${p.mrn})` }))
                ]}
              />
            )}
            {formData.recipientType === 'provider' && (
              <Select
                label="Select Provider *"
                value={formData.recipientId}
                onChange={(e) => {
                  handleChange('recipientId', e.target.value);
                  const prov = providers.find(p => p.id === e.target.value);
                  if (prov) handleChange('recipientName', prov.name);
                }}
                options={[
                  { value: '', label: 'Choose a provider' },
                  ...providers.map(p => ({ value: p.id, label: p.name }))
                ]}
              />
            )}
            {formData.recipientType === 'department' && (
              <Select
                label="Select Department *"
                value={formData.recipientId}
                onChange={(e) => {
                  handleChange('recipientId', e.target.value);
                  const dept = departments.find(d => d.id === e.target.value);
                  if (dept) handleChange('recipientName', dept.name);
                }}
                options={[
                  { value: '', label: 'Choose a department' },
                  ...departments.map(d => ({ value: d.id, label: d.name }))
                ]}
              />
            )}
          </div>

          {/* Subject and Priority */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Input
                label="Subject *"
                value={formData.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                placeholder="Enter message subject"
              />
            </div>
            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              options={[
                { value: 'normal', label: 'Normal' },
                { value: 'urgent', label: 'Urgent' },
              ]}
            />
          </div>

          {/* Message Body */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">Message *</label>
            <textarea
              value={formData.body}
              onChange={(e) => handleChange('body', e.target.value)}
              placeholder="Type your message here..."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 resize-none"
              rows={10}
            />
          </div>

          {/* Attachments hint */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Paperclip className="w-4 h-4" />
            <span>Attachments are not supported in this demo</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-t border-slate-700">
          <div className="text-xs text-slate-500">
            All messages are encrypted and HIPAA compliant
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onClose}>
              Discard
            </Button>
            <Button variant="primary" icon={Send} onClick={handleSend}>
              Send Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposeMessageModal;
