import React from 'react';
import { 
  X, FileText, Calendar, User, Stethoscope, Download, Printer,
  Video, Building, ClipboardList, Pill, FlaskConical, Activity
} from 'lucide-react';
import { Badge, Button } from '../components/ui';

const EncounterViewerModal = ({ isOpen, onClose, encounter, patient, onDownload, onPrint }) => {
  if (!isOpen || !encounter) return null;

  const isTelemedicine = encounter.type === 'Telemedicine';

  // Mock additional encounter details
  const encounterDetails = {
    vitals: {
      bp: '120/80',
      hr: '72',
      temp: '98.6',
      spo2: '98',
      weight: '165 lbs',
      height: '5\'10"',
    },
    subjective: 'Patient presents for ' + encounter.chiefComplaint.toLowerCase() + '. Reports symptoms have been present for approximately 1 week. Denies fever, chills, or recent travel. No known sick contacts.',
    objective: 'General: Alert and oriented, no acute distress.\nHEENT: Normocephalic, PERRLA, oropharynx clear.\nCardiovascular: Regular rate and rhythm, no murmurs.\nRespiratory: Clear to auscultation bilaterally.\nAbdomen: Soft, non-tender, non-distended.',
    assessment: encounter.diagnoses?.map(d => `${d.code} - ${d.description}`).join('\n') || 'See diagnoses below',
    plan: '1. Continue current medications as prescribed\n2. Follow up in 2 weeks or sooner if symptoms worsen\n3. Patient education provided regarding condition management\n4. Return precautions discussed',
    medications: ['Lisinopril 10mg daily', 'Metformin 500mg BID'],
    labsOrdered: ['CBC', 'BMP', 'Lipid Panel'],
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] border border-slate-600 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isTelemedicine ? 'bg-emerald-900/50' : 'bg-teal-900/50'}`}>
              {isTelemedicine ? (
                <Video className="w-5 h-5 text-emerald-400" />
              ) : (
                <FileText className="w-5 h-5 text-teal-400" />
              )}
            </div>
            <div>
              <h2 className="text-white font-semibold">Encounter Record</h2>
              <p className="text-xs text-slate-400">
                {encounter.id} - {encounter.date}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={Printer} onClick={onPrint}>
              Print
            </Button>
            <Button variant="secondary" size="sm" icon={Download} onClick={onDownload}>
              Download
            </Button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 ml-2">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Patient & Visit Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
              <h3 className="text-xs font-semibold text-teal-400 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" /> PATIENT INFORMATION
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Name:</span>
                  <span className="text-white font-medium">{patient?.name || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">MRN:</span>
                  <span className="text-white font-mono">{patient?.mrn || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">DOB:</span>
                  <span className="text-white">{patient?.dob || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
              <h3 className="text-xs font-semibold text-teal-400 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> VISIT INFORMATION
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Date:</span>
                  <span className="text-white">{encounter.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Type:</span>
                  <Badge variant={isTelemedicine ? 'success' : 'info'} size="xs">
                    {encounter.type}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Provider:</span>
                  <span className="text-white">{encounter.provider}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Vitals */}
          <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
            <h3 className="text-xs font-semibold text-teal-400 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" /> VITALS
            </h3>
            <div className="grid grid-cols-6 gap-3">
              {Object.entries(encounterDetails.vitals).map(([key, value]) => (
                <div key={key} className="bg-slate-800 rounded p-2 text-center">
                  <div className="text-lg font-bold text-white">{value}</div>
                  <div className="text-xs text-slate-500 uppercase">{key}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Chief Complaint */}
          <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
            <h3 className="text-xs font-semibold text-teal-400 mb-2 flex items-center gap-2">
              <ClipboardList className="w-4 h-4" /> CHIEF COMPLAINT
            </h3>
            <p className="text-white">{encounter.chiefComplaint}</p>
          </div>

          {/* SOAP Notes */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
              <h3 className="text-xs font-semibold text-cyan-400 mb-2">SUBJECTIVE</h3>
              <p className="text-sm text-slate-300 whitespace-pre-wrap">{encounterDetails.subjective}</p>
            </div>
            <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
              <h3 className="text-xs font-semibold text-cyan-400 mb-2">OBJECTIVE</h3>
              <p className="text-sm text-slate-300 whitespace-pre-wrap">{encounterDetails.objective}</p>
            </div>
          </div>

          {/* Assessment */}
          <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
            <h3 className="text-xs font-semibold text-amber-400 mb-2 flex items-center gap-2">
              <Stethoscope className="w-4 h-4" /> ASSESSMENT / DIAGNOSES
            </h3>
            <div className="space-y-2">
              {encounter.diagnoses?.map((dx, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-amber-900/30 text-amber-400 text-xs font-mono rounded">
                    {dx.code}
                  </span>
                  <span className="text-sm text-white">{dx.description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plan */}
          <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
            <h3 className="text-xs font-semibold text-emerald-400 mb-2">PLAN</h3>
            <p className="text-sm text-slate-300 whitespace-pre-wrap">{encounterDetails.plan}</p>
          </div>

          {/* Medications & Labs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
              <h3 className="text-xs font-semibold text-teal-400 mb-2 flex items-center gap-2">
                <Pill className="w-4 h-4" /> MEDICATIONS
              </h3>
              <ul className="space-y-1">
                {encounterDetails.medications.map((med, i) => (
                  <li key={i} className="text-sm text-slate-300">- {med}</li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
              <h3 className="text-xs font-semibold text-teal-400 mb-2 flex items-center gap-2">
                <FlaskConical className="w-4 h-4" /> LABS ORDERED
              </h3>
              <ul className="space-y-1">
                {encounterDetails.labsOrdered.map((lab, i) => (
                  <li key={i} className="text-sm text-slate-300">- {lab}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Signature */}
          <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Electronically signed by</p>
                <p className="text-white font-medium">{encounter.provider}</p>
                <p className="text-xs text-slate-400">{encounter.date} at 5:30 PM</p>
              </div>
              <Badge variant="success" size="sm">Signed & Locked</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EncounterViewerModal;
