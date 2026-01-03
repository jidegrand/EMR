import React, { useState } from 'react';

// Context
import { ToastProvider, ThemeProvider, useTheme } from './contexts';

// Layout Components
import { TopHeader, SecondaryToolbar, LeftPanel, RightPanel } from './components/layout';

// Screens
import { 
  LoginScreen, DashboardContent, RecordViewer, SettingsPage, 
  AppointmentScheduler, MessageCenter, PrescriptionHistory, 
  LabOrdersHistory, ReferralsTracking, PatientLookup 
} from './screens';

// Modals
import { 
  VideoConferenceModal, EncounterModal, PatientSearchModal, 
  PatientRegistrationModal, AppointmentModal, ComposeMessageModal,
  LogoutConfirmModal, SessionTimeoutModal
} from './modals';

// Data
import { MOCK_PATIENTS, MOCK_QUEUE } from './data';

// ============================================================================
// THEMED APP WRAPPER - Applies theme classes to root
// ============================================================================

const ThemedApp = ({ children }) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`h-screen flex flex-col ${
      isDark 
        ? 'bg-slate-900 text-slate-200' 
        : 'bg-slate-100 text-slate-800'
    }`}>
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');*{font-family:'Inter',sans-serif}`}</style>
      {children}
    </div>
  );
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function ExtendiLiteEMR() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  
  // Navigation State
  const [activeSection, setActiveSection] = useState('dashboard');
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(true);
  
  // Patient State
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDetail, setPatientDetail] = useState(null);
  const [recentRecords, setRecentRecords] = useState([]);
  
  // Modal State
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [showPatientRegistration, setShowPatientRegistration] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showComposeMessage, setShowComposeMessage] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showEncounterModal, setShowEncounterModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [videoPatient, setVideoPatient] = useState(null);
  const [encounterPatient, setEncounterPatient] = useState(null);

  // Handlers
  const handleLogin = (userData) => { 
    setUser(userData); 
    setIsAuthenticated(true); 
  };
  
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };
  
  const handleLogoutConfirm = () => { 
    setIsAuthenticated(false); 
    setUser(null);
    setShowLogoutModal(false);
    setActiveSection('dashboard');
  };
  
  const handleSessionTimeout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setActiveSection('dashboard');
  };
  
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

  // Render Login if not authenticated
  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        <ToastProvider>
          <LoginScreen onLogin={handleLogin} />
        </ToastProvider>
      </ThemeProvider>
    );
  }

  // Render Main Application
  return (
    <ThemeProvider>
      <ToastProvider>
        <ThemedApp>
          {/* Top Header */}
          <TopHeader 
            user={user} 
            onLogout={handleLogoutClick} 
            onOpenSearch={() => setShowPatientSearch(true)}
            onOpenSettings={() => setActiveSection('settings')}
          />
          
          {/* Secondary Toolbar / Navigation */}
          <SecondaryToolbar 
            activeSection={activeSection} 
            onNavigate={setActiveSection} 
          />
          
          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel */}
            <LeftPanel 
              collapsed={leftCollapsed} 
              onToggle={() => setLeftCollapsed(!leftCollapsed)} 
              onOpenSearch={() => setShowPatientSearch(true)}
              onRegisterPatient={() => setShowPatientRegistration(true)}
              recentRecords={recentRecords} 
            />
            
            {/* Dashboard Content */}
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
            
            {/* Record Viewer */}
            {activeSection === 'encounters' && (
              <RecordViewer />
            )}
            
            {/* Settings Page */}
            {activeSection === 'settings' && (
              <SettingsPage user={user} />
            )}
            
            {/* Appointment Scheduler */}
            {activeSection === 'appointments' && (
              <AppointmentScheduler 
                onNewAppointment={() => setShowAppointmentModal(true)}
              />
            )}
            
            {/* Message Center */}
            {activeSection === 'messages' && (
              <MessageCenter 
                onCompose={() => setShowComposeMessage(true)}
              />
            )}
            
            {/* Prescription History */}
            {activeSection === 'prescriptions' && (
              <PrescriptionHistory />
            )}
            
            {/* Lab Orders History */}
            {activeSection === 'labs' && (
              <LabOrdersHistory />
            )}
            
            {/* Referrals Tracking */}
            {activeSection === 'referrals' && (
              <ReferralsTracking />
            )}
            
            {/* Patient Lookup */}
            {activeSection === 'patients' && (
              <PatientLookup 
                onSelectPatient={(patient) => {
                  handleSelectPatient(patient);
                  setActiveSection('dashboard');
                }}
                onRegisterNew={() => setShowPatientRegistration(true)}
                onViewChart={(patient) => {
                  handleSelectPatient(patient);
                  setActiveSection('dashboard');
                }}
              />
            )}
            
            {/* Right Panel */}
            <RightPanel 
              collapsed={rightCollapsed} 
              onToggle={() => setRightCollapsed(!rightCollapsed)} 
            />
          </div>

          {/* Modals */}
          <PatientSearchModal 
            isOpen={showPatientSearch} 
            onClose={() => setShowPatientSearch(false)} 
            onSelect={handleSelectPatient} 
          />
          
          <PatientRegistrationModal
            isOpen={showPatientRegistration}
            onClose={() => setShowPatientRegistration(false)}
            onSave={(patient) => console.log('New patient registered:', patient)}
          />
          
          <VideoConferenceModal 
            isOpen={showVideoModal} 
            onClose={() => setShowVideoModal(false)} 
            patient={videoPatient}
            onStartEncounter={() => { 
              // Don't close - let it minimize instead
              handleStartEncounter(videoPatient); 
            }}
          />
          
          <EncounterModal
            isOpen={showEncounterModal}
            onClose={() => setShowEncounterModal(false)}
            patient={encounterPatient}
            onSave={(data) => console.log('Encounter saved:', data)}
          />
          
          <AppointmentModal
            isOpen={showAppointmentModal}
            onClose={() => setShowAppointmentModal(false)}
            onSave={(apt) => console.log('Appointment scheduled:', apt)}
          />
          
          <ComposeMessageModal
            isOpen={showComposeMessage}
            onClose={() => setShowComposeMessage(false)}
            onSend={(msg) => console.log('Message sent:', msg)}
          />
          
          <LogoutConfirmModal
            isOpen={showLogoutModal}
            onClose={() => setShowLogoutModal(false)}
            onConfirm={handleLogoutConfirm}
            userName={user?.name}
          />
          
          <SessionTimeoutModal
            timeoutMinutes={15}
            warningSeconds={60}
            onTimeout={handleSessionTimeout}
            isAuthenticated={isAuthenticated}
          />
        </ThemedApp>
      </ToastProvider>
    </ThemeProvider>
  );
}
