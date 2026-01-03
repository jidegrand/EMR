import React, { useState } from 'react';
import { 
  X, UserPlus, User, Phone, Mail, MapPin, CreditCard, 
  Heart, AlertTriangle, Save, RotateCcw 
} from 'lucide-react';
import { Button, Input, Select } from '../components/ui';
import { useToast } from '../contexts';

const PatientRegistrationModal = ({ isOpen, onClose, onSave }) => {
  const toast = useToast();
  
  const initialState = {
    // Personal Info
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    // Contact
    phone: '',
    email: '',
    address: '',
    city: '',
    province: 'ON',
    postalCode: '',
    // Insurance
    hcn: '',
    insuranceProvider: '',
    policyNumber: '',
    // Emergency Contact
    emergencyName: '',
    emergencyRelation: '',
    emergencyPhone: '',
    // Medical
    allergies: '',
    conditions: '',
    medications: '',
    primaryProvider: '',
    notes: '',
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('personal');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    
    // Format validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (formData.postalCode && !/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Invalid postal code (e.g., M5V 1K4)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.warning('Please complete all required fields');
      // Switch to tab with first error
      if (errors.firstName || errors.lastName || errors.dob || errors.gender) {
        setActiveTab('personal');
      } else if (errors.phone || errors.email || errors.postalCode) {
        setActiveTab('contact');
      }
      return;
    }

    // Generate MRN
    const mrn = `MRN-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    
    const newPatient = {
      id: `P-${Date.now()}`,
      mrn,
      ...formData,
      name: `${formData.firstName} ${formData.lastName}`,
      allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : [],
      conditions: formData.conditions ? formData.conditions.split(',').map(c => c.trim()) : [],
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    onSave(newPatient);
    toast.success(`Patient ${newPatient.name} registered successfully`);
    setFormData(initialState);
    setActiveTab('personal');
    onClose();
  };

  const handleReset = () => {
    setFormData(initialState);
    setErrors({});
    setActiveTab('personal');
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'insurance', label: 'Insurance', icon: CreditCard },
    { id: 'emergency', label: 'Emergency', icon: AlertTriangle },
    { id: 'medical', label: 'Medical', icon: Heart },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-3xl border border-slate-600 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-900/50 rounded-lg">
              <UserPlus className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">New Patient Registration</h2>
              <p className="text-xs text-slate-400">Enter patient information below</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700 bg-slate-850">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-teal-500 text-teal-400 bg-slate-800'
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name *"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  error={errors.firstName}
                  placeholder="Enter first name"
                />
                <Input
                  label="Last Name *"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  error={errors.lastName}
                  placeholder="Enter last name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Date of Birth *"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleChange('dob', e.target.value)}
                  error={errors.dob}
                />
                <Select
                  label="Gender *"
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  error={errors.gender}
                  options={[
                    { value: '', label: 'Select gender' },
                    { value: 'M', label: 'Male' },
                    { value: 'F', label: 'Female' },
                    { value: 'O', label: 'Other' },
                    { value: 'U', label: 'Prefer not to say' },
                  ]}
                />
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Phone Number *"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  error={errors.phone}
                  placeholder="(416) 555-0100"
                  icon={Phone}
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  error={errors.email}
                  placeholder="patient@email.com"
                  icon={Mail}
                />
              </div>
              <Input
                label="Street Address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="123 Main Street, Unit 4"
                icon={MapPin}
              />
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Toronto"
                />
                <Select
                  label="Province"
                  value={formData.province}
                  onChange={(e) => handleChange('province', e.target.value)}
                  options={[
                    { value: 'ON', label: 'Ontario' },
                    { value: 'BC', label: 'British Columbia' },
                    { value: 'AB', label: 'Alberta' },
                    { value: 'QC', label: 'Quebec' },
                    { value: 'MB', label: 'Manitoba' },
                    { value: 'SK', label: 'Saskatchewan' },
                    { value: 'NS', label: 'Nova Scotia' },
                    { value: 'NB', label: 'New Brunswick' },
                    { value: 'NL', label: 'Newfoundland' },
                    { value: 'PE', label: 'PEI' },
                  ]}
                />
                <Input
                  label="Postal Code"
                  value={formData.postalCode}
                  onChange={(e) => handleChange('postalCode', e.target.value.toUpperCase())}
                  error={errors.postalCode}
                  placeholder="M5V 1K4"
                />
              </div>
            </div>
          )}

          {/* Insurance Tab */}
          {activeTab === 'insurance' && (
            <div className="space-y-4">
              <Input
                label="Health Card Number (HCN)"
                value={formData.hcn}
                onChange={(e) => handleChange('hcn', e.target.value)}
                placeholder="1234-567-890"
                icon={CreditCard}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Insurance Provider"
                  value={formData.insuranceProvider}
                  onChange={(e) => handleChange('insuranceProvider', e.target.value)}
                  placeholder="Sun Life, Manulife, etc."
                />
                <Input
                  label="Policy Number"
                  value={formData.policyNumber}
                  onChange={(e) => handleChange('policyNumber', e.target.value)}
                  placeholder="POL-123456"
                />
              </div>
              <div className="p-3 bg-blue-900/20 border border-blue-700/50 rounded-lg">
                <p className="text-xs text-blue-300">
                  <strong>Note:</strong> OHIP coverage is verified automatically. Private insurance details are optional but recommended for faster claims processing.
                </p>
              </div>
            </div>
          )}

          {/* Emergency Contact Tab */}
          {activeTab === 'emergency' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-900/20 border border-amber-700/50 rounded-lg mb-4">
                <p className="text-xs text-amber-300">
                  <strong>Important:</strong> Emergency contact information is used in case of medical emergencies when the patient cannot be reached.
                </p>
              </div>
              <Input
                label="Contact Name"
                value={formData.emergencyName}
                onChange={(e) => handleChange('emergencyName', e.target.value)}
                placeholder="Full name"
                icon={User}
              />
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Relationship"
                  value={formData.emergencyRelation}
                  onChange={(e) => handleChange('emergencyRelation', e.target.value)}
                  options={[
                    { value: '', label: 'Select relationship' },
                    { value: 'Spouse', label: 'Spouse' },
                    { value: 'Parent', label: 'Parent' },
                    { value: 'Child', label: 'Child' },
                    { value: 'Sibling', label: 'Sibling' },
                    { value: 'Friend', label: 'Friend' },
                    { value: 'Other', label: 'Other' },
                  ]}
                />
                <Input
                  label="Phone Number"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleChange('emergencyPhone', e.target.value)}
                  placeholder="(416) 555-0100"
                  icon={Phone}
                />
              </div>
            </div>
          )}

          {/* Medical Tab */}
          {activeTab === 'medical' && (
            <div className="space-y-4">
              <div className="p-3 bg-rose-900/20 border border-rose-700/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span className="text-sm font-medium text-rose-400">Allergies</span>
                </div>
                <Input
                  value={formData.allergies}
                  onChange={(e) => handleChange('allergies', e.target.value)}
                  placeholder="Penicillin, Sulfa, Latex (comma separated)"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Current Medical Conditions</label>
                <textarea
                  value={formData.conditions}
                  onChange={(e) => handleChange('conditions', e.target.value)}
                  placeholder="Diabetes, Hypertension, Asthma (comma separated)"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 resize-none"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Current Medications</label>
                <textarea
                  value={formData.medications}
                  onChange={(e) => handleChange('medications', e.target.value)}
                  placeholder="Metformin 500mg BID, Lisinopril 10mg daily"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 resize-none"
                  rows={2}
                />
              </div>
              <Input
                label="Primary Care Provider"
                value={formData.primaryProvider}
                onChange={(e) => handleChange('primaryProvider', e.target.value)}
                placeholder="Dr. Smith"
              />
              <div>
                <label className="block text-xs text-slate-400 mb-1">Additional Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Any additional information..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 resize-none"
                  rows={2}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-t border-slate-700">
          <Button variant="ghost" size="sm" icon={RotateCcw} onClick={handleReset}>
            Reset Form
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" icon={Save} onClick={handleSubmit}>
              Register Patient
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistrationModal;
