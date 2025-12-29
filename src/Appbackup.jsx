import React, { useState, useEffect, useRef } from 'react';
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
  ShieldCheck, Fingerprint, EyeOff, AlertOctagon, Timer, LogIn,
  Menu, Maximize2, Minimize2, HelpCircle, Database, Volume2, VolumeX,
  VideoOff, MicOff, PhoneOff, MonitorSpeaker, ScreenShare, FileText as NoteIcon,
  ClipboardCheck, Pen, AlertOctagon as Warning, ShieldAlert, UserCheck,
  FileWarning, FilePlus, Laptop, Wifi, WifiOff
} from 'lucide-react';

// ============================================================================
// CONFIGURATION
// ============================================================================

const DEMO_CREDENTIALS = { email: 'jide.grand@extendilite.com', password: 'SecurePass123!' };

const MOCK_USER = {
  id: 'USR-001', email: 'jide.grand@extendilite.com', name: 'Dr. Jide Grand',
  role: 'Provider', specialty: 'Internal Medicine', npi: '1234567890',
  avatar: 'JG', department: 'SHB NUC MED'
};

const ID_TYPES = [
  { id: '123001', name: 'ONTARIO HEALTH CARD NUMBER' },
  { id: '123003', name: 'MANITOBA HEALTH CARD NUMBER' },
  { id: '123010', name: 'NOVA SCOTIA HEALTH CARD NUMBER' },
  { id: '355', name: 'CMH GAIN' },
  { id: '0', name: 'ENTERPRISE ID NUMBER' },
];

// ============================================================================
// MOCK DATA WITH KIOSK STATUS
// ============================================================================

const MOCK_PATIENTS = [
  { id: 'P-001', mrn: 'MRN-2024-34001', firstName: 'Sarah', lastName: 'Mitchell', name: 'Sarah Mitchell', age: 34, gender: 'F', sex: 'Female', dob: '1990-05-12', phone: '(416) 555-0101', email: 'sarah.m@email.com', postalCode: 'M5V 1K4', hcn: '1234-567-890', status: 'active', allergies: ['Penicillin'], conditions: ['Asthma'], lastVisit: '2024-12-16' },
  { id: 'P-002', mrn: 'MRN-2024-58291', firstName: 'James', lastName: 'Wilson', name: 'James Wilson', age: 58, gender: 'M', sex: 'Male', dob: '1966-08-14', phone: '(416) 555-0147', email: 'jwilson@email.com', postalCode: 'M5V 2K8', hcn: '2345-678-901', status: 'active', allergies: ['Penicillin', 'Sulfa'], conditions: ['Hypertension', 'Type 2 Diabetes', 'Hyperlipidemia'], lastVisit: '2024-12-16' },
  { id: 'P-003', mrn: 'MRN-2024-27003', firstName: 'Emily', lastName: 'Chen', name: 'Emily Chen', age: 27, gender: 'F', sex: 'Female', dob: '1997-03-22', phone: '(416) 555-0103', email: 'emily.chen@email.com', postalCode: 'M4W 1A8', hcn: '3456-789-012', status: 'active', allergies: [], conditions: [], lastVisit: '2024-12-16' },
  { id: 'P-004', mrn: 'MRN-2024-45004', firstName: 'Robert', lastName: 'Garcia', name: 'Robert Garcia', age: 45, gender: 'M', sex: 'Male', dob: '1979-11-08', phone: '(416) 555-0104', email: 'rgarcia@email.com', postalCode: 'L5B 3C2', hcn: '4567-890-123', status: 'active', allergies: [], conditions: ['Hypertension'], lastVisit: '2024-12-15' },
  { id: 'P-005', mrn: 'MRN-2024-62005', firstName: 'Maria', lastName: 'Santos', name: 'Maria Santos', age: 62, gender: 'F', sex: 'Female', dob: '1962-07-30', phone: '(416) 555-0105', email: 'msantos@email.com', postalCode: 'M6H 2V5', hcn: '5678-901-234', status: 'active', allergies: ['Aspirin'], conditions: ['Migraine', 'Arthritis'], lastVisit: '2024-12-16' },
];

const MOCK_QUEUE = [
  { id: 'P-001', name: 'Sarah Mitchell', age: 34, gender: 'F', reason: 'Persistent cough, mild fever', urgency: 'moderate', waitTime: 12, vitals: { bp: '118/76', hr: 82, temp: 37.8, spo2: 97 }, source: 'KIOSK', triageScore: 6, kioskStatus: 'waiting', videoEnabled: true, checkedInAt: '10:18 AM', kioskId: 'KIOSK-A3' },
  { id: 'P-002', name: 'James Wilson', age: 58, gender: 'M', reason: 'Chest tightness, shortness of breath', urgency: 'high', waitTime: 3, vitals: { bp: '142/88', hr: 96, temp: 37.1, spo2: 94 }, source: 'KIOSK', triageScore: 8, kioskStatus: 'waiting', videoEnabled: true, checkedInAt: '10:27 AM', kioskId: 'KIOSK-A1' },
  { id: 'P-003', name: 'Emily Chen', age: 27, gender: 'F', reason: 'Prescription refill - birth control', urgency: 'low', waitTime: 25, vitals: { bp: '110/70', hr: 68, temp: 36.8, spo2: 99 }, source: 'Mobile', triageScore: 2, kioskStatus: 'mobile', videoEnabled: true, checkedInAt: '10:05 AM', kioskId: null },
  { id: 'P-004', name: 'Robert Garcia', age: 45, gender: 'M', reason: 'Follow-up: Hypertension management', urgency: 'low', waitTime: 18, vitals: { bp: '128/82', hr: 74, temp: 36.9, spo2: 98 }, source: 'KIOSK', triageScore: 3, kioskStatus: 'waiting', videoEnabled: true, checkedInAt: '10:12 AM', kioskId: 'KIOSK-B2' },
  { id: 'P-005', name: 'Maria Santos', age: 62, gender: 'F', reason: 'Severe headache, nausea', urgency: 'high', waitTime: 5, vitals: { bp: '158/94', hr: 88, temp: 37.2, spo2: 97 }, source: 'KIOSK', triageScore: 7, kioskStatus: 'waiting', videoEnabled: true, checkedInAt: '10:25 AM', kioskId: 'KIOSK-A2' },
];

