import React, { useState, useEffect } from 'react';
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, ScreenShare, 
  FileText, ShieldCheck, ShieldAlert, CheckCircle, Activity, 
  Heart, Thermometer, AlertTriangle, Wifi, Maximize2, Minimize2, X
} from 'lucide-react';
import Button from '../components/ui/Button';
import { useToast } from '../contexts';

const VideoConferenceModal = ({ isOpen, onClose, patient, onStartEncounter }) => {
  const toast = useToast();
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [showConsent, setShowConsent] = useState(true);
  const [consentGiven, setConsentGiven] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (isOpen && consentGiven) {
      setIsConnecting(true);
      const timer = setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
        toast.success(`Connected to ${patient?.name}`);
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
    setIsMinimized(false);
    toast.info('Call ended');
    onClose();
  };

  const handleConsent = () => {
    setShowConsent(false);
    setConsentGiven(true);
  };

  const handleStartDocumentation = () => {
    setIsMinimized(true);
    onStartEncounter();
  };

  const handleExpand = () => {
    setIsMinimized(false);
  };

  if (!isOpen) return null;

  // ============================================================================
  // MINIMIZED VIEW (Picture-in-Picture style)
  // ============================================================================
  if (isMinimized && isConnected) {
    return (
      <div className="fixed bottom-4 right-4 w-80 bg-slate-900 rounded-xl border border-slate-700 shadow-2xl z-50 overflow-hidden">
        {/* Mini Header */}
        <div className="px-3 py-2 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-white font-medium">{patient?.name}</span>
            <span className="text-xs text-emerald-400 font-mono">{formatDuration(callDuration)}</span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={handleExpand}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded"
              title="Expand"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button 
              onClick={handleEndCall}
              className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded"
              title="End Call"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mini Video Area */}
        <div className="h-44 bg-slate-950 relative flex">
          {/* Patient */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto">
                {patient?.name?.split(' ').map(n => n[0]).join('')}
              </div>
              <p className="text-xs text-slate-400 mt-1">{patient?.name?.split(' ')[0]}</p>
            </div>
          </div>
          
          {/* Provider (small) */}
          <div className="absolute bottom-2 right-2 w-14 h-14 bg-slate-800 rounded-lg border border-slate-600 flex items-center justify-center">
            {isVideoOff ? (
              <VideoOff className="w-5 h-5 text-slate-600" />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                JG
              </div>
            )}
          </div>

          {/* Connection indicator */}
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-emerald-900/50 rounded text-xs text-emerald-400">
            <Wifi className="w-3 h-3" />
            Connected
          </div>
        </div>

        {/* Mini Controls */}
        <div className="px-3 py-2 bg-slate-800 border-t border-slate-700 flex items-center justify-center gap-2">
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className={`p-2 rounded-full ${isMuted ? 'bg-rose-600' : 'bg-slate-700'} hover:opacity-80`}
          >
            {isMuted ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-white" />}
          </button>
          <button 
            onClick={() => setIsVideoOff(!isVideoOff)} 
            className={`p-2 rounded-full ${isVideoOff ? 'bg-rose-600' : 'bg-slate-700'} hover:opacity-80`}
          >
            {isVideoOff ? <VideoOff className="w-4 h-4 text-white" /> : <Video className="w-4 h-4 text-white" />}
          </button>
          <button 
            onClick={handleEndCall} 
            className="p-2 rounded-full bg-rose-600 hover:bg-rose-500"
          >
            <PhoneOff className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // FULL MODAL VIEW
  // ============================================================================
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="w-full max-w-5xl h-[90vh] bg-slate-900 rounded-xl border border-slate-700 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Video className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-white font-medium">Telemedicine Session</h2>
              <p className="text-xs text-slate-400">{patient?.name} - {patient?.kioskId}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isConnected && (
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-900/30 border border-emerald-700 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
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
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    Patient identity has been verified
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    Patient has consented to telemedicine visit
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    This session will be logged for audit purposes
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    Connection is encrypted end-to-end (256-bit AES)
                  </li>
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
                    <p className="text-slate-400 text-sm">{patient?.age}yo - {patient?.gender} - {patient?.kioskId}</p>
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
                  <h4 className="text-xs font-semibold text-teal-400 mb-2 flex items-center gap-1">
                    <Activity className="w-3 h-3" /> LIVE VITALS
                  </h4>
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
                <button 
                  onClick={() => setIsMuted(!isMuted)} 
                  className={`p-3 rounded-full ${isMuted ? 'bg-rose-600' : 'bg-slate-700'} hover:opacity-80`}
                >
                  {isMuted ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
                </button>
                <button 
                  onClick={() => setIsVideoOff(!isVideoOff)} 
                  className={`p-3 rounded-full ${isVideoOff ? 'bg-rose-600' : 'bg-slate-700'} hover:opacity-80`}
                >
                  {isVideoOff ? <VideoOff className="w-5 h-5 text-white" /> : <Video className="w-5 h-5 text-white" />}
                </button>
                <button className="p-3 rounded-full bg-slate-700 hover:opacity-80">
                  <ScreenShare className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="primary" icon={FileText} onClick={handleStartDocumentation}>
                  Start Documentation
                </Button>
                <button 
                  onClick={() => setIsMinimized(true)}
                  className="p-3 rounded-full bg-slate-700 hover:opacity-80"
                  title="Minimize"
                >
                  <Minimize2 className="w-5 h-5 text-white" />
                </button>
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

export default VideoConferenceModal;
