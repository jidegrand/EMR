import React, { useState, useEffect, useCallback } from 'react';
import { 
  Home, Users, FileText, Pill, FlaskConical, Share2, Clock, Search, Bell, 
  Settings, LogOut, ChevronRight, ChevronDown, Plus, Filter, MoreVertical,
  User, Calendar, Activity, Heart, Thermometer, Weight, AlertCircle, 
  CheckCircle, XCircle, Edit3, Save, Send, Printer, Download, Eye,
  Stethoscope, ClipboardList, MessageSquare, Phone, Video, Shield,
  TrendingUp, TrendingDown, Minus, RefreshCw, AlertTriangle, Info,
  ChevronLeft, X, Check, FileCheck, Zap, Brain, Mic, Camera, Paperclip,
  Building2, MapPin, Mail, CreditCard, History, ExternalLink, Copy,
  Trash2, Archive, RotateCcw, FileSignature, Clipboard, TestTube,
  UserPlus, CalendarDays, CircleDot, Lock, KeyRound, Smartphone,
  ShieldCheck, Fingerprint, EyeOff, AlertOctagon, Timer, LogIn
} from 'lucide-react';

// ============================================================================
// AUTHENTICATION CONFIGURATION
// ============================================================================

const AUTH_CONFIG = {
  sessionTimeoutMinutes: 15,
  maxLoginAttempts: 3,
  pinLength: 6,
  twoFactorCodeLength: 6,
};

const MOCK_USERS = {
  'jide.grand@extendilite.com': {
    id: 'USR-001',
    email: 'jide.grand@extendilite.com',
    password: 'SecurePass123!',
    pin: '123456',
    name: 'Dr. Jide Grand',
    role: 'provider',
    specialty: 'Internal Medicine',
    npi: '1234567890',
    permissions: ['dashboard', 'patients', 'encounters', 'prescriptions', 'labs', 'referrals'],
    avatar: 'JG',
    phone: '+1 (416) 555-0199',
  },
  'nurse.sarah@extendilite.com': {
    id: 'USR-002',
    email: 'nurse.sarah@extendilite.com',
    password: 'NursePass123!',
    pin: '654321',
    name: 'Sarah Johnson, RN',
    role: 'nurse',
    specialty: 'Clinical Nurse',
    npi: '',
    permissions: ['dashboard', 'patients', 'encounters', 'labs'],
    avatar: 'SJ',
    phone: '+1 (416) 555-0200',
  }
};

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_PATIENTS_QUEUE = [
  { id: 'P-001', name: 'Sarah Mitchell', age: 34, gender: 'F', reason: 'Persistent cough, mild fever', urgency: 'moderate', waitTime: 12, vitals: { bp: '118/76', hr: 82, temp: 37.8, spo2: 97 }, source: 'KIOSK', triageScore: 6 },
  { id: 'P-002', name: 'James Wilson', age: 58, gender: 'M', reason: 'Chest tightness, shortness of breath', urgency: 'high', waitTime: 3, vitals: { bp: '142/88', hr: 96, temp: 37.1, spo2: 94 }, source: 'KIOSK', triageScore: 8 },
  { id: 'P-003', name: 'Emily Chen', age: 27, gender: 'F', reason: 'Prescription refill - birth control', urgency: 'low', waitTime: 25, vitals: { bp: '110/70', hr: 68, temp: 36.8, spo2: 99 }, source: 'Mobile', triageScore: 2 },
  { id: 'P-004', name: 'Robert Garcia', age: 45, gender: 'M', reason: 'Follow-up: Hypertension management', urgency: 'low', waitTime: 18, vitals: { bp: '128/82', hr: 74, temp: 36.9, spo2: 98 }, source: 'KIOSK', triageScore: 3 },
  { id: 'P-005', name: 'Maria Santos', age: 62, gender: 'F', reason: 'Severe headache, nausea', urgency: 'high', waitTime: 5, vitals: { bp: '158/94', hr: 88, temp: 37.2, spo2: 97 }, source: 'KIOSK', triageScore: 7 },
];

const MOCK_ALL_PATIENTS = [
  { id: 'P-001', mrn: 'MRN-2024-34001', name: 'Sarah Mitchell', age: 34, gender: 'F', dob: '1990-05-12', phone: '+1 (416) 555-0101', email: 'sarah.m@email.com', lastVisit: '2024-12-16', conditions: ['Asthma'], status: 'active' },
  { id: 'P-002', mrn: 'MRN-2024-58291', name: 'James Wilson', age: 58, gender: 'M', dob: '1966-08-14', phone: '+1 (416) 555-0147', email: 'jwilson@email.com', lastVisit: '2024-12-16', conditions: ['Hypertension', 'Diabetes'], status: 'active' },
  { id: 'P-003', mrn: 'MRN-2024-27003', name: 'Emily Chen', age: 27, gender: 'F', dob: '1997-03-22', phone: '+1 (416) 555-0103', email: 'emily.chen@email.com', lastVisit: '2024-12-16', conditions: [], status: 'active' },
  { id: 'P-004', mrn: 'MRN-2024-45004', name: 'Robert Garcia', age: 45, gender: 'M', dob: '1979-11-08', phone: '+1 (416) 555-0104', email: 'rgarcia@email.com', lastVisit: '2024-12-15', conditions: ['Hypertension'], status: 'active' },
  { id: 'P-005', mrn: 'MRN-2024-62005', name: 'Maria Santos', age: 62, gender: 'F', dob: '1962-07-30', phone: '+1 (416) 555-0105', email: 'msantos@email.com', lastVisit: '2024-12-16', conditions: ['Migraine', 'Arthritis'], status: 'active' },
  { id: 'P-006', mrn: 'MRN-2024-41006', name: 'David Kim', age: 41, gender: 'M', dob: '1983-01-15', phone: '+1 (416) 555-0106', email: 'dkim@email.com', lastVisit: '2024-12-10', conditions: ['Anxiety'], status: 'active' },
  { id: 'P-007', mrn: 'MRN-2024-55007', name: 'Linda Johnson', age: 55, gender: 'F', dob: '1969-09-03', phone: '+1 (416) 555-0107', email: 'ljohnson@email.com', lastVisit: '2024-12-08', conditions: ['Hypothyroidism'], status: 'active' },
  { id: 'P-008', mrn: 'MRN-2024-29008', name: 'Michael Brown', age: 29, gender: 'M', dob: '1995-12-20', phone: '+1 (416) 555-0108', email: 'mbrown@email.com', lastVisit: '2024-11-28', conditions: [], status: 'inactive' },
];