const ICD10_CODES = [
  { code: 'J06.9', description: 'Acute upper respiratory infection, unspecified' },
  { code: 'J20.9', description: 'Acute bronchitis, unspecified' },
  { code: 'I10', description: 'Essential (primary) hypertension' },
  { code: 'I20.9', description: 'Angina pectoris, unspecified' },
  { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
  { code: 'R05.9', description: 'Cough, unspecified' },
  { code: 'R50.9', description: 'Fever, unspecified' },
  { code: 'G43.909', description: 'Migraine, unspecified, not intractable' },
  { code: 'F41.1', description: 'Generalized anxiety disorder' },
  { code: 'Z30.41', description: 'Encounter for surveillance of contraceptive pills' },
];

const MEDICATIONS_DB = [
  { name: 'Azithromycin', strengths: ['250mg', '500mg'], forms: ['Tablet', 'Suspension'] },
  { name: 'Amoxicillin', strengths: ['250mg', '500mg', '875mg'], forms: ['Capsule', 'Tablet', 'Suspension'] },
  { name: 'Benzonatate', strengths: ['100mg', '200mg'], forms: ['Capsule'] },
  { name: 'Guaifenesin', strengths: ['400mg', '600mg', '1200mg'], forms: ['Tablet', 'ER Tablet'] },
  { name: 'Albuterol', strengths: ['90mcg'], forms: ['Inhaler'] },
  { name: 'Prednisone', strengths: ['5mg', '10mg', '20mg'], forms: ['Tablet'] },
  { name: 'Metoprolol', strengths: ['25mg', '50mg', '100mg'], forms: ['Tablet', 'ER Tablet'] },
  { name: 'Lisinopril', strengths: ['5mg', '10mg', '20mg', '40mg'], forms: ['Tablet'] },
  { name: 'Atorvastatin', strengths: ['10mg', '20mg', '40mg', '80mg'], forms: ['Tablet'] },
  { name: 'Metformin', strengths: ['500mg', '850mg', '1000mg'], forms: ['Tablet', 'ER Tablet'] },
];

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

const Badge = ({ children, variant = 'default', size = 'sm' }) => {
  const variants = {
    default: 'bg-slate-700 text-slate-300',
    success: 'bg-emerald-900/50 text-emerald-400 border border-emerald-700',
    warning: 'bg-amber-900/50 text-amber-400 border border-amber-700',
    danger: 'bg-rose-900/50 text-rose-400 border border-rose-700',
    info: 'bg-cyan-900/50 text-cyan-400 border border-cyan-700',
    purple: 'bg-violet-900/50 text-violet-400 border border-violet-700',
    live: 'bg-emerald-500 text-white animate-pulse',
  };
  const sizes = { xs: 'px-1.5 py-0.5 text-xs', sm: 'px-2 py-0.5 text-xs', md: 'px-2.5 py-1 text-sm' };
  return <span className={`inline-flex items-center font-medium rounded ${variants[variant]} ${sizes[size]}`}>{children}</span>;
};

const Button = ({ children, variant = 'primary', size = 'md', icon: Icon, onClick, disabled, className = '', type = 'button' }) => {
  const variants = {
    primary: 'bg-gradient-to-b from-teal-500 to-teal-600 text-white hover:from-teal-400 hover:to-teal-500 border border-teal-400',
    secondary: 'bg-slate-700 text-slate-200 border border-slate-600 hover:bg-slate-600',
    ghost: 'text-slate-300 hover:bg-slate-700',
    danger: 'bg-rose-700 text-white hover:bg-rose-600 border border-rose-600',
    success: 'bg-emerald-600 text-white hover:bg-emerald-500 border border-emerald-500',
    toolbar: 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white',
    video: 'bg-gradient-to-b from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 border border-emerald-400',
  };
  const sizes = { xs: 'px-2 py-1 text-xs', sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-6 py-2.5 text-sm' };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`inline-flex items-center justify-center gap-1.5 font-medium rounded transition-all ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      {Icon && <Icon className="w-4 h-4" />}{children}
    </button>
  );
};

const Input = ({ label, type = 'text', value, onChange, placeholder, icon: Icon, className = '', small = false, rows }) => (
  <div className={className}>
    {label && <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>}
    <div className="relative">
      {Icon && <div className="absolute left-2 top-2.5 text-slate-500"><Icon className="w-3.5 h-3.5" /></div>}
      {rows ? (
        <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} className={`w-full border rounded outline-none transition-all bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 px-2 py-1.5 text-sm resize-none`} />
      ) : (
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full border rounded outline-none transition-all bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 ${Icon ? 'pl-8' : 'px-2'} ${small ? 'py-1 text-xs' : 'py-1.5 text-sm'}`} />
      )}
    </div>
  </div>
);

const Select = ({ label, value, onChange, options, className = '', small = false }) => (
  <div className={className}>
    {label && <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>}
    <select value={value} onChange={onChange} className={`w-full border rounded outline-none bg-slate-900 border-slate-700 text-slate-200 focus:border-teal-500 px-2 ${small ? 'py-1 text-xs' : 'py-1.5 text-sm'}`}>
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

const StatusBadge = ({ status }) => {
  const configs = {
    'active': { variant: 'success', label: 'Active' },
    'pending': { variant: 'warning', label: 'Pending' },
    'completed': { variant: 'success', label: 'Completed' },
    'in-progress': { variant: 'info', label: 'In Progress' },
    'stat': { variant: 'danger', label: 'STAT' },
    'routine': { variant: 'default', label: 'Routine' },
    'urgent': { variant: 'warning', label: 'Urgent' },
  };
  const config = configs[status] || { variant: 'default', label: status };
  return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
};

// Blinking Live Indicator
const LiveIndicator = ({ isLive, kioskId }) => {
  if (!isLive) return null;
  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
      </span>
      <span className="text-xs text-emerald-400 font-medium">{kioskId || 'LIVE'}</span>
    </div>
  );
};

// ============================================================================
// LOGIN SCREEN
// ============================================================================

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    if (email.toLowerCase() === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      onLogin(MOCK_USER);
    } else {
      setError('Invalid email or password. Please use the demo credentials below.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl shadow-lg shadow-teal-500/30 mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">ExtendiLite EMR</h1>
          <p className="text-slate-400">Provider Portal - Secure Login</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-900/30 border border-rose-700 rounded-lg flex items-start gap-2 text-rose-400 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />{error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="provider@extendilite.com" icon={Mail} />
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-8 pr-10 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200 text-sm focus:border-teal-500 outline-none" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" variant="primary" className="w-full" size="lg" icon={isLoading ? RefreshCw : LogIn} disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-6 p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
            <div className="flex items-center gap-2 mb-2"><Info className="w-4 h-4 text-teal-400" /><span className="text-sm font-medium text-teal-400">Demo Account</span></div>
            <div className="text-xs text-slate-400 space-y-1 font-mono">
              <p>Email: {DEMO_CREDENTIALS.email}</p>
              <p>Password: {DEMO_CREDENTIALS.password}</p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/30 border border-emerald-700/50 rounded">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /><span className="text-xs text-emerald-400">HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-900/30 border border-cyan-700/50 rounded">
            <Lock className="w-4 h-4 text-cyan-400" /><span className="text-xs text-cyan-400">256-bit SSL</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// VIDEO CONFERENCE MODAL
// ============================================================================

const VideoConferenceModal = ({ isOpen, onClose, patient, onStartEncounter }) => {
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [showConsent, setShowConsent] = useState(true);
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    if (isOpen && consentGiven) {
      setIsConnecting(true);
      const timer = setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, consentGiven]);

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => setCallDuration(d => d + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setIsConnected(false);
    setCallDuration(0);
    setConsentGiven(false);
    setShowConsent(true);
    onClose();
  };

  const handleConsent = () => {
    setShowConsent(false);
    setConsentGiven(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="w-full max-w-5xl h-[90vh] bg-slate-900 rounded-xl border border-slate-700 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Video className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-white font-medium">Telemedicine Session</h2>
              <p className="text-xs text-slate-400">{patient?.name} • {patient?.kioskId}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isConnected && (
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-900/30 border border-emerald-700 rounded-full">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
                <span className="text-sm text-emerald-400 font-mono">{formatDuration(callDuration)}</span>
              </div>
            )}
            <div className="flex items-center gap-2 px-2 py-1 bg-amber-900/30 border border-amber-700 rounded">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-amber-400">HIPAA Encrypted</span>
            </div>
          </div>
        </div>

        {/* HIPAA Consent Screen */}
        {showConsent && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="max-w-lg text-center">
              <div className="w-16 h-16 bg-amber-900/30 border border-amber-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldAlert className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">HIPAA Compliance Notice</h3>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-slate-300 mb-3">Before starting this telemedicine session, please confirm:</p>
                <ul className="text-sm text-slate-400 space-y-2">
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />Patient identity has been verified</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />Patient has consented to telemedicine visit</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />This session will be logged for audit purposes</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />Connection is encrypted end-to-end (256-bit AES)</li>
                </ul>
              </div>
              <div className="flex gap-3 justify-center">
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="success" icon={Video} onClick={handleConsent}>Confirm & Connect</Button>
              </div>
            </div>
          </div>
        )}

        {/* Connecting Screen */}
        {!showConsent && isConnecting && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-lg text-white mb-2">Connecting to {patient?.kioskId}...</p>
              <p className="text-sm text-slate-400">Patient is waiting at the KIOSK</p>
            </div>
          </div>
        )}

        {/* Connected - Video View */}
        {!showConsent && isConnected && (
          <>
            <div className="flex-1 flex">
              {/* Main Video (Patient) */}
              <div className="flex-1 relative bg-slate-950">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                      {patient?.name?.split(' ').map(n => n[0]).join('')}
                    </div>
                    <p className="text-white text-lg font-medium">{patient?.name}</p>
                    <p className="text-slate-400 text-sm">{patient?.age}yo • {patient?.gender} • {patient?.kioskId}</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Wifi className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 text-sm">Connected</span>
                    </div>
                  </div>
                </div>
                {/* Patient Info Overlay */}
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Chief Complaint</p>
                  <p className="text-sm text-white">{patient?.reason}</p>
                  {patient?.allergies?.length > 0 && (
                    <div className="mt-2 flex items-center gap-1 text-rose-400">
                      <AlertTriangle className="w-3 h-3" />
                      <span className="text-xs">Allergies: {patient?.allergies?.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Self View (Provider) */}
              <div className="w-64 bg-slate-800 border-l border-slate-700 flex flex-col">
                <div className="h-48 bg-slate-950 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isVideoOff ? (
                      <VideoOff className="w-12 h-12 text-slate-600" />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        JG
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-2 left-2 text-xs text-slate-400">Dr. Jide Grand</div>
                </div>
                {/* Vitals Display */}
                <div className="flex-1 p-3 overflow-y-auto">
                  <h4 className="text-xs font-semibold text-teal-400 mb-2 flex items-center gap-1"><Activity className="w-3 h-3" /> LIVE VITALS</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'BP', value: patient?.vitals?.bp, icon: Heart },
                      { label: 'HR', value: patient?.vitals?.hr, icon: Activity },
                      { label: 'Temp', value: patient?.vitals?.temp, icon: Thermometer },
                      { label: 'SpO2', value: `${patient?.vitals?.spo2}%`, icon: Activity },
                    ].map((v, i) => (
                      <div key={i} className="bg-slate-900 rounded p-2 border border-slate-700">
                        <div className="text-lg font-bold text-white">{v.value}</div>
                        <div className="text-xs text-slate-500">{v.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="px-6 py-4 bg-slate-800 border-t border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setIsMuted(!isMuted)} className={`p-3 rounded-full ${isMuted ? 'bg-rose-600' : 'bg-slate-700'} hover:opacity-80`}>
                  {isMuted ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
                </button>
                <button onClick={() => setIsVideoOff(!isVideoOff)} className={`p-3 rounded-full ${isVideoOff ? 'bg-rose-600' : 'bg-slate-700'} hover:opacity-80`}>
                  {isVideoOff ? <VideoOff className="w-5 h-5 text-white" /> : <Video className="w-5 h-5 text-white" />}
                </button>
                <button className="p-3 rounded-full bg-slate-700 hover:opacity-80">
                  <ScreenShare className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="primary" icon={FileText} onClick={() => { onStartEncounter(); }}>
                  Start Documentation
                </Button>
                <button onClick={handleEndCall} className="p-3 rounded-full bg-rose-600 hover:bg-rose-500">
                  <PhoneOff className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// ENCOUNTER DOCUMENTATION MODAL (SOAP Notes)
// ============================================================================

const EncounterModal = ({ isOpen, onClose, patient, onSave }) => {
  const [activeTab, setActiveTab] = useState('subjective');
  const [encounterData, setEncounterData] = useState({
    subjective: { chiefComplaint: '', hpi: '', ros: '', pmh: '', medications: '', allergies: '', socialHistory: '', familyHistory: '' },
    objective: { vitals: {}, physicalExam: '', generalAppearance: '' },
    assessment: { diagnoses: [], differentials: '', clinicalImpression: '' },
    plan: { treatment: '', prescriptions: [], labOrders: [], referrals: [], patientEducation: '', followUp: '' },
  });
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [diagnosisSearch, setDiagnosisSearch] = useState('');
  const [showDiagnosisDropdown, setShowDiagnosisDropdown] = useState(false);
  const [auditLog, setAuditLog] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showHIPAAWarning, setShowHIPAAWarning] = useState(false);
  
  // Modal states for Plan items
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showLabOrderModal, setShowLabOrderModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);

  useEffect(() => {
    if (isOpen && patient) {
      // Pre-populate with patient data
      setEncounterData(prev => ({
        ...prev,
        subjective: {
          ...prev.subjective,
          chiefComplaint: patient.reason || '',
          allergies: patient.allergies?.join(', ') || 'NKDA',
        },
        objective: {
          ...prev.objective,
          vitals: patient.vitals || {},
        }
      }));
      // Add audit log entry
      setAuditLog([{ timestamp: new Date().toISOString(), action: 'Encounter opened', user: 'Dr. Jide Grand' }]);
    }
  }, [isOpen, patient]);

  const handleSave = async (status) => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setAuditLog(prev => [...prev, { timestamp: new Date().toISOString(), action: `Encounter ${status}`, user: 'Dr. Jide Grand' }]);
    setIsSaving(false);
    if (status === 'signed') {
      onSave?.(encounterData);
      onClose();
    }
  };

  const addDiagnosis = (diag) => {
    setEncounterData(prev => ({
      ...prev,
      assessment: {
        ...prev.assessment,
        diagnoses: [...prev.assessment.diagnoses, diag]
      }
    }));
    setDiagnosisSearch('');
    setShowDiagnosisDropdown(false);
  };

  const removeDiagnosis = (index) => {
    setEncounterData(prev => ({
      ...prev,
      assessment: {
        ...prev.assessment,
        diagnoses: prev.assessment.diagnoses.filter((_, i) => i !== index)
      }
    }));
  };

  const filteredDiagnoses = ICD10_CODES.filter(d => 
    d.code.toLowerCase().includes(diagnosisSearch.toLowerCase()) ||
    d.description.toLowerCase().includes(diagnosisSearch.toLowerCase())
  );

  if (!isOpen) return null;

  const tabs = [
    { id: 'subjective', label: 'Subjective', icon: ClipboardList },
    { id: 'objective', label: 'Objective', icon: Activity },
    { id: 'assessment', label: 'Assessment', icon: Brain },
    { id: 'plan', label: 'Plan', icon: FileCheck },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-6xl h-[95vh] bg-slate-900 rounded-xl border border-slate-700 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FileText className="w-5 h-5 text-teal-400" />
            <div>
              <h2 className="text-white font-medium">Clinical Documentation</h2>
              <p className="text-xs text-slate-400">{patient?.name} • {MOCK_PATIENTS.find(p => p.id === patient?.id)?.mrn}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-400">
              <Clock className="w-3 h-3" />
              {new Date().toLocaleTimeString()}
            </div>
            <div className="flex items-center gap-2 px-2 py-1 bg-emerald-900/30 border border-emerald-700 rounded">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-emerald-400">Auto-saving • HIPAA Compliant</span>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Patient Summary Sidebar */}
          <div className="w-64 bg-slate-800 border-r border-slate-700 p-3 overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold">
                {patient?.name?.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-medium text-white text-sm">{patient?.name}</p>
                <p className="text-xs text-slate-400">{patient?.age}yo {patient?.gender}</p>
              </div>
            </div>

            {patient?.allergies?.length > 0 && (
              <div className="mb-3 p-2 bg-rose-900/30 border border-rose-700 rounded">
                <div className="flex items-center gap-1 text-rose-400 text-xs font-medium mb-1">
                  <AlertTriangle className="w-3 h-3" /> ALLERGIES
                </div>
                <p className="text-rose-300 text-sm">{patient?.allergies?.join(', ')}</p>
              </div>
            )}

            <div className="mb-3">
              <p className="text-xs text-slate-500 mb-1">CONDITIONS</p>
              <div className="flex flex-wrap gap-1">
                {(MOCK_PATIENTS.find(p => p.id === patient?.id)?.conditions || []).map((c, i) => (
                  <Badge key={i} variant="warning" size="xs">{c}</Badge>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs text-slate-500 mb-1">TODAY'S VITALS</p>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="bg-slate-900 rounded p-1.5"><span className="text-slate-500">BP:</span> <span className="text-white">{patient?.vitals?.bp}</span></div>
                <div className="bg-slate-900 rounded p-1.5"><span className="text-slate-500">HR:</span> <span className="text-white">{patient?.vitals?.hr}</span></div>
                <div className="bg-slate-900 rounded p-1.5"><span className="text-slate-500">Temp:</span> <span className="text-white">{patient?.vitals?.temp}</span></div>
                <div className="bg-slate-900 rounded p-1.5"><span className="text-slate-500">SpO2:</span> <span className="text-white">{patient?.vitals?.spo2}%</span></div>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-3 mt-3">
              <p className="text-xs text-slate-500 mb-2">AUDIT LOG</p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {auditLog.map((log, i) => (
                  <div key={i} className="text-xs text-slate-400">
                    <span className="text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span> - {log.action}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* SOAP Tabs */}
            <div className="flex border-b border-slate-700 bg-slate-800/50">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-slate-900 text-teal-400 border-b-2 border-teal-500'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'subjective' && (
                <div className="space-y-4">
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-teal-400 mb-3">Chief Complaint</h3>
                    <Input
                      value={encounterData.subjective.chiefComplaint}
                      onChange={(e) => setEncounterData(prev => ({ ...prev, subjective: { ...prev.subjective, chiefComplaint: e.target.value } }))}
                      placeholder="Patient's primary concern..."
                    />
                  </div>
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-teal-400 mb-3">History of Present Illness (HPI)</h3>
                    <Input
                      rows={4}
                      value={encounterData.subjective.hpi}
                      onChange={(e) => setEncounterData(prev => ({ ...prev, subjective: { ...prev.subjective, hpi: e.target.value } }))}
                      placeholder="Describe onset, location, duration, character, aggravating/alleviating factors, radiation, timing, severity..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-teal-400 mb-3">Review of Systems</h3>
                      <Input rows={3} value={encounterData.subjective.ros} onChange={(e) => setEncounterData(prev => ({ ...prev, subjective: { ...prev.subjective, ros: e.target.value } }))} placeholder="Constitutional, HEENT, Cardiovascular, Respiratory, GI, etc." />
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-teal-400 mb-3">Past Medical History</h3>
                      <Input rows={3} value={encounterData.subjective.pmh} onChange={(e) => setEncounterData(prev => ({ ...prev, subjective: { ...prev.subjective, pmh: e.target.value } }))} placeholder="Previous conditions, surgeries, hospitalizations..." />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'objective' && (
                <div className="space-y-4">
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-teal-400 mb-3">Vital Signs (from KIOSK)</h3>
                    <div className="grid grid-cols-5 gap-3">
                      {[
                        { label: 'Blood Pressure', value: patient?.vitals?.bp, unit: 'mmHg' },
                        { label: 'Heart Rate', value: patient?.vitals?.hr, unit: 'bpm' },
                        { label: 'Temperature', value: patient?.vitals?.temp, unit: '°C' },
                        { label: 'SpO2', value: `${patient?.vitals?.spo2}`, unit: '%' },
                        { label: 'Weight', value: '187', unit: 'lbs' },
                      ].map((v, i) => (
                        <div key={i} className="bg-slate-900 border border-slate-700 rounded p-3 text-center">
                          <div className="text-2xl font-bold text-white">{v.value}</div>
                          <div className="text-xs text-slate-400">{v.label}</div>
                          <div className="text-xs text-slate-500">{v.unit}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-teal-400 mb-3">Physical Examination</h3>
                    <Input
                      rows={6}
                      value={encounterData.objective.physicalExam}
                      onChange={(e) => setEncounterData(prev => ({ ...prev, objective: { ...prev.objective, physicalExam: e.target.value } }))}
                      placeholder="Document physical exam findings by system..."
                    />
                  </div>
                </div>
              )}

              {activeTab === 'assessment' && (
                <div className="space-y-4">
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-teal-400 mb-3">Diagnoses (ICD-10)</h3>
                    <div className="relative mb-3">
                      <Input
                        value={diagnosisSearch}
                        onChange={(e) => { setDiagnosisSearch(e.target.value); setShowDiagnosisDropdown(true); }}
                        placeholder="Search ICD-10 codes..."
                        icon={Search}
                      />
                      {showDiagnosisDropdown && diagnosisSearch && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-600 rounded shadow-xl z-10 max-h-48 overflow-y-auto">
                          {filteredDiagnoses.map(d => (
                            <button key={d.code} onClick={() => addDiagnosis(d)} className="w-full px-3 py-2 text-left text-sm hover:bg-teal-600 text-slate-300">
                              <span className="font-mono text-teal-400">{d.code}</span> - {d.description}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      {encounterData.assessment.diagnoses.map((d, i) => (
                        <div key={i} className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded p-2">
                          <div>
                            <span className="font-mono text-teal-400 text-sm">{d.code}</span>
                            <span className="text-slate-300 text-sm ml-2">{d.description}</span>
                          </div>
                          <button onClick={() => removeDiagnosis(i)} className="text-slate-500 hover:text-rose-400"><X className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-teal-400 mb-3">Clinical Impression</h3>
                    <Input
                      rows={3}
                      value={encounterData.assessment.clinicalImpression}
                      onChange={(e) => setEncounterData(prev => ({ ...prev, assessment: { ...prev.assessment, clinicalImpression: e.target.value } }))}
                      placeholder="Summary of clinical findings and reasoning..."
                    />
                  </div>
                  {/* AI Suggestions */}
                  <div className="bg-violet-900/20 border border-violet-700 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-violet-400 mb-3 flex items-center gap-2"><Brain className="w-4 h-4" /> AI-Suggested Diagnoses</h3>
                    <div className="space-y-2">
                      {[
                        { code: 'J06.9', desc: 'Acute upper respiratory infection', prob: 45 },
                        { code: 'J20.9', desc: 'Acute bronchitis', prob: 30 },
                        { code: 'R05.9', desc: 'Cough, unspecified', prob: 15 },
                      ].map((s, i) => (
                        <button key={i} onClick={() => addDiagnosis({ code: s.code, description: s.desc })} className="w-full flex items-center justify-between bg-slate-900/50 border border-slate-700 rounded p-2 hover:border-violet-500">
                          <span className="text-sm text-slate-300"><span className="font-mono text-violet-400">{s.code}</span> - {s.desc}</span>
                          <Badge variant="purple" size="xs">{s.prob}%</Badge>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'plan' && (
                <div className="space-y-4">
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-teal-400 mb-3">Treatment Plan</h3>
                    <Input
                      rows={3}
                      value={encounterData.plan.treatment}
                      onChange={(e) => setEncounterData(prev => ({ ...prev, plan: { ...prev.plan, treatment: e.target.value } }))}
                      placeholder="Document treatment approach, procedures, recommendations..."
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Prescriptions */}
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2"><Pill className="w-4 h-4" /> Prescriptions</h3>
                      {encounterData.plan.prescriptions.length > 0 && (
                        <div className="space-y-2 mb-3">
                          {encounterData.plan.prescriptions.map((rx, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-900 rounded p-2 text-xs">
                              <div>
                                <span className="text-white font-medium">{rx.drug}</span>
                                <span className="text-slate-400 ml-1">{rx.strength}</span>
                              </div>
                              <button onClick={() => setEncounterData(prev => ({
                                ...prev,
                                plan: { ...prev.plan, prescriptions: prev.plan.prescriptions.filter((_, idx) => idx !== i) }
                              }))} className="text-slate-500 hover:text-rose-400"><X className="w-3 h-3" /></button>
                            </div>
                          ))}
                        </div>
                      )}
                      <Button variant="secondary" size="sm" icon={Plus} className="w-full" onClick={() => setShowPrescriptionModal(true)}>
                        Add Prescription
                      </Button>
                    </div>
                    {/* Lab Orders */}
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-sky-400 mb-3 flex items-center gap-2"><FlaskConical className="w-4 h-4" /> Lab Orders</h3>
                      {encounterData.plan.labOrders.length > 0 && (
                        <div className="space-y-2 mb-3">
                          {encounterData.plan.labOrders.map((lab, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-900 rounded p-2 text-xs">
                              <span className="text-white">{lab.tests.join(', ')}</span>
                              <button onClick={() => setEncounterData(prev => ({
                                ...prev,
                                plan: { ...prev.plan, labOrders: prev.plan.labOrders.filter((_, idx) => idx !== i) }
                              }))} className="text-slate-500 hover:text-rose-400"><X className="w-3 h-3" /></button>
                            </div>
                          ))}
                        </div>
                      )}
                      <Button variant="secondary" size="sm" icon={Plus} className="w-full" onClick={() => setShowLabOrderModal(true)}>
                        Add Lab Order
                      </Button>
                    </div>
                    {/* Referrals */}
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-violet-400 mb-3 flex items-center gap-2"><Share2 className="w-4 h-4" /> Referrals</h3>
                      {encounterData.plan.referrals.length > 0 && (
                        <div className="space-y-2 mb-3">
                          {encounterData.plan.referrals.map((ref, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-900 rounded p-2 text-xs">
                              <span className="text-white">{ref.specialty}</span>
                              <button onClick={() => setEncounterData(prev => ({
                                ...prev,
                                plan: { ...prev.plan, referrals: prev.plan.referrals.filter((_, idx) => idx !== i) }
                              }))} className="text-slate-500 hover:text-rose-400"><X className="w-3 h-3" /></button>
                            </div>
                          ))}
                        </div>
                      )}
                      <Button variant="secondary" size="sm" icon={Plus} className="w-full" onClick={() => setShowReferralModal(true)}>
                        Add Referral
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-teal-400 mb-3">Patient Education</h3>
                      <Input rows={2} value={encounterData.plan.patientEducation} onChange={(e) => setEncounterData(prev => ({ ...prev, plan: { ...prev.plan, patientEducation: e.target.value } }))} placeholder="Instructions provided to patient..." />
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-teal-400 mb-3">Follow-Up</h3>
                      <Input rows={2} value={encounterData.plan.followUp} onChange={(e) => setEncounterData(prev => ({ ...prev, plan: { ...prev.plan, followUp: e.target.value } }))} placeholder="Follow-up instructions, return visit timeline..." />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-slate-800 border-t border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            All changes are automatically saved and logged for HIPAA compliance
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" icon={Save} onClick={() => handleSave('draft')} disabled={isSaving}>Save Draft</Button>
            <Button variant="secondary" size="sm" icon={Printer}>Print</Button>
            <Button variant="success" size="sm" icon={FileSignature} onClick={() => handleSave('signed')} disabled={isSaving}>
              {isSaving ? 'Signing...' : 'Sign & Close'}
            </Button>
          </div>
        </div>
      </div>

      {/* Nested Modals */}
      <PrescriptionModal
        isOpen={showPrescriptionModal}
        onClose={() => setShowPrescriptionModal(false)}
        patient={patient}
        onSave={(rx) => {
          setEncounterData(prev => ({
            ...prev,
            plan: { ...prev.plan, prescriptions: [...prev.plan.prescriptions, rx] }
          }));
          setAuditLog(prev => [...prev, { timestamp: new Date().toISOString(), action: `Rx added: ${rx.drug}`, user: 'Dr. Jide Grand' }]);
        }}
      />

      <LabOrderModal
        isOpen={showLabOrderModal}
        onClose={() => setShowLabOrderModal(false)}
        patient={patient}
        onSave={(lab) => {
          setEncounterData(prev => ({
            ...prev,
            plan: { ...prev.plan, labOrders: [...prev.plan.labOrders, lab] }
          }));
          setAuditLog(prev => [...prev, { timestamp: new Date().toISOString(), action: `Lab ordered: ${lab.tests.join(', ')}`, user: 'Dr. Jide Grand' }]);
        }}
      />

      <ReferralModal
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
        patient={patient}
        onSave={(ref) => {
          setEncounterData(prev => ({
            ...prev,
            plan: { ...prev.plan, referrals: [...prev.plan.referrals, ref] }
          }));
          setAuditLog(prev => [...prev, { timestamp: new Date().toISOString(), action: `Referral: ${ref.specialty}`, user: 'Dr. Jide Grand' }]);
        }}
      />
    </div>
  );
};

// ============================================================================
// PRESCRIPTION MODAL
// ============================================================================

const PrescriptionModal = ({ isOpen, onClose, onSave, patient }) => {
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

  const sigTemplates = [
    'Take 1 tablet by mouth once daily',
    'Take 1 tablet by mouth twice daily',
    'Take 1 tablet by mouth three times daily',
    'Take 1 tablet by mouth every 8 hours',
    'Take 1 tablet by mouth at bedtime',
    'Take 2 tablets by mouth once daily',
    'Take as directed',
  ];

  const pharmacies = [
    'Shoppers Drug Mart #1234',
    'Rexall Pharmacy',
    'Costco Pharmacy',
    'Walmart Pharmacy',
    'Patient Pickup'
  ];

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
    if (!selectedDrug || !rxData.quantity || !rxData.sig) return;
    onSave({
      drug: selectedDrug.name,
      ...rxData,
      patientId: patient?.id,
      patientName: patient?.name
    });
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
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
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
                  <button key={d.name} onClick={() => handleSelectDrug(d)} className="w-full px-3 py-2 text-left text-sm hover:bg-teal-600 text-slate-300">
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
              {sigTemplates.slice(0, 4).map((sig, i) => (
                <button key={i} onClick={() => setRxData(prev => ({ ...prev, sig }))} className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded hover:bg-slate-600">
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
            options={pharmacies.map(p => ({ value: p, label: p }))}
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
            <Button variant="primary" size="sm" icon={Send} onClick={handleSave} disabled={!selectedDrug || !rxData.quantity || !rxData.sig}>
              Send to Pharmacy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// LAB ORDER MODAL
// ============================================================================

const LAB_TESTS = [
  { category: 'Chemistry', tests: ['BMP', 'CMP', 'Lipid Panel', 'HbA1c', 'TSH', 'Free T4', 'LFTs', 'Glucose'] },
  { category: 'Hematology', tests: ['CBC', 'CBC w/ Diff', 'PT/INR', 'PTT', 'D-Dimer'] },
  { category: 'Cardiac', tests: ['Troponin I', 'BNP', 'CK-MB'] },
  { category: 'Inflammatory', tests: ['ESR', 'CRP', 'Procalcitonin'] },
  { category: 'Urinalysis', tests: ['UA', 'Urine Culture', 'Urine Drug Screen'] },
];

const LabOrderModal = ({ isOpen, onClose, onSave, patient }) => {
  const [selectedTests, setSelectedTests] = useState([]);
  const [priority, setPriority] = useState('routine');
  const [facility, setFacility] = useState('Toronto General Lab');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');

  const facilities = ['Toronto General Lab', 'LifeLabs', 'Dynacare', 'Community Lab Services'];

  const toggleTest = (test) => {
    setSelectedTests(prev => 
      prev.includes(test) ? prev.filter(t => t !== test) : [...prev, test]
    );
  };

  const handleSave = () => {
    if (selectedTests.length === 0) return;
    onSave({ tests: selectedTests, priority, facility, diagnosis, notes, patientId: patient?.id });
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
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
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
              options={facilities.map(f => ({ value: f, label: f }))}
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

// ============================================================================
// REFERRAL MODAL
// ============================================================================

const SPECIALTIES = [
  'Cardiology', 'Neurology', 'Pulmonology', 'Gastroenterology', 'Endocrinology',
  'Rheumatology', 'Nephrology', 'Oncology', 'Orthopedics', 'Dermatology',
  'Ophthalmology', 'ENT', 'Urology', 'Psychiatry', 'Physical Therapy'
];

const ReferralModal = ({ isOpen, onClose, onSave, patient }) => {
  const [refData, setRefData] = useState({
    specialty: '', provider: '', facility: '', reason: '', priority: 'routine', notes: ''
  });

  const handleSave = () => {
    if (!refData.specialty || !refData.reason) return;
    onSave({ ...refData, patientId: patient?.id });
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
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
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
          <Button variant="primary" size="sm" icon={Send} onClick={handleSave} disabled={!refData.specialty || !refData.reason}>
            Send Referral
          </Button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// HEADER COMPONENTS
// ============================================================================

const TopHeader = ({ user, onLogout, onOpenSearch }) => (
  <div className="h-10 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 flex items-center justify-between px-3">
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-gradient-to-br from-teal-400 to-cyan-500 rounded flex items-center justify-center">
          <Stethoscope className="w-4 h-4 text-white" />
        </div>
        <span className="text-teal-400 font-bold text-sm">ExtendiLite</span>
      </div>
      <div className="text-xs text-slate-400 border-l border-slate-700 pl-4">
        TST – Hyperspace – <span className="text-cyan-400">{user.department}</span> – <span className="text-amber-400">{user.name.toUpperCase()}</span>
      </div>
    </div>
    <div className="flex-1 max-w-md mx-8">
      <button onClick={onOpenSearch} className="w-full flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm text-slate-400 hover:border-teal-500">
        <Search className="w-4 h-4" /><span>Search (Ctrl+Space)</span>
      </button>
    </div>
    <div className="flex items-center gap-2">
      <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded"><Bell className="w-4 h-4" /></button>
      <div className="flex items-center gap-2 px-2 py-1 bg-emerald-900/30 border border-emerald-700/50 rounded">
        <Shield className="w-3.5 h-3.5 text-emerald-400" /><span className="text-xs text-emerald-400 font-medium">HIPAA</span>
      </div>
      <button onClick={onLogout} className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded" title="Sign Out">
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const SecondaryToolbar = ({ activeSection, onNavigate }) => {
  const tools = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'patients', icon: Users, label: 'Patient Lookup' },
    { id: 'encounters', icon: FileText, label: 'Record Viewer' },
    { id: 'prescriptions', icon: Pill, label: 'e-Prescribing' },
    { id: 'labs', icon: FlaskConical, label: 'Lab Orders' },
    { id: 'referrals', icon: Share2, label: 'Referrals' },
  ];
  return (
    <div className="h-9 bg-slate-800 border-b border-slate-700 flex items-center px-2 gap-1">
      {tools.map(t => (
        <button key={t.id} onClick={() => onNavigate(t.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium ${activeSection === t.id ? 'bg-teal-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>
          <t.icon className="w-3.5 h-3.5" />{t.label}
        </button>
      ))}
      <div className="flex-1" />
      <span className="text-xs text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
  );
};

// ============================================================================
// PANELS
// ============================================================================

const LeftPanel = ({ collapsed, onToggle, onOpenSearch, recentRecords }) => (
  <div className={`bg-slate-900 border-r border-slate-700 flex flex-col transition-all ${collapsed ? 'w-10' : 'w-60'}`}>
    <div className="flex items-center justify-between px-2 py-2 border-b border-slate-700 bg-slate-800">
      {!collapsed && <span className="text-xs font-semibold text-teal-400">≡ Record Selection</span>}
      <button onClick={onToggle} className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded">
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </div>
    {!collapsed && (
      <>
        <div className="p-2 space-y-2 border-b border-slate-700">
          <button onClick={onOpenSearch} className="w-full flex items-center gap-2 px-2 py-2 text-xs text-left text-slate-300 hover:bg-teal-900/30 hover:text-teal-400 rounded border border-slate-700 hover:border-teal-600">
            <Search className="w-4 h-4" />Search for a Patient...
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <div className="text-xs font-medium text-slate-500 mb-2">Recent Patients</div>
          {recentRecords.length > 0 ? recentRecords.map(r => (
            <button key={r.id} className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-left text-slate-400 hover:bg-slate-800 rounded">
              <User className="w-3.5 h-3.5" /><span className="truncate">{r.name}</span>
            </button>
          )) : <p className="text-xs text-slate-600 italic">No recent records</p>}
        </div>
      </>
    )}
  </div>
);

const RightPanel = ({ collapsed, onToggle }) => (
  <div className={`bg-slate-900 border-l border-slate-700 flex flex-col transition-all ${collapsed ? 'w-10' : 'w-52'}`}>
    <div className="flex items-center justify-between px-2 py-2 border-b border-slate-700 bg-slate-800">
      <button onClick={onToggle} className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded">
        {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
      {!collapsed && <span className="text-xs font-semibold text-teal-400">Item Filters</span>}
    </div>
    {!collapsed && (
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        <Input label="Text Search" small />
        <div>
          <div className="text-xs text-slate-500 mb-1">Status</div>
          <div className="flex flex-wrap gap-1">
            <button className="px-2 py-1 text-xs bg-teal-600 text-white rounded">All</button>
            <button className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded">Active</button>
          </div>
        </div>
      </div>
    )}
  </div>
);

// ============================================================================
// DASHBOARD CONTENT
// ============================================================================

const DashboardContent = ({ queue, onSelectPatient, selectedPatient, patientDetail, onStartVideo, onStartEncounter }) => (
  <div className="flex-1 flex gap-4 p-4 overflow-hidden">
    {/* Queue */}
    <div className="w-80 flex flex-col bg-slate-800 rounded border border-slate-700 overflow-hidden">
      <div className="px-3 py-2 bg-slate-900 border-b border-slate-700 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-200">Patient Queue</span>
        <Badge variant="danger" size="xs">{queue.length}</Badge>
      </div>
      <div className="flex-1 overflow-y-auto">
        {queue.map(p => (
          <button key={p.id} onClick={() => onSelectPatient(p)} className={`w-full p-3 border-b border-slate-700 text-left hover:bg-slate-700/50 ${selectedPatient?.id === p.id ? 'bg-teal-900/30 border-l-2 border-l-teal-500' : ''}`}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-200 text-sm">{p.name}</span>
                {p.kioskStatus === 'waiting' && <LiveIndicator isLive={true} kioskId={p.kioskId} />}
              </div>
              <Badge variant={p.urgency === 'high' ? 'danger' : p.urgency === 'moderate' ? 'warning' : 'success'} size="xs">{p.triageScore}</Badge>
            </div>
            <p className="text-xs text-slate-400 mb-1 truncate">{p.reason}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>{p.age}yo {p.gender}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{p.waitTime}m</span>
              </div>
              <div className="flex items-center gap-1">
                {p.videoEnabled && <Video className="w-3 h-3 text-emerald-400" />}
                <Badge variant={p.source === 'KIOSK' ? 'info' : 'purple'} size="xs">{p.source}</Badge>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>

    {/* Detail */}
    <div className="flex-1 bg-slate-800 rounded border border-slate-700 overflow-hidden flex flex-col">
      {patientDetail ? (
        <>
          <div className="px-4 py-3 bg-slate-900 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold">
                  {patientDetail.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{patientDetail.name}</h2>
                    {patientDetail.kioskStatus === 'waiting' && <LiveIndicator isLive={true} kioskId={patientDetail.kioskId} />}
                  </div>
                  <div className="text-xs text-slate-400">{patientDetail.age}yo • {patientDetail.gender} • <span className="font-mono">{MOCK_PATIENTS.find(p => p.id === patientDetail.id)?.mrn}</span></div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {patientDetail.videoEnabled && (
                  <Button variant="video" size="sm" icon={Video} onClick={() => onStartVideo(patientDetail)}>
                    Join Video
                  </Button>
                )}
                <Button variant="primary" size="sm" icon={FileText} onClick={() => onStartEncounter(patientDetail)}>
                  Start Encounter
                </Button>
              </div>
            </div>
            {patientDetail.allergies?.length > 0 && (
              <div className="mt-2 flex items-center gap-2 px-2 py-1.5 bg-rose-900/30 border border-rose-700 rounded text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span className="text-rose-400 font-medium">Allergies:</span>
                <span className="text-rose-300">{patientDetail.allergies?.join(', ')}</span>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* KIOSK Status Banner */}
            {patientDetail.kioskStatus === 'waiting' && (
              <div className="bg-emerald-900/20 border border-emerald-700 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-900/50 rounded-full flex items-center justify-center">
                    <Laptop className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-emerald-400 font-medium">Patient Waiting at {patientDetail.kioskId}</p>
                    <p className="text-xs text-slate-400">Checked in at {patientDetail.checkedInAt} • Video conference ready</p>
                  </div>
                </div>
                <Button variant="video" size="sm" icon={Video} onClick={() => onStartVideo(patientDetail)}>
                  Connect Now
                </Button>
              </div>
            )}

            {/* Vitals */}
            <div>
              <h3 className="text-xs font-semibold text-teal-400 mb-2 flex items-center gap-2"><Activity className="w-4 h-4" /> CURRENT VITALS</h3>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { label: 'BP', value: patientDetail.vitals?.bp, icon: Heart, status: parseInt(patientDetail.vitals?.bp) > 140 ? 'high' : 'normal' },
                  { label: 'HR', value: patientDetail.vitals?.hr, icon: Activity, status: patientDetail.vitals?.hr > 90 ? 'high' : 'normal' },
                  { label: 'Temp', value: patientDetail.vitals?.temp, icon: Thermometer, status: patientDetail.vitals?.temp > 37.5 ? 'high' : 'normal' },
                  { label: 'SpO2', value: `${patientDetail.vitals?.spo2}%`, icon: Activity, status: patientDetail.vitals?.spo2 < 95 ? 'low' : 'normal' },
                  { label: 'Weight', value: '187', icon: Weight, status: 'normal' },
                ].map((v, i) => (
                  <div key={i} className={`p-2 rounded border ${v.status === 'high' ? 'bg-rose-900/20 border-rose-700' : v.status === 'low' ? 'bg-amber-900/20 border-amber-700' : 'bg-slate-900 border-slate-700'}`}>
                    <v.icon className={`w-3.5 h-3.5 mb-1 ${v.status === 'high' ? 'text-rose-400' : v.status === 'low' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <div className={`text-lg font-bold ${v.status === 'high' ? 'text-rose-400' : v.status === 'low' ? 'text-amber-400' : 'text-white'}`}>{v.value}</div>
                    <div className="text-xs text-slate-500">{v.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Triage */}
            <div>
              <h3 className="text-xs font-semibold text-violet-400 mb-2 flex items-center gap-2"><Brain className="w-4 h-4" /> AI PRE-DIAGNOSIS</h3>
              <div className="bg-violet-900/20 border border-violet-700 rounded p-3">
                <p className="text-sm text-slate-300 mb-2">{patientDetail.reason}</p>
                <div className="space-y-2">
                  {[
                    { name: 'Angina Pectoris', probability: 45 },
                    { name: 'Anxiety-related', probability: 30 },
                    { name: 'Costochondritis', probability: 15 },
                    { name: 'GERD', probability: 10 },
                  ].map((c, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1"><span className="text-slate-300">{c.name}</span><span className="text-violet-400">{c.probability}%</span></div>
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-violet-500 rounded-full" style={{ width: `${c.probability}%` }} /></div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {['ECG', 'Cardiac enzymes', 'Stress test'].map((r, i) => <Badge key={i} variant="purple" size="xs">{r}</Badge>)}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center"><Users className="w-12 h-12 text-slate-600 mx-auto mb-3" /><p className="text-slate-400">Select a patient from the queue</p></div>
        </div>
      )}
    </div>
  </div>
);

// ============================================================================
// PATIENT SEARCH MODAL
// ============================================================================

const PatientSearchModal = ({ isOpen, onClose, onSelect }) => {
  const [searchFields, setSearchFields] = useState({ mrn: '', firstName: '', lastName: '' });
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    const filtered = MOCK_PATIENTS.filter(p => {
      if (searchFields.mrn && !p.mrn.toLowerCase().includes(searchFields.mrn.toLowerCase())) return false;
      if (searchFields.firstName && !p.firstName.toLowerCase().includes(searchFields.firstName.toLowerCase())) return false;
      if (searchFields.lastName && !p.lastName.toLowerCase().includes(searchFields.lastName.toLowerCase())) return false;
      return true;
    });
    setResults(filtered);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-3xl border border-slate-600 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-700">
          <h2 className="text-teal-400 font-medium">Search for a Patient</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-4 gap-3 mb-4">
            <Input label="MRN/HCN" value={searchFields.mrn} onChange={(e) => setSearchFields(p => ({ ...p, mrn: e.target.value }))} small />
            <Input label="First Name" value={searchFields.firstName} onChange={(e) => setSearchFields(p => ({ ...p, firstName: e.target.value }))} small />
            <Input label="Last Name" value={searchFields.lastName} onChange={(e) => setSearchFields(p => ({ ...p, lastName: e.target.value }))} small />
            <div className="flex items-end"><Button variant="primary" size="sm" icon={Search} onClick={handleSearch}>Find</Button></div>
          </div>
          <div className="h-48 overflow-y-auto bg-slate-900/30 border border-slate-700 rounded">
            {results.length > 0 ? (
              <table className="w-full text-xs">
                <thead className="bg-slate-800 sticky top-0"><tr className="text-slate-400"><th className="px-3 py-2 text-left">MRN</th><th className="px-3 py-2 text-left">Name</th><th className="px-3 py-2 text-left">DOB</th><th className="px-3 py-2 text-left">Phone</th></tr></thead>
                <tbody>
                  {results.map(p => (
                    <tr key={p.id} onClick={() => { onSelect(p); onClose(); }} className="border-t border-slate-700 hover:bg-teal-900/30 cursor-pointer text-slate-300">
                      <td className="px-3 py-2 font-mono">{p.mrn}</td>
                      <td className="px-3 py-2">{p.lastName}, {p.firstName}</td>
                      <td className="px-3 py-2">{p.dob}</td>
                      <td className="px-3 py-2">{p.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 text-sm"><Info className="w-4 h-4 mr-2" />Enter search criteria and click Find</div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-4 py-3 bg-slate-900 border-t border-slate-700">
          <Button variant="danger" size="sm" icon={X} onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APP
// ============================================================================

export default function ExtendiLiteEMR() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(true);
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDetail, setPatientDetail] = useState(null);
  const [recentRecords, setRecentRecords] = useState([]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showEncounterModal, setShowEncounterModal] = useState(false);
  const [videoPatient, setVideoPatient] = useState(null);
  const [encounterPatient, setEncounterPatient] = useState(null);

  const handleLogin = (userData) => { setUser(userData); setIsAuthenticated(true); };
  const handleLogout = () => { setIsAuthenticated(false); setUser(null); };
  
  const handleSelectPatient = (p) => {
    setSelectedPatient(p);
    const fullPatient = MOCK_PATIENTS.find(mp => mp.id === p.id) || p;
    setPatientDetail({ ...fullPatient, ...p });
    setRecentRecords(prev => [p, ...prev.filter(r => r.id !== p.id)].slice(0, 5));
  };

  const handleStartVideo = (patient) => {
    setVideoPatient(patient);
    setShowVideoModal(true);
  };

  const handleStartEncounter = (patient) => {
    setEncounterPatient(patient || patientDetail);
    setShowEncounterModal(true);
  };

  if (!isAuthenticated) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-200">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');*{font-family:'Inter',sans-serif}`}</style>
      
      <TopHeader user={user} onLogout={handleLogout} onOpenSearch={() => setShowPatientSearch(true)} />
      <SecondaryToolbar activeSection={activeSection} onNavigate={setActiveSection} />
      
      <div className="flex-1 flex overflow-hidden">
        <LeftPanel collapsed={leftCollapsed} onToggle={() => setLeftCollapsed(!leftCollapsed)} onOpenSearch={() => setShowPatientSearch(true)} recentRecords={recentRecords} />
        
        {activeSection === 'dashboard' && (
          <DashboardContent 
            queue={MOCK_QUEUE} 
            onSelectPatient={handleSelectPatient} 
            selectedPatient={selectedPatient} 
            patientDetail={patientDetail}
            onStartVideo={handleStartVideo}
            onStartEncounter={handleStartEncounter}
          />
        )}
        
        <RightPanel collapsed={rightCollapsed} onToggle={() => setRightCollapsed(!rightCollapsed)} />
      </div>

      <PatientSearchModal isOpen={showPatientSearch} onClose={() => setShowPatientSearch(false)} onSelect={handleSelectPatient} />
      
      <VideoConferenceModal 
        isOpen={showVideoModal} 
        onClose={() => setShowVideoModal(false)} 
        patient={videoPatient}
        onStartEncounter={() => { setShowVideoModal(false); handleStartEncounter(videoPatient); }}
      />
      
      <EncounterModal
        isOpen={showEncounterModal}
        onClose={() => setShowEncounterModal(false)}
        patient={encounterPatient}
        onSave={(data) => console.log('Encounter saved:', data)}
      />
    </div>
  );
}