import React, { useState, useMemo } from 'react';
import { 
  Pill, Search, Filter, Calendar, User, Building, 
  CheckCircle, Clock, AlertTriangle, RefreshCw, Eye, Printer, MoreVertical
} from 'lucide-react';
import { Badge, Button, Input, Select } from '../components/ui';
import { useTheme, useToast } from '../contexts';
import { PRESCRIPTION_HISTORY } from '../data';
import { ReAuthModal, DetailViewerModal } from '../modals';

const PrescriptionHistory = () => {
  const { isDark } = useTheme();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPatient, setFilterPatient] = useState('all');
  const [expandedRx, setExpandedRx] = useState(null);
  
  // Detail viewer state
  const [showReAuth, setShowReAuth] = useState(false);
  const [showDetailViewer, setShowDetailViewer] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  const handleViewClick = (rx) => {
    setSelectedRecord(rx);
    setPendingAction('view');
    setShowReAuth(true);
  };

  const handleAuthSuccess = () => {
    if (pendingAction === 'view') {
      setShowDetailViewer(true);
    } else if (pendingAction === 'print') {
      toast.success('Prescription sent to printer');
    } else if (pendingAction === 'export') {
      toast.success('Prescription exported successfully');
    }
    setPendingAction(null);
  };

  const handlePrint = (rx) => {
    setSelectedRecord(rx);
    setPendingAction('print');
    setShowReAuth(true);
  };

  const handleExportFromViewer = () => {
    setShowDetailViewer(false);
    setPendingAction('export');
    setShowReAuth(true);
  };

  const handlePrintFromViewer = () => {
    setShowDetailViewer(false);
    setPendingAction('print');
    setShowReAuth(true);
  };

  // Get unique patients
  const patients = useMemo(() => {
    const unique = [...new Set(PRESCRIPTION_HISTORY.map(rx => rx.patientId))];
    return unique.map(id => {
      const rx = PRESCRIPTION_HISTORY.find(r => r.patientId === id);
      return { id, name: rx.patientName };
    });
  }, []);

  // Filter prescriptions
  const filteredPrescriptions = useMemo(() => {
    let filtered = [...PRESCRIPTION_HISTORY];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(rx => rx.status === filterStatus);
    }

    if (filterPatient !== 'all') {
      filtered = filtered.filter(rx => rx.patientId === filterPatient);
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(rx =>
        rx.drug.toLowerCase().includes(search) ||
        rx.patientName.toLowerCase().includes(search) ||
        rx.mrn.toLowerCase().includes(search)
      );
    }

    return filtered.sort((a, b) => new Date(b.dateSent) - new Date(a.dateSent));
  }, [filterStatus, filterPatient, searchTerm]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'dispensed':
        return <Badge variant="success" size="xs">Dispensed</Badge>;
      case 'pending':
        return <Badge variant="warning" size="xs">Pending</Badge>;
      case 'requires_auth':
        return <Badge variant="danger" size="xs">Requires Auth</Badge>;
      case 'cancelled':
        return <Badge variant="default" size="xs">Cancelled</Badge>;
      default:
        return <Badge variant="info" size="xs">{status}</Badge>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'dispensed':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-400" />;
      case 'requires_auth':
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      default:
        return <Pill className="w-5 h-5 text-slate-400" />;
    }
  };

  // Stats
  const stats = useMemo(() => ({
    total: PRESCRIPTION_HISTORY.length,
    dispensed: PRESCRIPTION_HISTORY.filter(rx => rx.status === 'dispensed').length,
    pending: PRESCRIPTION_HISTORY.filter(rx => rx.status === 'pending').length,
    requiresAuth: PRESCRIPTION_HISTORY.filter(rx => rx.status === 'requires_auth').length,
  }), []);

  return (
    <div className="flex-1 flex flex-col p-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-cyan-900/30' : 'bg-cyan-100'}`}>
            <Pill className="w-6 h-6 text-cyan-500" />
          </div>
          <div>
            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              e-Prescribing History
            </h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              View and manage prescription orders
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {[
          { label: 'Total Prescriptions', value: stats.total, color: 'slate' },
          { label: 'Dispensed', value: stats.dispensed, color: 'emerald' },
          { label: 'Pending', value: stats.pending, color: 'amber' },
          { label: 'Requires Auth', value: stats.requiresAuth, color: 'rose' },
        ].map((stat, i) => (
          <div key={i} className={`p-4 rounded-lg border ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className={`text-2xl font-bold text-${stat.color}-500`}>{stat.value}</div>
            <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={`rounded-lg border p-3 mb-4 flex items-center gap-4 ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <div className="w-64">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search drug, patient, MRN..."
            icon={Search}
            small
          />
        </div>
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'dispensed', label: 'Dispensed' },
            { value: 'pending', label: 'Pending' },
            { value: 'requires_auth', label: 'Requires Auth' },
          ]}
          small
        />
        <Select
          value={filterPatient}
          onChange={(e) => setFilterPatient(e.target.value)}
          options={[
            { value: 'all', label: 'All Patients' },
            ...patients.map(p => ({ value: p.id, label: p.name }))
          ]}
          small
        />
        <div className="ml-auto">
          <Badge variant="info" size="sm">{filteredPrescriptions.length} prescriptions</Badge>
        </div>
      </div>

      {/* Prescriptions List */}
      <div className={`flex-1 rounded-lg border overflow-hidden ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        {/* Table Header */}
        <div className={`grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium border-b ${
          isDark ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
        }`}>
          <div className="col-span-1">Status</div>
          <div className="col-span-2">Patient</div>
          <div className="col-span-3">Medication</div>
          <div className="col-span-2">Pharmacy</div>
          <div className="col-span-2">Date Sent</div>
          <div className="col-span-1">Refills</div>
          <div className="col-span-1"></div>
        </div>

        {/* Table Body */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 380px)' }}>
          {filteredPrescriptions.map(rx => (
            <div key={rx.id}>
              <div 
                className={`grid grid-cols-12 gap-4 px-4 py-3 items-center border-b cursor-pointer ${
                  isDark ? 'border-slate-700 hover:bg-slate-700/50' : 'border-slate-100 hover:bg-slate-50'
                } ${expandedRx === rx.id ? isDark ? 'bg-slate-700/50' : 'bg-slate-50' : ''}`}
                onClick={() => setExpandedRx(expandedRx === rx.id ? null : rx.id)}
              >
                <div className="col-span-1">
                  {getStatusIcon(rx.status)}
                </div>
                <div className="col-span-2">
                  <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {rx.patientName}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {rx.mrn}
                  </div>
                </div>
                <div className="col-span-3">
                  <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {rx.drug} {rx.strength}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {rx.form} - Qty: {rx.quantity}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-1">
                    <Building className={`w-3 h-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {rx.pharmacy}
                    </span>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {new Date(rx.dateSent).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {new Date(rx.dateSent).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </div>
                </div>
                <div className="col-span-1">
                  {getStatusBadge(rx.status)}
                </div>
                <div className="col-span-1 flex justify-end">
                  <button className={`p-1 rounded ${isDark ? 'hover:bg-slate-600' : 'hover:bg-slate-200'}`}>
                    <MoreVertical className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedRx === rx.id && (
                <div className={`px-4 py-3 border-b ${
                  isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className={`text-xs font-medium mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        SIG (Directions)
                      </p>
                      <p className={`text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {rx.sig}
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs font-medium mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        Refills Remaining
                      </p>
                      <p className={`text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {rx.refills} refills
                      </p>
                      {rx.fillDate && (
                        <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          Filled: {new Date(rx.fillDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div>
                      {rx.status === 'requires_auth' && rx.authReason && (
                        <div className="p-2 bg-rose-900/20 border border-rose-700/50 rounded">
                          <p className={`text-xs font-medium mb-1 text-rose-400`}>
                            Authorization Required
                          </p>
                          <p className="text-xs text-rose-300">{rx.authReason}</p>
                        </div>
                      )}
                      <div className="flex gap-2 mt-2">
                        <Button variant="secondary" size="sm" icon={Eye} onClick={() => handleViewClick(rx)}>View</Button>
                        <Button variant="secondary" size="sm" icon={Printer} onClick={() => handlePrint(rx)}>Print</Button>
                        {rx.status === 'requires_auth' && (
                          <Button variant="primary" size="sm">Submit PA</Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ReAuth Modal */}
      <ReAuthModal
        isOpen={showReAuth}
        onClose={() => { setShowReAuth(false); setPendingAction(null); }}
        onSuccess={handleAuthSuccess}
        action={pendingAction}
        itemName="prescription record"
      />

      {/* Detail Viewer Modal */}
      <DetailViewerModal
        isOpen={showDetailViewer}
        onClose={() => { setShowDetailViewer(false); setSelectedRecord(null); }}
        type="prescription"
        data={selectedRecord}
        onPrint={handlePrintFromViewer}
        onExport={handleExportFromViewer}
      />
    </div>
  );
};

export default PrescriptionHistory;