const MOCK_ENCOUNTERS = [
  { id: 'E-001', patientId: 'P-002', patientName: 'James Wilson', date: '2024-12-16', time: '10:30 AM', type: 'Telemedicine', reason: 'Chest tightness', provider: 'Dr. Jide Grand', status: 'in-progress', diagnosis: 'Angina pectoris', icd10: 'I20.9' },
  { id: 'E-002', patientId: 'P-001', patientName: 'Sarah Mitchell', date: '2024-12-16', time: '09:15 AM', type: 'KIOSK Visit', reason: 'Persistent cough', provider: 'Dr. Jide Grand', status: 'completed', diagnosis: 'Acute bronchitis', icd10: 'J20.9' },
  { id: 'E-003', patientId: 'P-005', patientName: 'Maria Santos', date: '2024-12-16', time: '11:00 AM', type: 'Telemedicine', reason: 'Severe headache', provider: 'Dr. Jide Grand', status: 'pending', diagnosis: '', icd10: '' },
  { id: 'E-004', patientId: 'P-004', patientName: 'Robert Garcia', date: '2024-12-15', time: '02:30 PM', type: 'Follow-up', reason: 'Hypertension management', provider: 'Dr. Jide Grand', status: 'completed', diagnosis: 'Essential hypertension', icd10: 'I10' },
  { id: 'E-005', patientId: 'P-003', patientName: 'Emily Chen', date: '2024-12-15', time: '10:00 AM', type: 'KIOSK Visit', reason: 'Prescription refill', provider: 'Dr. Jide Grand', status: 'completed', diagnosis: 'Contraceptive management', icd10: 'Z30.41' },
];

const MOCK_PRESCRIPTIONS = [
  { id: 'RX-001', patientId: 'P-002', patientName: 'James Wilson', drug: 'Metoprolol', strength: '50mg', form: 'Tablet', quantity: 30, refills: 3, sig: 'Take one tablet by mouth twice daily', status: 'active', prescribedDate: '2024-12-16', pharmacy: 'Main Street Pharmacy', provider: 'Dr. Jide Grand' },
  { id: 'RX-002', patientId: 'P-002', patientName: 'James Wilson', drug: 'Aspirin', strength: '81mg', form: 'Tablet', quantity: 90, refills: 5, sig: 'Take one tablet by mouth daily', status: 'active', prescribedDate: '2024-12-16', pharmacy: 'Main Street Pharmacy', provider: 'Dr. Jide Grand' },
  { id: 'RX-003', patientId: 'P-001', patientName: 'Sarah Mitchell', drug: 'Azithromycin', strength: '250mg', form: 'Tablet', quantity: 6, refills: 0, sig: 'Take two tablets on day 1, then one tablet daily for 4 days', status: 'active', prescribedDate: '2024-12-16', pharmacy: 'Community Pharmacy', provider: 'Dr. Jide Grand' },
  { id: 'RX-004', patientId: 'P-003', patientName: 'Emily Chen', drug: 'Norethindrone-Ethinyl Estradiol', strength: '1mg-20mcg', form: 'Tablet', quantity: 84, refills: 3, sig: 'Take one tablet by mouth daily', status: 'active', prescribedDate: '2024-12-15', pharmacy: 'Main Street Pharmacy', provider: 'Dr. Jide Grand' },
  { id: 'RX-005', patientId: 'P-004', patientName: 'Robert Garcia', drug: 'Lisinopril', strength: '20mg', form: 'Tablet', quantity: 30, refills: 5, sig: 'Take one tablet by mouth daily in the morning', status: 'active', prescribedDate: '2024-12-15', pharmacy: 'Community Pharmacy', provider: 'Dr. Jide Grand' },
];

const MOCK_LAB_ORDERS = [
  { id: 'LAB-001', patientId: 'P-002', patientName: 'James Wilson', tests: ['Troponin I', 'BNP', 'CBC', 'BMP'], priority: 'stat', status: 'pending', orderedDate: '2024-12-16', orderedBy: 'Dr. Jide Grand', facility: 'Toronto General Lab', notes: 'Rule out ACS' },
  { id: 'LAB-002', patientId: 'P-005', patientName: 'Maria Santos', tests: ['CBC', 'CMP', 'ESR', 'CRP'], priority: 'routine', status: 'pending', orderedDate: '2024-12-16', orderedBy: 'Dr. Jide Grand', facility: 'Community Lab Services', notes: 'Evaluate for inflammatory process' },
  { id: 'LAB-003', patientId: 'P-004', patientName: 'Robert Garcia', tests: ['Lipid Panel', 'HbA1c', 'CMP'], priority: 'routine', status: 'completed', orderedDate: '2024-12-10', orderedBy: 'Dr. Jide Grand', facility: 'Toronto General Lab', notes: 'Annual metabolic panel' },
  { id: 'LAB-004', patientId: 'P-001', patientName: 'Sarah Mitchell', tests: ['CBC', 'CMP'], priority: 'routine', status: 'resulted', orderedDate: '2024-12-14', orderedBy: 'Dr. Jide Grand', facility: 'Toronto General Lab', notes: 'Pre-treatment baseline' },
];

const MOCK_REFERRALS = [
  { id: 'REF-001', patientId: 'P-002', patientName: 'James Wilson', specialty: 'Cardiology', provider: 'Dr. Michael Chang', facility: 'Toronto Heart Institute', reason: 'Evaluation of chest pain and possible angina', priority: 'urgent', status: 'pending', referredDate: '2024-12-16', referredBy: 'Dr. Jide Grand', notes: 'Patient with multiple cardiac risk factors' },
  { id: 'REF-002', patientId: 'P-005', patientName: 'Maria Santos', specialty: 'Neurology', provider: 'Dr. Sarah Lee', facility: 'University Neurology Clinic', reason: 'Chronic migraine management', priority: 'routine', status: 'scheduled', referredDate: '2024-12-16', referredBy: 'Dr. Jide Grand', appointmentDate: '2024-12-28', notes: 'Increasing frequency of migraines' },
  { id: 'REF-003', patientId: 'P-004', patientName: 'Robert Garcia', specialty: 'Ophthalmology', provider: 'Dr. James Park', facility: 'Vision Care Center', reason: 'Diabetic retinopathy screening', priority: 'routine', status: 'completed', referredDate: '2024-11-20', referredBy: 'Dr. Jide Grand', appointmentDate: '2024-12-05', notes: 'Annual diabetic eye exam' },
];

