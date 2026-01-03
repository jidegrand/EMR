import React, { useState } from 'react';
import { Clock, Video, FileText, Activity, Heart, Thermometer, Weight, AlertTriangle, Brain, Users, Laptop, History } from 'lucide-react';
import { Badge, Button } from '../components/ui';
import LiveIndicator from '../components/LiveIndicator';
import EncounterHistory from '../components/EncounterHistory';
import { ReAuthModal, EncounterViewerModal } from '../modals';
import { MOCK_PATIENTS, ENCOUNTER_HISTORY } from '../data';
import { useToast } from '../contexts';

const DashboardContent = ({ queue, onSelectPatient, selectedPatient, patientDetail, onStartVideo, onStartEncounter }) => {
  const toast = useToast();
  const [showReAuth, setShowReAuth] = useState(false);
  const [showEncounterViewer, setShowEncounterViewer] = useState(false);
  const [selectedEncounter, setSelectedEncounter] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  const handleViewEncounter = (encounter) => {
    setSelectedEncounter(encounter);
    setPendingAction('view');
    setShowReAuth(true);
  };

  const handleAuthSuccess = () => {
    if (pendingAction === 'view') {
      setShowEncounterViewer(true);
    } else if (pendingAction === 'download') {
      toast.success('Encounter downloaded');
    } else if (pendingAction === 'print') {
      toast.success('Sent to printer');
    }
    setPendingAction(null);
  };

  const handleDownload = () => {
    setPendingAction('download');
    setShowReAuth(true);
  };

  const handlePrint = () => {
    setPendingAction('print');
    setShowReAuth(true);
  };

  return (
    <>
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Queue */}
        <div className="w-80 flex flex-col bg-slate-800 rounded border border-slate-700 overflow-hidden">
          <div className="px-3 py-2 bg-slate-900 border-b border-slate-700 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-200">Patient Queue</span>
            <Badge variant="danger" size="xs">{queue.length}</Badge>
          </div>
          <div className="flex-1 overflow-y-auto">
            {queue.map(p => (
              <button 
                key={p.id} 
                onClick={() => onSelectPatient(p)} 
                className={`w-full p-3 border-b border-slate-700 text-left hover:bg-slate-700/50 ${
                  selectedPatient?.id === p.id ? 'bg-teal-900/30 border-l-2 border-l-teal-500' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-200 text-sm">{p.name}</span>
                    {p.kioskStatus === 'waiting' && <LiveIndicator isLive={true} kioskId={p.kioskId} />}
                  </div>
                  <Badge variant={p.urgency === 'high' ? 'danger' : p.urgency === 'moderate' ? 'warning' : 'success'} size="xs">
                    {p.triageScore}
                  </Badge>
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
        <div className="flex-1 flex flex-col bg-slate-800 rounded border border-slate-700 overflow-hidden">
          {patientDetail ? (
            <>
              {/* Header */}
              <div className="px-4 py-3 bg-slate-900 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                    {patientDetail.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-white font-semibold">{patientDetail.name}</h2>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{patientDetail.age}yo {patientDetail.gender}</span>
                      <span>MRN: {patientDetail.mrn}</span>
                      {patientDetail.kioskId && (
                        <span className="flex items-center gap-1 text-cyan-400">
                          <Laptop className="w-3 h-3" />{patientDetail.kioskId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {patientDetail.videoEnabled && (
                    <Button variant="success" size="sm" icon={Video} onClick={() => onStartVideo(patientDetail)}>
                      Start Video
                    </Button>
                  )}
                  <Button variant="primary" size="sm" icon={FileText} onClick={() => onStartEncounter(patientDetail)}>
                    Start Encounter
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Alerts */}
                {patientDetail.allergies?.length > 0 && (
                  <div className="bg-rose-900/20 border border-rose-700 rounded-lg p-3 flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    <div>
                      <div className="text-xs text-rose-400 font-medium">ALLERGIES</div>
                      <div className="text-sm text-rose-300">{patientDetail.allergies.join(', ')}</div>
                    </div>
                  </div>
                )}

                {/* Vitals */}
                <div>
                  <h3 className="text-xs font-semibold text-teal-400 mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> CURRENT VITALS
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { icon: Heart, label: 'BP', value: patientDetail.vitals?.bp, color: 'rose' },
                      { icon: Activity, label: 'HR', value: patientDetail.vitals?.hr, color: 'amber' },
                      { icon: Thermometer, label: 'Temp', value: patientDetail.vitals?.temp, color: 'cyan' },
                      { icon: Weight, label: 'SpO2', value: `${patientDetail.vitals?.spo2}%`, color: 'emerald' },
                    ].map((v, i) => (
                      <div key={i} className="bg-slate-900 rounded-lg p-3 border border-slate-700">
                        <v.icon className={`w-4 h-4 text-${v.color}-400 mb-1`} />
                        <div className="text-xl font-bold text-white">{v.value}</div>
                        <div className="text-xs text-slate-500">{v.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chief Complaint */}
                <div>
                  <h3 className="text-xs font-semibold text-teal-400 mb-2">CHIEF COMPLAINT</h3>
                  <div className="bg-slate-900 border border-slate-700 rounded-lg p-3">
                    <p className="text-slate-200">{patientDetail.reason}</p>
                  </div>
                </div>

                {/* AI Pre-Diagnosis */}
                <div>
                  <h3 className="text-xs font-semibold text-violet-400 mb-2 flex items-center gap-2">
                    <Brain className="w-4 h-4" /> AI PRE-DIAGNOSIS
                  </h3>
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
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-300">{c.name}</span>
                            <span className="text-violet-400">{c.probability}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-violet-500 rounded-full" style={{ width: `${c.probability}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {['ECG', 'Cardiac enzymes', 'Stress test'].map((r, i) => (
                        <Badge key={i} variant="purple" size="xs">{r}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Encounter History */}
                <div>
                  <h3 className="text-xs font-semibold text-teal-400 mb-2 flex items-center gap-2">
                    <History className="w-4 h-4" /> ENCOUNTER HISTORY
                  </h3>
                  <EncounterHistory 
                    encounters={ENCOUNTER_HISTORY[patientDetail.id] || []}
                    onViewEncounter={handleViewEncounter}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">Select a patient from the queue</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Re-Authentication Modal */}
      <ReAuthModal
        isOpen={showReAuth}
        onClose={() => { setShowReAuth(false); setPendingAction(null); }}
        onSuccess={handleAuthSuccess}
        action={pendingAction}
        itemName="patient encounter record"
      />

      {/* Encounter Viewer Modal */}
      <EncounterViewerModal
        isOpen={showEncounterViewer}
        onClose={() => { setShowEncounterViewer(false); setSelectedEncounter(null); }}
        encounter={selectedEncounter}
        patient={patientDetail}
        onDownload={handleDownload}
        onPrint={handlePrint}
      />
    </>
  );
};

export default DashboardContent;
