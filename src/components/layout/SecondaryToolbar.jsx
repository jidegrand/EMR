import React from 'react';
import { Home, Users, FileText, Pill, FlaskConical, Share2, Calendar, Mail } from 'lucide-react';
import { useTheme } from '../../contexts';

const SecondaryToolbar = ({ activeSection, onNavigate }) => {
  const { isDark } = useTheme();
  
  const tools = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'appointments', icon: Calendar, label: 'Appointments' },
    { id: 'messages', icon: Mail, label: 'Messages' },
    { id: 'patients', icon: Users, label: 'Patient Lookup' },
    { id: 'encounters', icon: FileText, label: 'Record Viewer' },
    { id: 'prescriptions', icon: Pill, label: 'e-Prescribing' },
    { id: 'labs', icon: FlaskConical, label: 'Lab Orders' },
    { id: 'referrals', icon: Share2, label: 'Referrals' },
  ];
  
  return (
    <div className={`h-9 border-b flex items-center px-2 gap-1 ${
      isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      {tools.map(t => (
        <button 
          key={t.id} 
          onClick={() => onNavigate(t.id)} 
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium ${
            activeSection === t.id 
              ? 'bg-teal-600 text-white' 
              : isDark 
                ? 'text-slate-300 hover:bg-slate-700' 
                : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <t.icon className="w-3.5 h-3.5" />
          {t.label}
        </button>
      ))}
      <div className="flex-1" />
      <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
};

export default SecondaryToolbar;