const MOCK_PATIENT_DETAIL = {
  id: 'P-002', mrn: 'MRN-2024-58291', name: 'James Wilson', dob: '1966-08-14', age: 58, gender: 'Male',
  phone: '+1 (416) 555-0147', email: 'jwilson@email.com', healthCard: '1234-567-890-JW',
  address: '456 Oak Street, Toronto, ON M5V 2K8',
  emergencyContact: { name: 'Linda Wilson', relationship: 'Spouse', phone: '+1 (416) 555-0148' },
  allergies: ['Penicillin', 'Sulfa drugs'],
  conditions: ['Hypertension', 'Type 2 Diabetes', 'Hyperlipidemia'],
  medications: [
    { name: 'Metformin', dose: '500mg', frequency: 'Twice daily' },
    { name: 'Lisinopril', dose: '10mg', frequency: 'Once daily' },
    { name: 'Atorvastatin', dose: '20mg', frequency: 'Once daily at bedtime' },
  ],
  recentVitals: [
    { date: '2024-12-16', bp: '142/88', hr: 96, temp: 37.1, spo2: 94, weight: 187 },
    { date: '2024-12-01', bp: '138/84', hr: 78, temp: 36.9, spo2: 98, weight: 189 },
  ],
  triageData: {
    primarySymptom: 'Chest tightness and shortness of breath during mild exertion',
    duration: '3 days', severity: 8,
    additionalInfo: 'No radiating pain. Worse when climbing stairs.',
    aiAssessment: {
      conditions: [
        { name: 'Angina Pectoris', probability: 45 },
        { name: 'Anxiety-related chest tightness', probability: 30 },
        { name: 'Costochondritis', probability: 15 },
        { name: 'GERD', probability: 10 },
      ],
      urgency: 'high',
      recommendations: ['ECG recommended', 'Cardiac enzymes if indicated', 'Stress test consideration']
    }
  },
  recentLabs: [
    { date: '2024-12-10', name: 'HbA1c', value: '7.2%', status: 'high', range: '<7.0%' },
    { date: '2024-12-10', name: 'LDL Cholesterol', value: '125 mg/dL', status: 'high', range: '<100 mg/dL' },
    { date: '2024-12-10', name: 'eGFR', value: '72 mL/min', status: 'normal', range: '>60 mL/min' },
  ],
  encounters: [
    { date: '2024-12-01', type: 'Follow-up', provider: 'Dr. Chen', summary: 'BP slightly elevated. Increased Lisinopril.' },
    { date: '2024-11-15', type: 'Annual Physical', provider: 'Dr. Patel', summary: 'Overall stable. Ordered routine labs.' },
  ]
};

// ============================================================================
// SHARED COMPONENTS
// ============================================================================

const Badge = ({ children, variant = 'default', size = 'sm' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-rose-100 text-rose-700',
    info: 'bg-sky-100 text-sky-700',
    purple: 'bg-violet-100 text-violet-700',
  };
  const sizes = { xs: 'px-1.5 py-0.5 text-xs', sm: 'px-2 py-0.5 text-xs', md: 'px-2.5 py-1 text-sm' };
  return <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]}`}>{children}</span>;
};

const Button = ({ children, variant = 'primary', size = 'md', icon: Icon, onClick, disabled, className = '', type = 'button' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 shadow-md shadow-teal-500/20',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300',
    ghost: 'text-slate-600 hover:bg-slate-100',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700',
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      {Icon && <Icon className="w-4 h-4" />}{children}
    </button>
  );
};

const Card = ({ children, className = '', padding = 'p-4' }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${padding} ${className}`}>{children}</div>
);

