import React, { useState, useEffect } from 'react';
import { 
  FileText, X, Clock, Shield, ClipboardList, Activity, Brain, 
  FileCheck, AlertTriangle, Plus, Search, Save, Printer, FileSignature, 
  ShieldCheck, Pill, FlaskConical, Share2, Mic, MicOff
} from 'lucide-react';
import { Button, Badge, Input, DictationTextArea } from '../components/ui';
import { MOCK_PATIENTS, ICD10_CODES } from '../data';
import { useToast } from '../contexts';
import PrescriptionModal from './PrescriptionModal';
import LabOrderModal from './LabOrderModal';
import ReferralModal from './ReferralModal';

const EncounterModal = ({ isOpen, onClose, patient, onSave }) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('subjective');
  const [dictationEnabled, setDictationEnabled] = useState(true); // Global dictation toggle
  const [encounterData, setEncounterData] = useState({
    subjective: { chiefComplaint: '', hpi: '', ros: '', pmh: '', medications: '', allergies: '', socialHistory: '', familyHistory: '' },
    objective: { vitals: {}, physicalExam: '', generalAppearance: '' },
    assessment: { diagnoses: [], differentials: '', clinicalImpression: '' },
    plan: { treatment: '', prescriptions: [], labOrders: [], referrals: [], patientEducation: '', followUp: '' },
  });
  const [diagnosisSearch, setDiagnosisSearch] = useState('');
  const [showDiagnosisDropdown, setShowDiagnosisDropdown] = useState(false);
  const [auditLog, setAuditLog] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  
  // Modal states for Plan items
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showLabOrderModal, setShowLabOrderModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);

  useEffect(() => {
    if (isOpen && patient) {
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
      toast.success(`Encounter signed and saved for ${patient?.name}`);
      onClose();
    } else {
      toast.info('Draft saved');
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

  const toggleDictation = () => {
    setDictationEnabled(prev => !prev);
    toast.info(dictationEnabled ? 'Dictation disabled' : 'Dictation enabled');
  };

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
              <p className="text-xs text-slate-400">{patient?.name} - {MOCK_PATIENTS.find(p => p.id === patient?.id)?.mrn}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Dictation Toggle */}
            <button
              onClick={toggleDictation}
              className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-colors ${
                dictationEnabled
                  ? 'bg-rose-900/30 border-rose-700 text-rose-400'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
              title={dictationEnabled ? 'Disable dictation' : 'Enable dictation'}
            >
              {dictationEnabled ? (
                <>
                  <Mic className="w-4 h-4" />
                  <span className="text-xs font-medium">Dictation ON</span>
                </>
              ) : (
                <>
                  <MicOff className="w-4 h-4" />
                  <span className="text-xs font-medium">Dictation OFF</span>
                </>
              )}
            </button>
            
            <div className="flex items-center gap-2 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-400">
              <Clock className="w-3 h-3" />
              {new Date().toLocaleTimeString()}
            </div>
            <div className="flex items-center gap-2 px-2 py-1 bg-emerald-900/30 border border-emerald-700 rounded">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-emerald-400">Auto-saving - HIPAA Compliant</span>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
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
                    <DictationTextArea
                      label="History of Present Illness (HPI)"
                      rows={4}
                      value={encounterData.subjective.hpi}
                      onChange={(e) => setEncounterData(prev => ({ ...prev, subjective: { ...prev.subjective, hpi: e.target.value } }))}
                      placeholder="Describe onset, location, duration, character, aggravating/alleviating factors, radiation, timing, severity..."
                      dictationEnabled={dictationEnabled}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                      <DictationTextArea
                        label="Review of Systems"
                        rows={3}
                        value={encounterData.subjective.ros}
                        onChange={(e) => setEncounterData(prev => ({ ...prev, subjective: { ...prev.subjective, ros: e.target.value } }))}
                        placeholder="Constitutional, HEENT, Cardiovascular, Respiratory, GI, etc."
                        dictationEnabled={dictationEnabled}
                      />
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                      <DictationTextArea
                        label="Past Medical History"
                        rows={3}
                        value={encounterData.subjective.pmh}
                        onChange={(e) => setEncounterData(prev => ({ ...prev, subjective: { ...prev.subjective, pmh: e.target.value } }))}
                        placeholder="Previous conditions, surgeries, hospitalizations..."
                        dictationEnabled={dictationEnabled}
                      />
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
                    <DictationTextArea
                      label="Physical Examination"
                      rows={6}
                      value={encounterData.objective.physicalExam}
                      onChange={(e) => setEncounterData(prev => ({ ...prev, objective: { ...prev.objective, physicalExam: e.target.value } }))}
                      placeholder="Document physical exam findings by system..."
                      dictationEnabled={dictationEnabled}
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
                        onFocus={() => setShowDiagnosisDropdown(true)}
                        placeholder="Search diagnoses..."
                        icon={Search}
                      />
                      {showDiagnosisDropdown && diagnosisSearch && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
                          {filteredDiagnoses.map((d, i) => (
                            <button
                              key={i}
                              onClick={() => addDiagnosis(d)}
                              className="w-full px-3 py-2 text-left hover:bg-slate-700 flex items-center gap-2"
                            >
                              <span className="text-teal-400 font-mono text-sm">{d.code}</span>
                              <span className="text-sm text-slate-300">{d.description}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {encounterData.assessment.diagnoses.length > 0 && (
                      <div className="space-y-2">
                        {encounterData.assessment.diagnoses.map((d, i) => (
                          <div key={i} className="flex items-center justify-between bg-slate-900 rounded-lg p-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-teal-900/50 text-teal-400 rounded text-xs font-mono">{d.code}</span>
                              <span className="text-sm text-white">{d.description}</span>
                            </div>
                            <button onClick={() => removeDiagnosis(i)} className="p-1 text-slate-500 hover:text-rose-400">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <DictationTextArea
                      label="Clinical Impression"
                      rows={3}
                      value={encounterData.assessment.clinicalImpression}
                      onChange={(e) => setEncounterData(prev => ({ ...prev, assessment: { ...prev.assessment, clinicalImpression: e.target.value } }))}
                      placeholder="Your clinical interpretation and reasoning..."
                      dictationEnabled={dictationEnabled}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'plan' && (
                <div className="space-y-4">
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <DictationTextArea
                      label="Treatment Plan"
                      rows={3}
                      value={encounterData.plan.treatment}
                      onChange={(e) => setEncounterData(prev => ({ ...prev, plan: { ...prev.plan, treatment: e.target.value } }))}
                      placeholder="Document treatment approach, procedures, recommendations..."
                      dictationEnabled={dictationEnabled}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Prescriptions */}
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                        <Pill className="w-4 h-4" /> Prescriptions
                      </h3>
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
                              }))} className="text-slate-500 hover:text-rose-400">
                                <X className="w-3 h-3" />
                              </button>
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
                      <h3 className="text-sm font-semibold text-sky-400 mb-3 flex items-center gap-2">
                        <FlaskConical className="w-4 h-4" /> Lab Orders
                      </h3>
                      {encounterData.plan.labOrders.length > 0 && (
                        <div className="space-y-2 mb-3">
                          {encounterData.plan.labOrders.map((lab, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-900 rounded p-2 text-xs">
                              <span className="text-white">{lab.tests.join(', ')}</span>
                              <button onClick={() => setEncounterData(prev => ({
                                ...prev,
                                plan: { ...prev.plan, labOrders: prev.plan.labOrders.filter((_, idx) => idx !== i) }
                              }))} className="text-slate-500 hover:text-rose-400">
                                <X className="w-3 h-3" />
                              </button>
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
                      <h3 className="text-sm font-semibold text-violet-400 mb-3 flex items-center gap-2">
                        <Share2 className="w-4 h-4" /> Referrals
                      </h3>
                      {encounterData.plan.referrals.length > 0 && (
                        <div className="space-y-2 mb-3">
                          {encounterData.plan.referrals.map((ref, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-900 rounded p-2 text-xs">
                              <span className="text-white">{ref.specialty}</span>
                              <button onClick={() => setEncounterData(prev => ({
                                ...prev,
                                plan: { ...prev.plan, referrals: prev.plan.referrals.filter((_, idx) => idx !== i) }
                              }))} className="text-slate-500 hover:text-rose-400">
                                <X className="w-3 h-3" />
                              </button>
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
                      <DictationTextArea
                        label="Patient Education"
                        rows={2}
                        value={encounterData.plan.patientEducation}
                        onChange={(e) => setEncounterData(prev => ({ ...prev, plan: { ...prev.plan, patientEducation: e.target.value } }))}
                        placeholder="Instructions provided to patient..."
                        dictationEnabled={dictationEnabled}
                      />
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                      <DictationTextArea
                        label="Follow-Up"
                        rows={2}
                        value={encounterData.plan.followUp}
                        onChange={(e) => setEncounterData(prev => ({ ...prev, plan: { ...prev.plan, followUp: e.target.value } }))}
                        placeholder="Follow-up instructions, return visit timeline..."
                        dictationEnabled={dictationEnabled}
                      />
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

export default EncounterModal;
