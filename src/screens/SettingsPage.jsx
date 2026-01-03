import React, { useState } from 'react';
import { 
  Settings, User, Bell, Shield, Monitor, Info, 
  Save, Camera, Mail, Phone, Building, Award,
  Moon, Sun, Volume2, VolumeX, Lock, Key, Smartphone,
  Clock, Calendar, FileText, Stethoscope
} from 'lucide-react';
import { Button, Input, Select } from '../components/ui';
import { useTheme } from '../contexts';
import { useToast } from '../contexts';

const SettingsPage = ({ user }) => {
  const { isDark, toggleTheme } = useTheme();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile state
  const [profile, setProfile] = useState({
    firstName: user?.name?.split(' ')[0] || 'Jide',
    lastName: user?.name?.split(' ').slice(1).join(' ') || 'Grand',
    email: 'jide.grand@extendilite.com',
    phone: '(416) 555-0199',
    department: user?.department || 'Internal Medicine',
    npi: '1234567890',
    license: 'CPSO-12345',
  });

  // Notification state
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    desktopNotifications: true,
    soundEnabled: true,
    newPatient: true,
    labResults: true,
    prescriptionAlerts: true,
    appointmentReminders: true,
  });

  // Preferences state
  const [preferences, setPreferences] = useState({
    defaultView: 'dashboard',
    autoSaveInterval: '30',
    sessionTimeout: '30',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    language: 'en',
  });

  // Security state
  const [security, setSecurity] = useState({
    twoFactorEnabled: true,
    lastPasswordChange: '2024-11-15',
    activeSessions: 2,
  });

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences saved');
  };

  const handleSavePreferences = () => {
    toast.success('Preferences saved');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Monitor },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <div className="flex-1 flex flex-col p-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-slate-700 rounded-lg">
          <Settings className="w-6 h-6 text-slate-300" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Settings</h1>
          <p className="text-sm text-slate-400">Manage your account and preferences</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Sidebar Tabs */}
        <div className={`w-48 rounded-lg border overflow-hidden ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-left transition-colors ${
                activeTab === tab.id
                  ? isDark 
                    ? 'bg-teal-900/30 text-teal-400 border-l-2 border-teal-500' 
                    : 'bg-teal-50 text-teal-600 border-l-2 border-teal-500'
                  : isDark
                    ? 'text-slate-400 hover:bg-slate-700 hover:text-white'
                    : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className={`flex-1 rounded-lg border overflow-y-auto ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="p-6">
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Profile Information
              </h2>
              
              {/* Avatar Section */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {profile.firstName[0]}{profile.lastName[0]}
                </div>
                <div>
                  <Button variant="secondary" size="sm" icon={Camera}>
                    Change Photo
                  </Button>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    icon={User}
                  />
                  <Input
                    label="Last Name"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    icon={Mail}
                  />
                  <Input
                    label="Phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    icon={Phone}
                  />
                </div>
                <Select
                  label="Department"
                  value={profile.department}
                  onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  options={[
                    { value: 'Internal Medicine', label: 'Internal Medicine' },
                    { value: 'Family Medicine', label: 'Family Medicine' },
                    { value: 'Pediatrics', label: 'Pediatrics' },
                    { value: 'Cardiology', label: 'Cardiology' },
                    { value: 'Neurology', label: 'Neurology' },
                    { value: 'Emergency', label: 'Emergency Medicine' },
                  ]}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="NPI Number"
                    value={profile.npi}
                    onChange={(e) => setProfile({ ...profile, npi: e.target.value })}
                    icon={Award}
                  />
                  <Input
                    label="License Number"
                    value={profile.license}
                    onChange={(e) => setProfile({ ...profile, license: e.target.value })}
                    icon={FileText}
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700">
                <Button variant="primary" icon={Save} onClick={handleSaveProfile}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="p-6">
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Notification Preferences
              </h2>

              <div className="space-y-6">
                {/* Delivery Methods */}
                <div>
                  <h3 className={`text-sm font-medium mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Delivery Methods
                  </h3>
                  <div className="space-y-3">
                    <ToggleOption
                      label="Email Alerts"
                      description="Receive notifications via email"
                      icon={Mail}
                      checked={notifications.emailAlerts}
                      onChange={() => setNotifications({ ...notifications, emailAlerts: !notifications.emailAlerts })}
                      isDark={isDark}
                    />
                    <ToggleOption
                      label="SMS Alerts"
                      description="Receive text message notifications"
                      icon={Smartphone}
                      checked={notifications.smsAlerts}
                      onChange={() => setNotifications({ ...notifications, smsAlerts: !notifications.smsAlerts })}
                      isDark={isDark}
                    />
                    <ToggleOption
                      label="Desktop Notifications"
                      description="Show browser push notifications"
                      icon={Monitor}
                      checked={notifications.desktopNotifications}
                      onChange={() => setNotifications({ ...notifications, desktopNotifications: !notifications.desktopNotifications })}
                      isDark={isDark}
                    />
                    <ToggleOption
                      label="Sound Alerts"
                      description="Play sound for new notifications"
                      icon={notifications.soundEnabled ? Volume2 : VolumeX}
                      checked={notifications.soundEnabled}
                      onChange={() => setNotifications({ ...notifications, soundEnabled: !notifications.soundEnabled })}
                      isDark={isDark}
                    />
                  </div>
                </div>

                {/* Notification Types */}
                <div>
                  <h3 className={`text-sm font-medium mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Notification Types
                  </h3>
                  <div className="space-y-3">
                    <ToggleOption
                      label="New Patient Arrivals"
                      description="Alert when patients check in"
                      icon={User}
                      checked={notifications.newPatient}
                      onChange={() => setNotifications({ ...notifications, newPatient: !notifications.newPatient })}
                      isDark={isDark}
                    />
                    <ToggleOption
                      label="Lab Results"
                      description="Notify when lab results are ready"
                      icon={FileText}
                      checked={notifications.labResults}
                      onChange={() => setNotifications({ ...notifications, labResults: !notifications.labResults })}
                      isDark={isDark}
                    />
                    <ToggleOption
                      label="Prescription Alerts"
                      description="Drug interaction and refill alerts"
                      icon={Shield}
                      checked={notifications.prescriptionAlerts}
                      onChange={() => setNotifications({ ...notifications, prescriptionAlerts: !notifications.prescriptionAlerts })}
                      isDark={isDark}
                    />
                    <ToggleOption
                      label="Appointment Reminders"
                      description="Upcoming appointment notifications"
                      icon={Calendar}
                      checked={notifications.appointmentReminders}
                      onChange={() => setNotifications({ ...notifications, appointmentReminders: !notifications.appointmentReminders })}
                      isDark={isDark}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700">
                <Button variant="primary" icon={Save} onClick={handleSaveNotifications}>
                  Save Preferences
                </Button>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="p-6">
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Application Preferences
              </h2>

              <div className="space-y-6">
                {/* Appearance */}
                <div>
                  <h3 className={`text-sm font-medium mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Appearance
                  </h3>
                  <div className={`flex items-center justify-between p-4 rounded-lg border ${
                    isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      {isDark ? <Moon className="w-5 h-5 text-slate-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          {isDark ? 'Dark Mode' : 'Light Mode'}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {isDark ? 'Easy on the eyes' : 'Bright and clear'}
                        </p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" onClick={toggleTheme}>
                      Switch to {isDark ? 'Light' : 'Dark'}
                    </Button>
                  </div>
                </div>

                {/* Default Settings */}
                <div>
                  <h3 className={`text-sm font-medium mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Default Settings
                  </h3>
                  <div className="space-y-4">
                    <Select
                      label="Default View"
                      value={preferences.defaultView}
                      onChange={(e) => setPreferences({ ...preferences, defaultView: e.target.value })}
                      options={[
                        { value: 'dashboard', label: 'Dashboard' },
                        { value: 'encounters', label: 'Record Viewer' },
                        { value: 'patients', label: 'Patient Lookup' },
                      ]}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Select
                        label="Auto-Save Interval"
                        value={preferences.autoSaveInterval}
                        onChange={(e) => setPreferences({ ...preferences, autoSaveInterval: e.target.value })}
                        options={[
                          { value: '15', label: 'Every 15 seconds' },
                          { value: '30', label: 'Every 30 seconds' },
                          { value: '60', label: 'Every minute' },
                          { value: '0', label: 'Disabled' },
                        ]}
                      />
                      <Select
                        label="Session Timeout"
                        value={preferences.sessionTimeout}
                        onChange={(e) => setPreferences({ ...preferences, sessionTimeout: e.target.value })}
                        options={[
                          { value: '15', label: '15 minutes' },
                          { value: '30', label: '30 minutes' },
                          { value: '60', label: '1 hour' },
                          { value: '120', label: '2 hours' },
                        ]}
                      />
                    </div>
                  </div>
                </div>

                {/* Regional */}
                <div>
                  <h3 className={`text-sm font-medium mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Regional Settings
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <Select
                      label="Date Format"
                      value={preferences.dateFormat}
                      onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
                      options={[
                        { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                        { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                        { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                      ]}
                    />
                    <Select
                      label="Time Format"
                      value={preferences.timeFormat}
                      onChange={(e) => setPreferences({ ...preferences, timeFormat: e.target.value })}
                      options={[
                        { value: '12h', label: '12-hour' },
                        { value: '24h', label: '24-hour' },
                      ]}
                    />
                    <Select
                      label="Language"
                      value={preferences.language}
                      onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                      options={[
                        { value: 'en', label: 'English' },
                        { value: 'fr', label: 'Français' },
                        { value: 'es', label: 'Español' },
                      ]}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700">
                <Button variant="primary" icon={Save} onClick={handleSavePreferences}>
                  Save Preferences
                </Button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="p-6">
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Security Settings
              </h2>

              <div className="space-y-6">
                {/* Password */}
                <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Lock className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>Password</p>
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          Last changed: {security.lastPasswordChange}
                        </p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">
                      Change Password
                    </Button>
                  </div>
                </div>

                {/* Two-Factor Auth */}
                <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Key className={`w-5 h-5 ${security.twoFactorEnabled ? 'text-emerald-400' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          Two-Factor Authentication
                        </p>
                        <p className={`text-xs ${security.twoFactorEnabled ? 'text-emerald-400' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {security.twoFactorEnabled ? 'Enabled - Your account is protected' : 'Disabled - Enable for extra security'}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant={security.twoFactorEnabled ? 'secondary' : 'primary'} 
                      size="sm"
                      onClick={() => setSecurity({ ...security, twoFactorEnabled: !security.twoFactorEnabled })}
                    >
                      {security.twoFactorEnabled ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </div>

                {/* Active Sessions */}
                <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Monitor className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>Active Sessions</p>
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {security.activeSessions} device(s) currently logged in
                        </p>
                      </div>
                    </div>
                    <Button variant="danger" size="sm">
                      Sign Out All
                    </Button>
                  </div>
                </div>

                {/* HIPAA Compliance */}
                <div className={`p-4 rounded-lg border border-emerald-700/50 bg-emerald-900/20`}>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-sm font-medium text-emerald-400">HIPAA Compliant</p>
                      <p className="text-xs text-emerald-300/70">
                        All data is encrypted at rest and in transit. Access logs are maintained for audit purposes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="p-6">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="w-10 h-10 text-white" />
                </div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  ExtendiLite EMR
                </h2>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Provider Portal
                </p>
              </div>

              <div className={`space-y-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                <div className={`flex justify-between py-2 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                  <span>Version</span>
                  <span className="font-mono">2.4.1</span>
                </div>
                <div className={`flex justify-between py-2 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                  <span>Build</span>
                  <span className="font-mono">2024.12.20</span>
                </div>
                <div className={`flex justify-between py-2 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                  <span>Environment</span>
                  <span className="font-mono text-emerald-400">Production</span>
                </div>
                <div className={`flex justify-between py-2 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                  <span>Server Region</span>
                  <span className="font-mono">CA-Toronto</span>
                </div>
              </div>

              <div className={`mt-8 p-4 rounded-lg ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  © 2024 ExtendiLite Health Systems Inc. All rights reserved.
                  <br /><br />
                  This software is intended for use by licensed healthcare providers only. 
                  Unauthorized access is prohibited and may be subject to civil and criminal penalties.
                </p>
              </div>

              <div className="mt-6 flex justify-center gap-4">
                <Button variant="secondary" size="sm">Privacy Policy</Button>
                <Button variant="secondary" size="sm">Terms of Service</Button>
                <Button variant="secondary" size="sm">Contact Support</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Toggle Option Component
const ToggleOption = ({ label, description, icon: Icon, checked, onChange, isDark }) => (
  <div className={`flex items-center justify-between p-3 rounded-lg border ${
    isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
  }`}>
    <div className="flex items-center gap-3">
      <Icon className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
      <div>
        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{label}</p>
        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{description}</p>
      </div>
    </div>
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        checked ? 'bg-teal-600' : isDark ? 'bg-slate-600' : 'bg-slate-300'
      }`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`} />
    </button>
  </div>
);

export default SettingsPage;