const Input = ({ label, type = 'text', value, onChange, placeholder, icon: Icon, className = '', error, rightIcon: RightIcon, onRightIconClick }) => (
  <div className={className}>
    {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
    <div className="relative">
      {Icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icon className="w-4 h-4" /></div>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all ${Icon ? 'pl-10' : ''} ${RightIcon ? 'pr-10' : ''} ${error ? 'border-rose-300 bg-rose-50' : 'border-slate-200'}`} />
      {RightIcon && <button type="button" onClick={onRightIconClick} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><RightIcon className="w-4 h-4" /></button>}
    </div>
    {error && <p className="text-rose-600 text-xs mt-1">{error}</p>}
  </div>
);

const Select = ({ label, value, onChange, options, className = '' }) => (
  <div className={className}>
    {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
    <select value={value} onChange={onChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white">
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

const VitalCard = ({ icon: Icon, label, value, unit, status, trend }) => {
  const statusColors = { normal: 'text-emerald-600 bg-emerald-50 border-emerald-200', high: 'text-rose-600 bg-rose-50 border-rose-200', low: 'text-amber-600 bg-amber-50 border-amber-200' };
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  return (
    <div className={`p-3 rounded-xl border ${statusColors[status] || 'border-slate-200 bg-slate-50'}`}>
      <div className="flex items-center justify-between mb-1"><Icon className="w-4 h-4 opacity-70" />{trend && <TrendIcon className="w-3 h-3 opacity-50" />}</div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs opacity-70">{label} {unit && <span className="font-normal">({unit})</span>}</div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const configs = {
    'active': { variant: 'success', label: 'Active' }, 'inactive': { variant: 'default', label: 'Inactive' },
    'pending': { variant: 'warning', label: 'Pending' }, 'completed': { variant: 'success', label: 'Completed' },
    'in-progress': { variant: 'info', label: 'In Progress' }, 'cancelled': { variant: 'danger', label: 'Cancelled' },
    'discontinued': { variant: 'danger', label: 'Discontinued' }, 'stat': { variant: 'danger', label: 'STAT' },
    'routine': { variant: 'default', label: 'Routine' }, 'urgent': { variant: 'warning', label: 'Urgent' },
    'scheduled': { variant: 'info', label: 'Scheduled' }, 'resulted': { variant: 'purple', label: 'Resulted' },
  };
  const config = configs[status] || { variant: 'default', label: status };
  return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
};

const Table = ({ columns, data, onRowClick }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead><tr className="border-b border-slate-200">{columns.map((col, i) => <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{col.header}</th>)}</tr></thead>
      <tbody className="divide-y divide-slate-100">
        {data.map((row, ri) => (
          <tr key={ri} onClick={() => onRowClick?.(row)} className={`hover:bg-slate-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}>
            {columns.map((col, ci) => <td key={ci} className={`px-4 py-3 ${col.cellClassName || ''}`}>{col.render ? col.render(row) : row[col.accessor]}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ============================================================================
// AUTHENTICATION COMPONENTS
// ============================================================================

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = MOCK_USERS[email.toLowerCase()];
    if (user && user.password === password) {
      onLogin(user, 'pin');
    } else {
      setLoginAttempts(prev => prev + 1);
      if (loginAttempts >= AUTH_CONFIG.maxLoginAttempts - 1) {
        setError('Account locked. Too many failed attempts. Please contact IT support.');
      } else {
        setError(`Invalid credentials. ${AUTH_CONFIG.maxLoginAttempts - loginAttempts - 1} attempts remaining.`);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl shadow-lg shadow-teal-500/30 mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">ExtendiLite EMR</h1>
          <p className="text-slate-400">Provider Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Sign In</h2>
            <p className="text-sm text-slate-500">Enter your credentials to access the portal</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-sm">
              <AlertOctagon className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="provider@extendilite.com"
              icon={Mail}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              icon={Lock}
              rightIcon={showPassword ? EyeOff : Eye}
              onRightIconClick={() => setShowPassword(!showPassword)}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                Remember this device
              </label>
              <button type="button" className="text-teal-600 hover:text-teal-700 font-medium">
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              size="lg"
              icon={isLoading ? RefreshCw : LogIn}
              disabled={isLoading || loginAttempts >= AUTH_CONFIG.maxLoginAttempts}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Demo Credentials</p>
            <p className="text-xs text-slate-600">Email: jide.grand@extendilite.com</p>
            <p className="text-xs text-slate-600">Password: SecurePass123!</p>
          </div>
        </div>

        {/* HIPAA Compliance Footer */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-900/30 border border-emerald-600/30 rounded-lg">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-sky-900/30 border border-sky-600/30 rounded-lg">
            <Lock className="w-4 h-4 text-sky-400" />
            <span className="text-xs text-sky-400 font-medium">256-bit Encryption</span>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Protected health information (PHI) access is logged and monitored.
        </p>
      </div>
    </div>
  );
};

const PinScreen = ({ user, onVerify, onBack }) => {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = Array(6).fill(null).map(() => React.createRef());

  const handlePinChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    setError('');

    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredPin = pin.join('');
    if (enteredPin.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    if (enteredPin === user.pin) {
      onVerify('2fa');
    } else {
      setError('Invalid PIN. Please try again.');
      setPin(['', '', '', '', '', '']);
      inputRefs[0].current?.focus();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  useEffect(() => {
    if (pin.every(d => d !== '')) {
      handleVerify();
    }
  }, [pin]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-lg shadow-violet-500/30 mb-4">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Enter PIN</h1>
          <p className="text-slate-400">Welcome back, {user.name}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6 text-center">
            <p className="text-sm text-slate-600">Enter your 6-digit security PIN</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-center gap-2 text-rose-700 text-sm">
              <AlertOctagon className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="flex justify-center gap-3 mb-6">
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
              />
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={onBack} icon={ChevronLeft}>
              Back
            </Button>
            <Button 
              variant="primary" 
              className="flex-1" 
              onClick={handleVerify}
              disabled={isLoading}
              icon={isLoading ? RefreshCw : Check}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
          </div>

          <div className="mt-6 p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <p className="text-xs text-slate-500">Demo PIN: 123456</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-900/30 border border-amber-600/30 rounded-lg">
            <Fingerprint className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-amber-400 font-medium">Biometric Available</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TwoFactorScreen = ({ user, onVerify, onBack }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = Array(6).fill(null).map(() => React.createRef());

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError('');

    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredCode = code.join('');
    if (enteredCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    // For demo, accept any 6-digit code
    if (enteredCode.length === 6) {
      onVerify('authenticated');
    } else {
      setError('Invalid code. Please try again.');
      setCode(['', '', '', '', '', '']);
      inputRefs[0].current?.focus();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  useEffect(() => {
    if (code.every(d => d !== '')) {
      handleVerify();
    }
  }, [code]);

  const maskedPhone = user.phone.replace(/(\+\d{1,2})\s*\((\d{3})\)\s*(\d{3})-(\d{4})/, '$1 (***) ***-$4');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl shadow-lg shadow-sky-500/30 mb-4">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Two-Factor Authentication</h1>
          <p className="text-slate-400">One more step to secure your session</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6 text-center">
            <p className="text-sm text-slate-600">
              We sent a verification code to<br />
              <span className="font-medium text-slate-900">{maskedPhone}</span>
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-center gap-2 text-rose-700 text-sm">
              <AlertOctagon className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="flex justify-center gap-3 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
              />
            ))}
          </div>

          <div className="flex gap-3 mb-4">
            <Button variant="secondary" className="flex-1" onClick={onBack} icon={ChevronLeft}>
              Back
            </Button>
            <Button 
              variant="primary" 
              className="flex-1" 
              onClick={handleVerify}
              disabled={isLoading}
              icon={isLoading ? RefreshCw : ShieldCheck}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
          </div>

          <div className="text-center">
            {resendTimer > 0 ? (
              <p className="text-sm text-slate-500">Resend code in {resendTimer}s</p>
            ) : (
              <button 
                onClick={() => setResendTimer(30)} 
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                Resend verification code
              </button>
            )}
          </div>

          <div className="mt-6 p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <p className="text-xs text-slate-500">Demo: Enter any 6 digits</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-900/30 border border-emerald-600/30 rounded-lg">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">Secure Session</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SIDEBAR
// ============================================================================

const Sidebar = ({ activeSection, onNavigate, onLogout, user }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', badge: 5 },
    { id: 'patients', icon: Users, label: 'Patients' },
    { id: 'encounters', icon: FileText, label: 'Encounters' },
    { id: 'prescriptions', icon: Pill, label: 'Prescriptions' },
    { id: 'labs', icon: FlaskConical, label: 'Lab Orders' },
    { id: 'referrals', icon: Share2, label: 'Referrals' },
  ].filter(item => user.permissions.includes(item.id));

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col h-screen fixed left-0 top-0">
      <div className="p-5 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30"><Stethoscope className="w-5 h-5 text-white" /></div>
          <div><div className="font-bold text-lg tracking-tight">ExtendiLite</div><div className="text-xs text-slate-400">EMR Provider Portal</div></div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => (
          <button key={item.id} onClick={() => onNavigate(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === item.id ? 'bg-gradient-to-r from-teal-600/20 to-cyan-600/20 text-teal-400 border border-teal-500/30' : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'}`}>
            <item.icon className="w-5 h-5" /><span className="font-medium">{item.label}</span>
            {item.badge && <span className="ml-auto bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">{item.badge}</span>}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold">{user.avatar}</div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">{user.name}</div>
            <div className="text-xs text-slate-400 capitalize">{user.role} • {user.specialty}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"><Settings className="w-4 h-4 mx-auto text-slate-400" /></button>
          <button onClick={onLogout} className="flex-1 p-2 rounded-lg bg-slate-700/50 hover:bg-rose-600/20 hover:text-rose-400 transition-colors" title="Sign Out"><LogOut className="w-4 h-4 mx-auto text-slate-400" /></button>
        </div>
      </div>
      <div className="p-4"><div className="bg-emerald-900/30 border border-emerald-600/30 rounded-xl p-3 flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-400" /><span className="text-xs text-emerald-400 font-medium">HIPAA Compliant</span></div></div>
    </div>
  );
};

// ============================================================================
// HEADER WITH SESSION INFO
// ============================================================================

const Header = ({ title, subtitle, user, sessionTime, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const formatSessionTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <div><h1 className="text-xl font-bold text-slate-900">{title}</h1>{subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}</div>
      <div className="flex items-center gap-4">
        {/* Session Timer */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${sessionTime < 120 ? 'bg-rose-50 text-rose-600' : sessionTime < 300 ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
          <Timer className="w-4 h-4" />
          <span className="text-sm font-medium">{formatSessionTime(sessionTime)}</span>
        </div>

        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search patients, orders..." className="w-64 pl-10 pr-4 py-2 bg-slate-100 border-0 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all" /></div>
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"><Bell className="w-5 h-5" /><span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" /></button>
        <div className="h-8 w-px bg-slate-200" />
        <div className="text-right"><div className="text-sm font-medium text-slate-700">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</div><div className="text-xs text-slate-500">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div></div>
      </div>
    </header>
  );
};

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

const StatCard = ({ icon: Icon, value, label, color }) => (
  <Card className="flex items-center gap-4">
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}><Icon className="w-6 h-6" /></div>
    <div><div className="text-2xl font-bold text-slate-900">{value}</div><div className="text-sm text-slate-500">{label}</div></div>
  </Card>
);

const PatientsSection = ({ onSelectPatient }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const filtered = MOCK_ALL_PATIENTS.filter(p => (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.mrn.toLowerCase().includes(searchQuery.toLowerCase())) && (statusFilter === 'all' || p.status === statusFilter));
  const columns = [
    { header: 'Patient', render: (r) => <div className="flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-white text-sm font-medium">{r.name.split(' ').map(n => n[0]).join('')}</div><div><div className="font-medium text-slate-900">{r.name}</div><div className="text-xs text-slate-500">{r.mrn}</div></div></div> },
    { header: 'Age/Gender', render: (r) => <span className="text-slate-600">{r.age}yo {r.gender}</span> },
    { header: 'Phone', render: (r) => <span className="text-slate-600">{r.phone}</span> },
    { header: 'Last Visit', render: (r) => <span className="text-slate-600">{r.lastVisit}</span> },
    { header: 'Conditions', render: (r) => <div className="flex flex-wrap gap-1">{r.conditions.length > 0 ? r.conditions.slice(0, 2).map((c, i) => <Badge key={i} variant="warning" size="xs">{c}</Badge>) : <span className="text-slate-400 text-sm">None</span>}</div> },
    { header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { header: '', render: () => <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><MoreVertical className="w-4 h-4" /></button> }
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Users} value={MOCK_ALL_PATIENTS.length} label="Total Patients" color="bg-teal-100 text-teal-600" />
        <StatCard icon={UserPlus} value="12" label="New This Month" color="bg-emerald-100 text-emerald-600" />
        <StatCard icon={CalendarDays} value="5" label="Today's Visits" color="bg-sky-100 text-sky-600" />
        <StatCard icon={Activity} value={MOCK_ALL_PATIENTS.filter(p => p.status === 'active').length} label="Active Patients" color="bg-violet-100 text-violet-600" />
      </div>
      <Card padding="p-0">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Input placeholder="Search patients..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} icon={Search} className="w-64" />
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={[{ value: 'all', label: 'All Status' }, { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} className="w-36" />
          </div>
          <Button variant="primary" icon={Plus}>Add Patient</Button>
        </div>
        <Table columns={columns} data={filtered} onRowClick={onSelectPatient} />
      </Card>
    </div>
  );
};

const EncountersSection = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const filtered = MOCK_ENCOUNTERS.filter(e => statusFilter === 'all' || e.status === statusFilter);
  const columns = [
    { header: 'Patient', render: (r) => <div><div className="font-medium text-slate-900">{r.patientName}</div><div className="text-xs text-slate-500">{r.patientId}</div></div> },
    { header: 'Date/Time', render: (r) => <div><div className="text-slate-900">{r.date}</div><div className="text-xs text-slate-500">{r.time}</div></div> },
    { header: 'Type', render: (r) => <Badge variant="info" size="sm">{r.type}</Badge> },
    { header: 'Reason', render: (r) => <span className="text-slate-600">{r.reason}</span> },
    { header: 'Diagnosis', render: (r) => r.diagnosis ? <div><div className="text-slate-900 text-sm">{r.diagnosis}</div><div className="text-xs text-slate-500 font-mono">{r.icd10}</div></div> : <span className="text-slate-400 text-sm">Pending</span> },
    { header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { header: 'Actions', render: () => <div className="flex items-center gap-1"><button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg"><Eye className="w-4 h-4" /></button><button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><Edit3 className="w-4 h-4" /></button><button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><Printer className="w-4 h-4" /></button></div> }
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={FileText} value={MOCK_ENCOUNTERS.length} label="Total Encounters" color="bg-sky-100 text-sky-600" />
        <StatCard icon={Clock} value={MOCK_ENCOUNTERS.filter(e => e.status === 'pending').length} label="Pending" color="bg-amber-100 text-amber-600" />
        <StatCard icon={CircleDot} value={MOCK_ENCOUNTERS.filter(e => e.status === 'in-progress').length} label="In Progress" color="bg-teal-100 text-teal-600" />
        <StatCard icon={CheckCircle} value={MOCK_ENCOUNTERS.filter(e => e.status === 'completed').length} label="Completed" color="bg-emerald-100 text-emerald-600" />
      </div>
      <Card padding="p-0">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={[{ value: 'all', label: 'All Status' }, { value: 'pending', label: 'Pending' }, { value: 'in-progress', label: 'In Progress' }, { value: 'completed', label: 'Completed' }]} className="w-40" />
          <Button variant="primary" icon={Plus}>New Encounter</Button>
        </div>
        <Table columns={columns} data={filtered} />
      </Card>
    </div>
  );
};

const PrescriptionsSection = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const filtered = MOCK_PRESCRIPTIONS.filter(rx => statusFilter === 'all' || rx.status === statusFilter);
  const columns = [
    { header: 'Patient', render: (r) => <div><div className="font-medium text-slate-900">{r.patientName}</div><div className="text-xs text-slate-500">{r.patientId}</div></div> },
    { header: 'Medication', render: (r) => <div className="flex items-center gap-3"><div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center"><Pill className="w-5 h-5 text-teal-600" /></div><div><div className="font-medium text-slate-900">{r.drug} {r.strength}</div><div className="text-xs text-slate-500">{r.form}</div></div></div> },
    { header: 'Sig', render: (r) => <span className="text-slate-600 text-sm">{r.sig}</span>, cellClassName: 'max-w-xs' },
    { header: 'Qty', render: (r) => <span className="text-slate-900 font-medium">{r.quantity}</span> },
    { header: 'Refills', render: (r) => <span className="text-slate-600">{r.refills}</span> },
    { header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { header: 'Actions', render: () => <div className="flex items-center gap-1"><button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg"><RefreshCw className="w-4 h-4" /></button><button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><Printer className="w-4 h-4" /></button></div> }
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Pill} value={MOCK_PRESCRIPTIONS.length} label="Total Prescriptions" color="bg-teal-100 text-teal-600" />
        <StatCard icon={CheckCircle} value={MOCK_PRESCRIPTIONS.filter(rx => rx.status === 'active').length} label="Active" color="bg-emerald-100 text-emerald-600" />
        <StatCard icon={AlertTriangle} value="3" label="Refill Requests" color="bg-amber-100 text-amber-600" />
        <StatCard icon={Send} value="28" label="Sent This Month" color="bg-sky-100 text-sky-600" />
      </div>
      <Card padding="p-0">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={[{ value: 'all', label: 'All Status' }, { value: 'active', label: 'Active' }, { value: 'discontinued', label: 'Discontinued' }]} className="w-40" />
          <Button variant="primary" icon={Plus}>New Prescription</Button>
        </div>
        <Table columns={columns} data={filtered} />
      </Card>
    </div>
  );
};

const LabOrdersSection = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const filtered = MOCK_LAB_ORDERS.filter(lab => statusFilter === 'all' || lab.status === statusFilter);
  const columns = [
    { header: 'Patient', render: (r) => <div><div className="font-medium text-slate-900">{r.patientName}</div><div className="text-xs text-slate-500">{r.patientId}</div></div> },
    { header: 'Tests Ordered', render: (r) => <div className="flex flex-wrap gap-1">{r.tests.slice(0, 3).map((t, i) => <Badge key={i} variant="info" size="xs">{t}</Badge>)}{r.tests.length > 3 && <Badge variant="default" size="xs">+{r.tests.length - 3}</Badge>}</div> },
    { header: 'Priority', render: (r) => <StatusBadge status={r.priority} /> },
    { header: 'Facility', render: (r) => <span className="text-slate-600 text-sm">{r.facility}</span> },
    { header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { header: 'Actions', render: (r) => <div className="flex items-center gap-1">{(r.status === 'completed' || r.status === 'resulted') ? <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg"><Eye className="w-4 h-4" /></button> : <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><ExternalLink className="w-4 h-4" /></button>}<button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><Printer className="w-4 h-4" /></button></div> }
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={FlaskConical} value={MOCK_LAB_ORDERS.length} label="Total Orders" color="bg-sky-100 text-sky-600" />
        <StatCard icon={Clock} value={MOCK_LAB_ORDERS.filter(l => l.status === 'pending').length} label="Pending" color="bg-amber-100 text-amber-600" />
        <StatCard icon={TestTube} value={MOCK_LAB_ORDERS.filter(l => l.status === 'resulted').length} label="Results Ready" color="bg-violet-100 text-violet-600" />
        <StatCard icon={AlertCircle} value={MOCK_LAB_ORDERS.filter(l => l.priority === 'stat').length} label="STAT Orders" color="bg-rose-100 text-rose-600" />
      </div>
      <Card padding="p-0">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={[{ value: 'all', label: 'All Status' }, { value: 'pending', label: 'Pending' }, { value: 'completed', label: 'Completed' }, { value: 'resulted', label: 'Resulted' }]} className="w-40" />
          <Button variant="primary" icon={Plus}>New Lab Order</Button>
        </div>
        <Table columns={columns} data={filtered} />
      </Card>
    </div>
  );
};

const ReferralsSection = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const filtered = MOCK_REFERRALS.filter(ref => statusFilter === 'all' || ref.status === statusFilter);
  const columns = [
    { header: 'Patient', render: (r) => <div><div className="font-medium text-slate-900">{r.patientName}</div><div className="text-xs text-slate-500">{r.patientId}</div></div> },
    { header: 'Specialty', render: (r) => <div className="flex items-center gap-3"><div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center"><Share2 className="w-5 h-5 text-violet-600" /></div><div><div className="font-medium text-slate-900">{r.specialty}</div><div className="text-xs text-slate-500">{r.provider}</div></div></div> },
    { header: 'Facility', render: (r) => <span className="text-slate-600 text-sm">{r.facility}</span> },
    { header: 'Priority', render: (r) => <StatusBadge status={r.priority} /> },
    { header: 'Appointment', render: (r) => r.appointmentDate ? <span className="text-teal-600 font-medium">{r.appointmentDate}</span> : <span className="text-slate-400 text-sm">Not scheduled</span> },
    { header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { header: 'Actions', render: () => <div className="flex items-center gap-1"><button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg"><Eye className="w-4 h-4" /></button><button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><Phone className="w-4 h-4" /></button></div> }
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Share2} value={MOCK_REFERRALS.length} label="Total Referrals" color="bg-violet-100 text-violet-600" />
        <StatCard icon={Clock} value={MOCK_REFERRALS.filter(r => r.status === 'pending').length} label="Pending" color="bg-amber-100 text-amber-600" />
        <StatCard icon={Calendar} value={MOCK_REFERRALS.filter(r => r.status === 'scheduled').length} label="Scheduled" color="bg-sky-100 text-sky-600" />
        <StatCard icon={CheckCircle} value={MOCK_REFERRALS.filter(r => r.status === 'completed').length} label="Completed" color="bg-emerald-100 text-emerald-600" />
      </div>
      <Card padding="p-0">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={[{ value: 'all', label: 'All Status' }, { value: 'pending', label: 'Pending' }, { value: 'scheduled', label: 'Scheduled' }, { value: 'completed', label: 'Completed' }]} className="w-40" />
          <Button variant="primary" icon={Plus}>New Referral</Button>
        </div>
        <Table columns={columns} data={filtered} />
      </Card>
    </div>
  );
};

// ============================================================================
// DASHBOARD COMPONENTS
// ============================================================================

const PatientQueue = ({ patients, onSelectPatient, selectedPatientId }) => {
  const getUrgencyColor = (u) => u === 'high' ? 'border-l-rose-500 bg-rose-50/50' : u === 'moderate' ? 'border-l-amber-500 bg-amber-50/50' : 'border-l-emerald-500 bg-emerald-50/50';
  return (
    <Card className="h-full flex flex-col" padding="p-0">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between"><div><h2 className="font-semibold text-slate-900">Patient Queue</h2><p className="text-xs text-slate-500">{patients.length} patients waiting</p></div><Button variant="ghost" size="sm" icon={RefreshCw}>Refresh</Button></div>
      <div className="flex-1 overflow-y-auto">
        {patients.map(p => (
          <button key={p.id} onClick={() => onSelectPatient(p)} className={`w-full p-4 border-b border-slate-100 border-l-4 text-left hover:bg-slate-50 transition-colors ${getUrgencyColor(p.urgency)} ${selectedPatientId === p.id ? 'ring-2 ring-inset ring-teal-500' : ''}`}>
            <div className="flex items-start justify-between mb-2"><div><div className="font-medium text-slate-900">{p.name}</div><div className="text-xs text-slate-500">{p.age}yo {p.gender} • {p.id}</div></div><div className="flex items-center gap-2"><Badge variant={p.source === 'KIOSK' ? 'info' : 'purple'} size="xs">{p.source}</Badge><Badge variant={p.urgency === 'high' ? 'danger' : p.urgency === 'moderate' ? 'warning' : 'success'} size="xs">Triage: {p.triageScore}</Badge></div></div>
            <p className="text-sm text-slate-600 mb-2 line-clamp-2">{p.reason}</p>
            <div className="flex items-center gap-4 text-xs text-slate-500"><span className="flex items-center gap-1"><Clock className="w-3 h-3" />{p.waitTime} min</span><span>BP: {p.vitals.bp}</span><span>HR: {p.vitals.hr}</span></div>
          </button>
        ))}
      </div>
    </Card>
  );
};

const PatientDetailPanel = ({ patient, onStartEncounter }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const tabs = ['overview', 'history', 'medications', 'labs'];
  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg">{patient.name.split(' ').map(n => n[0]).join('')}</div>
            <div><h2 className="text-xl font-bold text-slate-900">{patient.name}</h2><div className="flex items-center gap-3 text-sm text-slate-500"><span>{patient.age} yo</span><span>•</span><span>{patient.gender}</span><span>•</span><span className="font-mono">{patient.mrn}</span></div></div>
          </div>
          <div className="flex items-center gap-2"><Button variant="secondary" size="sm" icon={Video}>Video Call</Button><Button variant="primary" size="sm" icon={FileText} onClick={onStartEncounter}>Start Encounter</Button></div>
        </div>
        {patient.allergies?.length > 0 && <div className="flex items-center gap-2 p-2 bg-rose-50 border border-rose-200 rounded-lg text-sm"><AlertTriangle className="w-4 h-4 text-rose-600" /><span className="font-medium text-rose-700">Allergies:</span><span className="text-rose-600">{patient.allergies.join(', ')}</span></div>}
      </div>
      <div className="flex border-b border-slate-200">{tabs.map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>{tab}</button>)}</div>
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div><h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2"><Activity className="w-4 h-4 text-teal-600" />Current Vitals</h3><div className="grid grid-cols-5 gap-3"><VitalCard icon={Heart} label="BP" value={patient.recentVitals[0].bp} unit="mmHg" status={parseInt(patient.recentVitals[0].bp) > 140 ? 'high' : 'normal'} /><VitalCard icon={Activity} label="HR" value={patient.recentVitals[0].hr} unit="bpm" status={patient.recentVitals[0].hr > 90 ? 'high' : 'normal'} trend="up" /><VitalCard icon={Thermometer} label="Temp" value={patient.recentVitals[0].temp} unit="°C" status="normal" /><VitalCard icon={Activity} label="SpO2" value={patient.recentVitals[0].spo2 + '%'} status={patient.recentVitals[0].spo2 < 95 ? 'low' : 'normal'} /><VitalCard icon={Weight} label="Weight" value={patient.recentVitals[0].weight} unit="lbs" status="normal" /></div></div>
            {patient.triageData && <div><h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2"><Brain className="w-4 h-4 text-violet-600" />AI Pre-Diagnosis</h3><Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200"><div className="mb-4"><div className="text-sm font-medium text-slate-700 mb-1">Chief Complaint</div><p className="text-slate-900">{patient.triageData.primarySymptom}</p><div className="flex items-center gap-4 mt-2 text-sm text-slate-600"><span>Duration: {patient.triageData.duration}</span><span>Severity: {patient.triageData.severity}/10</span></div></div><div className="mb-4"><div className="text-sm font-medium text-slate-700 mb-2">Possible Conditions</div><div className="space-y-2">{patient.triageData.aiAssessment.conditions.map((c, i) => <div key={i} className="flex items-center gap-3"><div className="flex-1"><div className="flex items-center justify-between text-sm mb-1"><span className="text-slate-700">{c.name}</span><span className="font-medium text-violet-600">{c.probability}%</span></div><div className="h-2 bg-violet-200 rounded-full overflow-hidden"><div className="h-full bg-violet-600 rounded-full" style={{ width: `${c.probability}%` }} /></div></div></div>)}</div></div><div><div className="text-sm font-medium text-slate-700 mb-2">CDS Recommendations</div><div className="flex flex-wrap gap-2">{patient.triageData.aiAssessment.recommendations.map((r, i) => <Badge key={i} variant="purple" size="md">{r}</Badge>)}</div></div></Card></div>}
            {patient.conditions && <div><h3 className="text-sm font-semibold text-slate-700 mb-3">Active Conditions</h3><div className="flex flex-wrap gap-2">{patient.conditions.map((c, i) => <Badge key={i} variant="warning" size="md">{c}</Badge>)}</div></div>}
          </div>
        )}
        {activeTab === 'history' && <div className="space-y-4"><h3 className="text-sm font-semibold text-slate-700">Previous Encounters</h3>{patient.encounters?.map((e, i) => <Card key={i} className="border-l-4 border-l-teal-500"><div className="flex items-center justify-between mb-2"><div><span className="font-medium text-slate-900">{e.type}</span><span className="text-slate-500 text-sm"> • {e.provider}</span></div><span className="text-sm text-slate-500">{e.date}</span></div><p className="text-sm text-slate-600">{e.summary}</p></Card>)}</div>}
        {activeTab === 'medications' && <div className="space-y-4"><h3 className="text-sm font-semibold text-slate-700">Current Medications</h3>{patient.medications?.map((m, i) => <Card key={i} className="flex items-center gap-4"><div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center"><Pill className="w-5 h-5 text-teal-600" /></div><div className="flex-1"><div className="font-medium text-slate-900">{m.name} {m.dose}</div><div className="text-sm text-slate-500">{m.frequency}</div></div><Badge variant="success" size="sm">Active</Badge></Card>)}</div>}
        {activeTab === 'labs' && <div className="space-y-4"><div className="flex items-center justify-between"><h3 className="text-sm font-semibold text-slate-700">Lab History</h3><Button variant="secondary" size="sm" icon={Plus}>Order Labs</Button></div>{patient.recentLabs?.map((l, i) => <Card key={i}><div className="flex items-center justify-between"><div><div className="font-medium text-slate-900">{l.name}</div><div className="text-sm text-slate-500">{l.date}</div></div><div className="text-right"><div className={`font-bold ${l.status === 'high' ? 'text-rose-600' : 'text-slate-900'}`}>{l.value}</div><div className="text-xs text-slate-500">Range: {l.range}</div></div></div></Card>)}</div>}
      </div>
    </div>
  );
};

// ============================================================================
// SESSION TIMEOUT MODAL
// ============================================================================

const SessionTimeoutModal = ({ onExtend, onLogout, timeRemaining }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Timer className="w-8 h-8 text-amber-600" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">Session Expiring</h2>
      <p className="text-slate-600 mb-6">
        Your session will expire in <span className="font-bold text-amber-600">{timeRemaining} seconds</span> due to inactivity.
      </p>
      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onLogout}>Sign Out</Button>
        <Button variant="primary" className="flex-1" onClick={onExtend}>Extend Session</Button>
      </div>
    </div>
  </div>
);

// ============================================================================
// MAIN APP
// ============================================================================

export default function ExtendiLiteEMR() {
  const [authState, setAuthState] = useState('login'); // login, pin, 2fa, authenticated
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDetail, setPatientDetail] = useState(null);
  const [sessionTime, setSessionTime] = useState(AUTH_CONFIG.sessionTimeoutMinutes * 60);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);

  // Session timer
  useEffect(() => {
    if (authState !== 'authenticated') return;

    const timer = setInterval(() => {
      setSessionTime(prev => {
        if (prev <= 1) {
          handleLogout();
          return 0;
        }
        if (prev === 60) {
          setShowTimeoutModal(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [authState]);

  // Reset session on activity
  const resetSession = useCallback(() => {
    setSessionTime(AUTH_CONFIG.sessionTimeoutMinutes * 60);
    setShowTimeoutModal(false);
  }, []);

  useEffect(() => {
    if (authState !== 'authenticated') return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetSession));
    return () => events.forEach(event => window.removeEventListener(event, resetSession));
  }, [authState, resetSession]);

  const handleLogin = (user, nextStep) => {
    setCurrentUser(user);
    setAuthState(nextStep);
  };

  const handleLogout = () => {
    setAuthState('login');
    setCurrentUser(null);
    setActiveSection('dashboard');
    setSelectedPatient(null);
    setPatientDetail(null);
    setSessionTime(AUTH_CONFIG.sessionTimeoutMinutes * 60);
    setShowTimeoutModal(false);
  };

  const handleSelectPatient = (p) => { 
    setSelectedPatient(p); 
    setPatientDetail({ ...MOCK_PATIENT_DETAIL, ...p }); 
  };

  const handleStartEncounter = () => alert('Starting encounter documentation...');

  const titles = { 
    dashboard: { t: 'Dashboard', s: `Welcome back, ${currentUser?.name || ''}` }, 
    patients: { t: 'Patients', s: 'Manage patient records' }, 
    encounters: { t: 'Encounters', s: 'Clinical documentation' }, 
    prescriptions: { t: 'Prescriptions', s: 'e-Prescribing (EPCS)' }, 
    labs: { t: 'Lab Orders', s: 'Order and track lab results' }, 
    referrals: { t: 'Referrals', s: 'Specialist referrals management' } 
  };

  // Render authentication screens
  if (authState === 'login') {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (authState === 'pin' && currentUser) {
    return <PinScreen user={currentUser} onVerify={(next) => setAuthState(next)} onBack={() => setAuthState('login')} />;
  }

  if (authState === '2fa' && currentUser) {
    return <TwoFactorScreen user={currentUser} onVerify={(next) => setAuthState(next)} onBack={() => setAuthState('pin')} />;
  }

  // Render main application
  return (
    <div className="min-h-screen bg-slate-100">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');*{font-family:'Plus Jakarta Sans',sans-serif}.line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}`}</style>
      
      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} onLogout={handleLogout} user={currentUser} />
      
      <div className="ml-64">
        <Header 
          title={titles[activeSection]?.t || activeSection} 
          subtitle={titles[activeSection]?.s} 
          user={currentUser}
          sessionTime={sessionTime}
          onLogout={handleLogout}
        />
        
        <main className="p-6">
          {activeSection === 'dashboard' && (
            <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
              <div className="col-span-4">
                <PatientQueue patients={MOCK_PATIENTS_QUEUE} onSelectPatient={handleSelectPatient} selectedPatientId={selectedPatient?.id} />
              </div>
              <div className="col-span-8">
                {patientDetail ? (
                  <PatientDetailPanel patient={patientDetail} onStartEncounter={handleStartEncounter} />
                ) : (
                  <Card className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><Users className="w-8 h-8 text-slate-400" /></div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">Select a Patient</h3>
                      <p className="text-slate-500 text-sm">Choose a patient from the queue to view details.</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          )}
          {activeSection === 'patients' && <PatientsSection onSelectPatient={(p) => { setActiveSection('dashboard'); handleSelectPatient(p); }} />}
          {activeSection === 'encounters' && <EncountersSection />}
          {activeSection === 'prescriptions' && <PrescriptionsSection />}
          {activeSection === 'labs' && <LabOrdersSection />}
          {activeSection === 'referrals' && <ReferralsSection />}
        </main>
      </div>

      {/* Session Timeout Modal */}
      {showTimeoutModal && (
        <SessionTimeoutModal 
          timeRemaining={sessionTime} 
          onExtend={resetSession} 
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
}