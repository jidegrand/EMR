import React, { useState, useMemo } from 'react';
import { 
  Share2, Search, Calendar, User, Building, 
  CheckCircle, Clock, Send, FileText, Eye, MessageSquare,
  ChevronDown, ChevronRight, AlertCircle
} from 'lucide-react';
import { Badge, Button, Input, Select } from '../components/ui';
import { useTheme, useToast } from '../contexts';
import { REFERRALS_HISTORY } from '../data';
import { ReAuthModal, DetailViewerModal } from '../modals';

const ReferralsTracking = () => {
  const { isDark } = useTheme();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [expandedRef, setExpandedRef] = useState(null);
  
  // Detail viewer state
  const [showReAuth, setShowReAuth] = useState(false);
  const [showDetailViewer, setShowDetailViewer] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  const handleViewClick = (ref) => {
    setSelectedRecord(ref);
    setPendingAction('view');
    setShowReAuth(true);
  };

  const handleAuthSuccess = () => {
    if (pendingAction === 'view') {
      setShowDetailViewer(true);
    } else if (pendingAction === 'reminder') {
      toast.success('Reminder sent to specialist');
    } else if (pendingAction === 'print') {
      toast.success('Referral sent to printer');
    } else if (pendingAction === 'export') {
      toast.success('Referral exported successfully');
    }
    setPendingAction(null);
  };

  const handleSendReminder = (ref) => {
    setSelectedRecord(ref);
    setPendingAction('reminder');
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

  // Get unique specialties
  const specialties = useMemo(() => {
    return [...new Set(REFERRALS_HISTORY.map(ref => ref.specialty))];
  }, []);

  // Filter referrals
  const filteredReferrals = useMemo(() => {
    let filtered = [...REFERRALS_HISTORY];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(ref => ref.status === filterStatus);
    }

    if (filterSpecialty !== 'all') {
      filtered = filtered.filter(ref => ref.specialty === filterSpecialty);
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(ref =>
        ref.patientName.toLowerCase().includes(search) ||
        ref.specialty.toLowerCase().includes(search) ||
        ref.reason.toLowerCase().includes(search) ||
        ref.mrn.toLowerCase().includes(search)
      );
    }

    return filtered.sort((a, b) => new Date(b.dateReferred) - new Date(a.dateReferred));
  }, [filterStatus, filterSpecialty, searchTerm]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success" size="xs">Completed</Badge>;
      case 'scheduled':
        return <Badge variant="info" size="xs">Scheduled</Badge>;
      case 'sent':
        return <Badge variant="purple" size="xs">Sent</Badge>;
      case 'pending':
        return <Badge variant="warning" size="xs">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="default" size="xs">Cancelled</Badge>;
      default:
        return <Badge variant="info" size="xs">{status}</Badge>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'scheduled':
        return <Calendar className="w-5 h-5 text-cyan-400" />;
      case 'sent':
        return <Send className="w-5 h-5 text-violet-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-400" />;
      default:
        return <Share2 className="w-5 h-5 text-slate-400" />;
    }
  };

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'urgent':
        return <Badge variant="danger" size="xs">Urgent</Badge>;
      case 'routine':
        return <Badge variant="default" size="xs">Routine</Badge>;
      default:
        return null;
    }
  };

  // Stats
  const stats = useMemo(() => ({
    total: REFERRALS_HISTORY.length,
    completed: REFERRALS_HISTORY.filter(ref => ref.status === 'completed').length,
    scheduled: REFERRALS_HISTORY.filter(ref => ref.status === 'scheduled').length,
    pending: REFERRALS_HISTORY.filter(ref => ref.status === 'pending' || ref.status === 'sent').length,
  }), []);

  return (
    <div className="flex-1 flex flex-col p-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-violet-900/30' : 'bg-violet-100'}`}>
            <Share2 className="w-6 h-6 text-violet-500" />
          </div>
          <div>
            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Referrals Tracking
            </h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Track referral status and specialist responses
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {[
          { label: 'Total Referrals', value: stats.total, color: 'slate' },
          { label: 'Completed', value: stats.completed, color: 'emerald' },
          { label: 'Scheduled', value: stats.scheduled, color: 'cyan' },
          { label: 'Pending', value: stats.pending, color: 'amber' },
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
            placeholder="Search patient, specialty..."
            icon={Search}
            small
          />
        </div>
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'completed', label: 'Completed' },
            { value: 'scheduled', label: 'Scheduled' },
            { value: 'sent', label: 'Sent' },
            { value: 'pending', label: 'Pending' },
          ]}
          small
        />
        <Select
          value={filterSpecialty}
          onChange={(e) => setFilterSpecialty(e.target.value)}
          options={[
            { value: 'all', label: 'All Specialties' },
            ...specialties.map(s => ({ value: s, label: s }))
          ]}
          small
        />
        <div className="ml-auto">
          <Badge variant="info" size="sm">{filteredReferrals.length} referrals</Badge>
        </div>
      </div>

      {/* Referrals List */}
      <div className={`flex-1 rounded-lg border overflow-hidden ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        {/* Table Header */}
        <div className={`grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium border-b ${
          isDark ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
        }`}>
          <div className="col-span-1">Status</div>
          <div className="col-span-2">Patient</div>
          <div className="col-span-2">Specialty</div>
          <div className="col-span-2">Referred To</div>
          <div className="col-span-2">Date Referred</div>
          <div className="col-span-2">Appointment</div>
          <div className="col-span-1"></div>
        </div>

        {/* Table Body */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 380px)' }}>
          {filteredReferrals.map(ref => (
            <div key={ref.id}>
              <div 
                className={`grid grid-cols-12 gap-4 px-4 py-3 items-center border-b cursor-pointer ${
                  isDark ? 'border-slate-700 hover:bg-slate-700/50' : 'border-slate-100 hover:bg-slate-50'
                } ${expandedRef === ref.id ? isDark ? 'bg-slate-700/50' : 'bg-slate-50' : ''}`}
                onClick={() => setExpandedRef(expandedRef === ref.id ? null : ref.id)}
              >
                <div className="col-span-1">
                  {getStatusIcon(ref.status)}
                </div>
                <div className="col-span-2">
                  <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {ref.patientName}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {ref.mrn}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {ref.specialty}
                    </span>
                    {getUrgencyBadge(ref.urgency)}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {ref.referredTo || <span className="text-slate-500 italic">Pending assignment</span>}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {new Date(ref.dateReferred).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <div className="col-span-2">
                  {ref.appointmentDate ? (
                    <div className={`text-sm ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      {new Date(ref.appointmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  ) : (
                    <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>—</span>
                  )}
                </div>
                <div className="col-span-1 flex items-center justify-end gap-2">
                  {getStatusBadge(ref.status)}
                  {expandedRef === ref.id ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedRef === ref.id && (
                <div className={`px-4 py-3 border-b ${
                  isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Reason & Notes */}
                    <div>
                      <p className={`text-xs font-medium mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        Reason for Referral
                      </p>
                      <p className={`text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {ref.reason}
                      </p>
                      {ref.notes && (
                        <div className="mt-2">
                          <p className={`text-xs font-medium mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            Notes
                          </p>
                          <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            {ref.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Response */}
                    <div>
                      {ref.response ? (
                        <div className={`p-3 rounded-lg border ${
                          isDark ? 'bg-emerald-900/20 border-emerald-700/50' : 'bg-emerald-50 border-emerald-200'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="w-4 h-4 text-emerald-500" />
                            <span className={`text-xs font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                              Specialist Response
                            </span>
                          </div>
                          <p className={`text-sm ${isDark ? 'text-emerald-100' : 'text-emerald-800'}`}>
                            {ref.response}
                          </p>
                        </div>
                      ) : (
                        <div className={`p-3 rounded-lg border ${
                          isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
                        }`}>
                          <div className="flex items-center gap-2">
                            <AlertCircle className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              Awaiting specialist response
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 mt-3">
                        <Button variant="secondary" size="sm" icon={Eye} onClick={() => handleViewClick(ref)}>View Details</Button>
                        {!ref.response && (
                          <Button variant="secondary" size="sm" icon={Send} onClick={() => handleSendReminder(ref)}>Send Reminder</Button>
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
        itemName="referral record"
      />

      {/* Detail Viewer Modal */}
      <DetailViewerModal
        isOpen={showDetailViewer}
        onClose={() => { setShowDetailViewer(false); setSelectedRecord(null); }}
        type="referral"
        data={selectedRecord}
        onPrint={handlePrintFromViewer}
        onExport={handleExportFromViewer}
      />
    </div>
  );
};

export default ReferralsTracking;
