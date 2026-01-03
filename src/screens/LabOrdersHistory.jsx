import React, { useState, useMemo } from 'react';
import { 
  FlaskConical, Search, Calendar, User, Building, 
  CheckCircle, Clock, AlertTriangle, FileText, Eye, Printer, 
  ChevronDown, ChevronRight, ArrowUp, ArrowDown
} from 'lucide-react';
import { Badge, Button, Input, Select } from '../components/ui';
import { useTheme, useToast } from '../contexts';
import { LAB_ORDERS_HISTORY } from '../data';
import { ReAuthModal, DetailViewerModal } from '../modals';

const LabOrdersHistory = () => {
  const { isDark } = useTheme();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPatient, setFilterPatient] = useState('all');
  const [expandedLab, setExpandedLab] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  
  // Detail viewer state
  const [showReAuth, setShowReAuth] = useState(false);
  const [showDetailViewer, setShowDetailViewer] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  const handleViewClick = (lab) => {
    setSelectedRecord(lab);
    setPendingAction('view');
    setShowReAuth(true);
  };

  const handleAuthSuccess = () => {
    if (pendingAction === 'view') {
      setShowDetailViewer(true);
    } else if (pendingAction === 'print') {
      toast.success('Lab order sent to printer');
    } else if (pendingAction === 'export') {
      toast.success('Lab order exported successfully');
    }
    setPendingAction(null);
  };

  const handlePrint = (lab) => {
    setSelectedRecord(lab);
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
    const unique = [...new Set(LAB_ORDERS_HISTORY.map(lab => lab.patientId))];
    return unique.map(id => {
      const lab = LAB_ORDERS_HISTORY.find(l => l.patientId === id);
      return { id, name: lab.patientName };
    });
  }, []);

  // Filter labs
  const filteredLabs = useMemo(() => {
    let filtered = [...LAB_ORDERS_HISTORY];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(lab => lab.status === filterStatus);
    }

    if (filterPatient !== 'all') {
      filtered = filtered.filter(lab => lab.patientId === filterPatient);
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(lab =>
        lab.tests.some(t => t.toLowerCase().includes(search)) ||
        lab.patientName.toLowerCase().includes(search) ||
        lab.mrn.toLowerCase().includes(search)
      );
    }

    return filtered.sort((a, b) => new Date(b.dateOrdered) - new Date(a.dateOrdered));
  }, [filterStatus, filterPatient, searchTerm]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'resulted':
        return <Badge variant="success" size="xs">Resulted</Badge>;
      case 'collected':
        return <Badge variant="info" size="xs">Collected</Badge>;
      case 'ordered':
        return <Badge variant="warning" size="xs">Ordered</Badge>;
      case 'cancelled':
        return <Badge variant="default" size="xs">Cancelled</Badge>;
      default:
        return <Badge variant="info" size="xs">{status}</Badge>;
    }
  };

  const getStatusIcon = (status, hasCritical) => {
    if (hasCritical) {
      return <AlertTriangle className="w-5 h-5 text-rose-400" />;
    }
    switch (status) {
      case 'resulted':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'collected':
        return <FlaskConical className="w-5 h-5 text-cyan-400" />;
      case 'ordered':
        return <Clock className="w-5 h-5 text-amber-400" />;
      default:
        return <FlaskConical className="w-5 h-5 text-slate-400" />;
    }
  };

  const getFlagColor = (flag) => {
    switch (flag) {
      case 'H':
        return 'text-rose-400';
      case 'L':
        return 'text-amber-400';
      default:
        return isDark ? 'text-white' : 'text-slate-800';
    }
  };

  // Stats
  const stats = useMemo(() => ({
    total: LAB_ORDERS_HISTORY.length,
    resulted: LAB_ORDERS_HISTORY.filter(lab => lab.status === 'resulted').length,
    pending: LAB_ORDERS_HISTORY.filter(lab => lab.status === 'ordered' || lab.status === 'collected').length,
    critical: LAB_ORDERS_HISTORY.filter(lab => lab.criticalValue).length,
  }), []);

  return (
    <div className="flex-1 flex flex-col p-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-sky-900/30' : 'bg-sky-100'}`}>
            <FlaskConical className="w-6 h-6 text-sky-500" />
          </div>
          <div>
            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Lab Orders & Results
            </h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Track lab orders and view results
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {[
          { label: 'Total Orders', value: stats.total, color: 'slate' },
          { label: 'Resulted', value: stats.resulted, color: 'emerald' },
          { label: 'Pending', value: stats.pending, color: 'amber' },
          { label: 'Critical Values', value: stats.critical, color: 'rose' },
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
            placeholder="Search tests, patient, MRN..."
            icon={Search}
            small
          />
        </div>
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'resulted', label: 'Resulted' },
            { value: 'collected', label: 'Collected' },
            { value: 'ordered', label: 'Ordered' },
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
          <Badge variant="info" size="sm">{filteredLabs.length} orders</Badge>
        </div>
      </div>

      {/* Labs List */}
      <div className={`flex-1 rounded-lg border overflow-hidden ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        {/* Table Header */}
        <div className={`grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium border-b ${
          isDark ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
        }`}>
          <div className="col-span-1">Status</div>
          <div className="col-span-2">Patient</div>
          <div className="col-span-3">Tests</div>
          <div className="col-span-2">Facility</div>
          <div className="col-span-2">Date Ordered</div>
          <div className="col-span-1">Priority</div>
          <div className="col-span-1"></div>
        </div>

        {/* Table Body */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 380px)' }}>
          {filteredLabs.map(lab => (
            <div key={lab.id}>
              <div 
                className={`grid grid-cols-12 gap-4 px-4 py-3 items-center border-b cursor-pointer ${
                  isDark ? 'border-slate-700 hover:bg-slate-700/50' : 'border-slate-100 hover:bg-slate-50'
                } ${expandedLab === lab.id ? isDark ? 'bg-slate-700/50' : 'bg-slate-50' : ''}
                ${lab.criticalValue ? isDark ? 'bg-rose-900/10' : 'bg-rose-50' : ''}`}
                onClick={() => setExpandedLab(expandedLab === lab.id ? null : lab.id)}
              >
                <div className="col-span-1">
                  {getStatusIcon(lab.status, lab.criticalValue)}
                </div>
                <div className="col-span-2">
                  <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {lab.patientName}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {lab.mrn}
                  </div>
                </div>
                <div className="col-span-3">
                  <div className={`text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {lab.tests.slice(0, 3).join(', ')}
                    {lab.tests.length > 3 && <span className="text-slate-500"> +{lab.tests.length - 3} more</span>}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-1">
                    <Building className={`w-3 h-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {lab.facility}
                    </span>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {new Date(lab.dateOrdered).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <div className="col-span-1">
                  <Badge variant={lab.priority === 'stat' ? 'danger' : 'default'} size="xs">
                    {lab.priority.toUpperCase()}
                  </Badge>
                </div>
                <div className="col-span-1 flex items-center justify-end gap-2">
                  {getStatusBadge(lab.status)}
                  {expandedLab === lab.id ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expanded Results */}
              {expandedLab === lab.id && (
                <div className={`px-4 py-3 border-b ${
                  isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}>
                  {lab.status === 'resulted' && lab.results.length > 0 ? (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          Lab Results
                        </h4>
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" icon={Eye} onClick={() => handleViewClick(lab)}>Full Report</Button>
                          <Button variant="secondary" size="sm" icon={Printer} onClick={() => handlePrint(lab)}>Print</Button>
                        </div>
                      </div>
                      
                      {/* Results Table */}
                      <div className={`rounded border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                        <div className={`grid grid-cols-5 gap-4 px-3 py-2 text-xs font-medium border-b ${
                          isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
                        }`}>
                          <div>Test</div>
                          <div>Result</div>
                          <div>Unit</div>
                          <div>Reference Range</div>
                          <div>Flag</div>
                        </div>
                        {lab.results.map((result, i) => (
                          <div key={i} className={`grid grid-cols-5 gap-4 px-3 py-2 text-sm border-b last:border-b-0 ${
                            isDark ? 'border-slate-700' : 'border-slate-200'
                          } ${result.flag ? isDark ? 'bg-rose-900/10' : 'bg-rose-50/50' : ''}`}>
                            <div className={isDark ? 'text-white' : 'text-slate-800'}>{result.test}</div>
                            <div className={`font-medium ${getFlagColor(result.flag)}`}>
                              {result.value}
                              {result.flag === 'H' && <ArrowUp className="w-3 h-3 inline ml-1" />}
                              {result.flag === 'L' && <ArrowDown className="w-3 h-3 inline ml-1" />}
                            </div>
                            <div className={isDark ? 'text-slate-400' : 'text-slate-500'}>{result.unit}</div>
                            <div className={isDark ? 'text-slate-400' : 'text-slate-500'}>{result.refRange}</div>
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

                      {lab.criticalValue && (
                        <div className="mt-3 p-2 bg-rose-900/20 border border-rose-700/50 rounded flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-rose-400" />
                          <span className="text-sm text-rose-300">Critical value(s) detected - Provider notified</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Clock className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {lab.status === 'collected' ? 'Sample collected - awaiting results' : 'Pending collection'}
                      </p>
                      {lab.dateCollected && (
                        <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          Collected: {new Date(lab.dateCollected).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
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
        itemName="lab order record"
      />

      {/* Detail Viewer Modal */}
      <DetailViewerModal
        isOpen={showDetailViewer}
        onClose={() => { setShowDetailViewer(false); setSelectedRecord(null); }}
        type="lab"
        data={selectedRecord}
        onPrint={handlePrintFromViewer}
        onExport={handleExportFromViewer}
      />
    </div>
  );
};

export default LabOrdersHistory;
