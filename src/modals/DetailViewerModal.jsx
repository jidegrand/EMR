import React from 'react';
import { 
  X, Pill, FlaskConical, Share2, Printer, Download,
  User, Calendar, Building, AlertTriangle, CheckCircle,
  Clock, ArrowUp, ArrowDown, MessageSquare
} from 'lucide-react';
import { Badge, Button } from '../components/ui';

/**
 * DetailViewerModal - Unified modal for viewing prescription, lab, and referral details
 * 
 * Props:
 * - isOpen: boolean
 * - onClose: function
 * - type: 'prescription' | 'lab' | 'referral'
 * - data: object (the record to display)
 * - onPrint: function (optional, triggers re-auth)
 * - onExport: function (optional, triggers re-auth)
 */

const DetailViewerModal = ({ isOpen, onClose, type, data, onPrint, onExport }) => {
  if (!isOpen || !data) return null;

  const getHeader = () => {
    switch (type) {
      case 'prescription':
        return { icon: Pill, title: 'Prescription Details', color: 'cyan' };
      case 'lab':
        return { icon: FlaskConical, title: 'Lab Order Details', color: 'sky' };
      case 'referral':
        return { icon: Share2, title: 'Referral Details', color: 'violet' };
      default:
        return { icon: Pill, title: 'Details', color: 'slate' };
    }
  };

  const header = getHeader();
  const HeaderIcon = header.icon;

  const renderPrescriptionDetails = () => (
    <div className="space-y-4">
      {/* Patient Info */}
      <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
        <h3 className="text-xs font-semibold text-slate-500 mb-3">PATIENT INFORMATION</h3>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold">
            {data.patientName?.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="text-white font-medium">{data.patientName}</p>
            <p className="text-xs text-slate-500">{data.mrn}</p>
          </div>
        </div>
      </div>

      {/* Medication Info */}
      <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
        <h3 className="text-xs font-semibold text-cyan-400 mb-3">MEDICATION</h3>
        <div className="space-y-3">
          <div>
            <p className="text-xl font-bold text-white">{data.drug} {data.strength}</p>
            <p className="text-sm text-slate-400">{data.form} - Qty: {data.quantity}</p>
          </div>
          <div className="p-3 bg-slate-800 rounded">
            <p className="text-xs text-slate-500 mb-1">SIG (Directions)</p>
            <p className="text-sm text-white">{data.sig}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-slate-500">Refills</p>
              <p className="text-sm text-white">{data.refills} remaining</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Status</p>
              <Badge variant={data.status === 'dispensed' ? 'success' : data.status === 'pending' ? 'warning' : 'danger'} size="sm">
                {data.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Pharmacy & Prescriber */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
          <h3 className="text-xs font-semibold text-slate-500 mb-2">PHARMACY</h3>
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-slate-500" />
            <p className="text-sm text-white">{data.pharmacy}</p>
          </div>
        </div>
        <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
          <h3 className="text-xs font-semibold text-slate-500 mb-2">PRESCRIBER</h3>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-500" />
            <p className="text-sm text-white">{data.prescriber}</p>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
        <h3 className="text-xs font-semibold text-slate-500 mb-3">DATES</h3>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-slate-500">Written</p>
            <p className="text-white">{data.dateWritten}</p>
          </div>
          <div>
            <p className="text-slate-500">Sent</p>
            <p className="text-white">{new Date(data.dateSent).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-slate-500">Filled</p>
            <p className="text-white">{data.fillDate || 'Pending'}</p>
          </div>
        </div>
      </div>

      {/* Authorization Warning */}
      {data.status === 'requires_auth' && data.authReason && (
        <div className="p-4 bg-rose-900/20 border border-rose-700 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <span className="font-medium text-rose-400">Prior Authorization Required</span>
          </div>
          <p className="text-sm text-rose-300">{data.authReason}</p>
        </div>
      )}
    </div>
  );

  const renderLabDetails = () => (
    <div className="space-y-4">
      {/* Patient Info */}
      <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
        <h3 className="text-xs font-semibold text-slate-500 mb-3">PATIENT INFORMATION</h3>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold">
            {data.patientName?.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="text-white font-medium">{data.patientName}</p>
            <p className="text-xs text-slate-500">{data.mrn}</p>
          </div>
        </div>
      </div>

      {/* Order Info */}
      <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
        <h3 className="text-xs font-semibold text-sky-400 mb-3">ORDER INFORMATION</h3>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-slate-500">Tests Ordered</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {data.tests?.map((test, i) => (
                <Badge key={i} variant="info" size="sm">{test}</Badge>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-slate-500">Facility</p>
              <p className="text-sm text-white">{data.facility}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Priority</p>
              <Badge variant={data.priority === 'stat' ? 'danger' : 'default'} size="sm">
                {data.priority?.toUpperCase()}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-slate-500">Status</p>
              <Badge variant={data.status === 'resulted' ? 'success' : data.status === 'collected' ? 'info' : 'warning'} size="sm">
                {data.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {data.status === 'resulted' && data.results?.length > 0 && (
        <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
          <h3 className="text-xs font-semibold text-emerald-400 mb-3">RESULTS</h3>
          <div className="rounded border border-slate-700 overflow-hidden">
            <div className="grid grid-cols-5 gap-2 px-3 py-2 bg-slate-800 text-xs font-medium text-slate-400">
              <div>Test</div>
              <div>Result</div>
              <div>Unit</div>
              <div>Reference</div>
              <div>Flag</div>
            </div>
            {data.results.map((result, i) => (
              <div key={i} className={`grid grid-cols-5 gap-2 px-3 py-2 text-sm border-t border-slate-700 ${
                result.flag ? 'bg-rose-900/10' : ''
              }`}>
                <div className="text-white">{result.test}</div>
                <div className={`font-medium ${
                  result.flag === 'H' ? 'text-rose-400' : result.flag === 'L' ? 'text-amber-400' : 'text-white'
                }`}>
                  {result.value}
                  {result.flag === 'H' && <ArrowUp className="w-3 h-3 inline ml-1" />}
                  {result.flag === 'L' && <ArrowDown className="w-3 h-3 inline ml-1" />}
                </div>
                <div className="text-slate-400">{result.unit}</div>
                <div className="text-slate-400">{result.refRange}</div>
                <div>
                  {result.flag && (
                    <Badge variant={result.flag === 'H' ? 'danger' : 'warning'} size="xs">
                      {result.flag === 'H' ? 'HIGH' : 'LOW'}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {data.criticalValue && (
            <div className="mt-3 p-2 bg-rose-900/30 border border-rose-700 rounded flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span className="text-sm text-rose-300">Critical value(s) - Provider notified</span>
            </div>
          )}
        </div>
      )}

      {/* Dates */}
      <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
        <h3 className="text-xs font-semibold text-slate-500 mb-3">DATES</h3>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-slate-500">Ordered</p>
            <p className="text-white">{data.dateOrdered}</p>
          </div>
          <div>
            <p className="text-slate-500">Collected</p>
            <p className="text-white">{data.dateCollected || 'Pending'}</p>
          </div>
          <div>
            <p className="text-slate-500">Resulted</p>
            <p className="text-white">{data.dateResulted || 'Pending'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReferralDetails = () => (
    <div className="space-y-4">
      {/* Patient Info */}
      <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
        <h3 className="text-xs font-semibold text-slate-500 mb-3">PATIENT INFORMATION</h3>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold">
            {data.patientName?.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="text-white font-medium">{data.patientName}</p>
            <p className="text-xs text-slate-500">{data.mrn}</p>
          </div>
        </div>
      </div>

      {/* Referral Info */}
      <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
        <h3 className="text-xs font-semibold text-violet-400 mb-3">REFERRAL INFORMATION</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-white">{data.specialty}</p>
              <p className="text-sm text-slate-400">Referred to: {data.referredTo || 'Pending assignment'}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant={data.urgency === 'urgent' ? 'danger' : 'default'} size="sm">
                {data.urgency}
              </Badge>
              <Badge variant={
                data.status === 'completed' ? 'success' : 
                data.status === 'scheduled' ? 'info' : 
                data.status === 'sent' ? 'purple' : 'warning'
              } size="sm">
                {data.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Reason */}
      <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
        <h3 className="text-xs font-semibold text-slate-500 mb-2">REASON FOR REFERRAL</h3>
        <p className="text-sm text-white">{data.reason}</p>
        {data.notes && (
          <div className="mt-2 pt-2 border-t border-slate-700">
            <p className="text-xs text-slate-500 mb-1">Additional Notes</p>
            <p className="text-sm text-slate-300">{data.notes}</p>
          </div>
        )}
      </div>

      {/* Response */}
      {data.response && (
        <div className="bg-emerald-900/20 rounded-lg border border-emerald-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-semibold text-emerald-400">SPECIALIST RESPONSE</h3>
          </div>
          <p className="text-sm text-emerald-100">{data.response}</p>
        </div>
      )}

      {/* Dates */}
      <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
        <h3 className="text-xs font-semibold text-slate-500 mb-3">DATES</h3>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-slate-500">Referred</p>
            <p className="text-white">{data.dateReferred}</p>
          </div>
          <div>
            <p className="text-slate-500">Appointment</p>
            <p className={data.appointmentDate ? 'text-emerald-400' : 'text-slate-500'}>
              {data.appointmentDate || 'Pending'}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Referred By</p>
            <p className="text-white">{data.referredBy}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] border border-slate-600 overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-3 bg-${header.color}-900/30 border-b border-${header.color}-700/50`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-${header.color}-900/50 rounded-lg`}>
              <HeaderIcon className={`w-5 h-5 text-${header.color}-400`} />
            </div>
            <div>
              <h2 className="text-white font-semibold">{header.title}</h2>
              <p className="text-xs text-slate-400">ID: {data.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={Printer} onClick={onPrint}>Print</Button>
            <Button variant="secondary" size="sm" icon={Download} onClick={onExport}>Export</Button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 ml-2">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {type === 'prescription' && renderPrescriptionDetails()}
          {type === 'lab' && renderLabDetails()}
          {type === 'referral' && renderReferralDetails()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-4 py-3 bg-slate-900 border-t border-slate-700">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DetailViewerModal;
