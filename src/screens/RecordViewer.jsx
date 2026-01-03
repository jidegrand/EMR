import React, { useState, useMemo } from 'react';
import { 
  FileText, Search, Filter, Calendar, User, Video, Building, 
  ChevronRight, ChevronDown, Eye, Download, Printer, X 
} from 'lucide-react';
import { Badge, Button, Input, Select } from '../components/ui';
import { MOCK_PATIENTS, ENCOUNTER_HISTORY } from '../data';
import { useToast } from '../contexts';
import { ReAuthModal, EncounterViewerModal } from '../modals';

const RecordViewer = () => {
  const toast = useToast();
  
  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [patientFilter, setPatientFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  
  // Modal state
  const [showReAuth, setShowReAuth] = useState(false);
  const [showEncounterViewer, setShowEncounterViewer] = useState(false);
  const [selectedEncounter, setSelectedEncounter] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  const handleViewRecord = (encounter) => {
    setSelectedEncounter(encounter);
    setPendingAction('view');
    setShowReAuth(true);
  };

  const handlePrint = (encounter) => {
    setSelectedEncounter(encounter);
    setPendingAction('print');
    setShowReAuth(true);
  };

  const handleExport = (encounter) => {
    setSelectedEncounter(encounter);
    setPendingAction('download');
    setShowReAuth(true);
  };

  const handleAuthSuccess = () => {
    if (pendingAction === 'view') {
      setShowEncounterViewer(true);
    } else if (pendingAction === 'print') {
      toast.success('Encounter sent to printer');
    } else if (pendingAction === 'download') {
      toast.success('Encounter exported successfully');
    }
    setPendingAction(null);
  };

  // Flatten all encounters with patient info
  const allEncounters = useMemo(() => {
    const encounters = [];
    Object.entries(ENCOUNTER_HISTORY).forEach(([patientId, patientEncounters]) => {
      const patient = MOCK_PATIENTS.find(p => p.id === patientId);
      patientEncounters.forEach(enc => {
        encounters.push({
          ...enc,
          patientId,
          patientName: patient?.name || 'Unknown',
          patientMrn: patient?.mrn || '',
        });
      });
    });
    // Sort by date descending
    return encounters.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, []);

  // Get unique providers for filter
  const providers = useMemo(() => {
    const providerSet = new Set(allEncounters.map(e => e.provider));
    return Array.from(providerSet);
  }, [allEncounters]);

  // Apply filters
  const filteredEncounters = useMemo(() => {
    return allEncounters.filter(enc => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesSearch = 
          enc.patientName.toLowerCase().includes(search) ||
          enc.patientMrn.toLowerCase().includes(search) ||
          enc.chiefComplaint.toLowerCase().includes(search) ||
          enc.diagnoses.some(d => 
            d.code.toLowerCase().includes(search) || 
            d.description.toLowerCase().includes(search)
          );
        if (!matchesSearch) return false;
      }
      
      // Patient filter
      if (patientFilter !== 'all' && enc.patientId !== patientFilter) return false;
      
      // Type filter
      if (typeFilter !== 'all' && enc.type !== typeFilter) return false;
      
      // Provider filter
      if (providerFilter !== 'all' && enc.provider !== providerFilter) return false;
      
      return true;
    });
  }, [allEncounters, searchTerm, patientFilter, typeFilter, providerFilter]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setPatientFilter('all');
    setTypeFilter('all');
    setProviderFilter('all');
  };

  const hasActiveFilters = searchTerm || patientFilter !== 'all' || typeFilter !== 'all' || providerFilter !== 'all';

  return (
    <div className="flex-1 flex flex-col p-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-900/30 rounded-lg">
            <FileText className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Record Viewer</h1>
            <p className="text-sm text-slate-400">View and search patient encounter history</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info" size="md">{filteredEncounters.length} Records</Badge>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-[250px]">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by patient, MRN, diagnosis, or complaint..."
              icon={Search}
              small
            />
          </div>
          
          {/* Patient Filter */}
          <div className="w-48">
            <Select
              value={patientFilter}
              onChange={(e) => setPatientFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Patients' },
                ...MOCK_PATIENTS.map(p => ({ value: p.id, label: p.name }))
              ]}
              small
            />
          </div>
          
          {/* Type Filter */}
          <div className="w-40">
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Types' },
                { value: 'Office Visit', label: 'Office Visit' },
                { value: 'Telemedicine', label: 'Telemedicine' },
              ]}
              small
            />
          </div>
          
          {/* Provider Filter */}
          <div className="w-48">
            <Select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Providers' },
                ...providers.map(p => ({ value: p, label: p }))
              ]}
              small
            />
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" icon={X} onClick={clearFilters}>
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Records List */}
      <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden flex flex-col">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-slate-900 border-b border-slate-700 text-xs font-medium text-slate-400">
          <div className="col-span-2">Date</div>
          <div className="col-span-3">Patient</div>
          <div className="col-span-3">Chief Complaint</div>
          <div className="col-span-2">Provider</div>
          <div className="col-span-1">Type</div>
          <div className="col-span-1"></div>
        </div>

        {/* Records */}
        <div className="flex-1 overflow-y-auto">
          {filteredEncounters.length > 0 ? (
            filteredEncounters.map((enc) => {
              const isExpanded = expandedId === enc.id;
              const TypeIcon = enc.type === 'Telemedicine' ? Video : Building;
              
              return (
                <div 
                  key={enc.id} 
                  className="border-b border-slate-700 hover:bg-slate-700/30"
                >
                  {/* Main Row */}
                  <button
                    onClick={() => toggleExpand(enc.id)}
                    className="w-full grid grid-cols-12 gap-4 px-4 py-3 text-left items-center"
                  >
                    {/* Date */}
                    <div className="col-span-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-white">
                        {new Date(enc.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                    
                    {/* Patient */}
                    <div className="col-span-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          {enc.patientName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm text-white font-medium">{enc.patientName}</p>
                          <p className="text-xs text-slate-500 font-mono">{enc.patientMrn}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Chief Complaint */}
                    <div className="col-span-3">
                      <p className="text-sm text-slate-300 truncate">{enc.chiefComplaint}</p>
                    </div>
                    
                    {/* Provider */}
                    <div className="col-span-2">
                      <p className="text-sm text-slate-400">{enc.provider}</p>
                    </div>
                    
                    {/* Type */}
                    <div className="col-span-1">
                      <Badge 
                        variant={enc.type === 'Telemedicine' ? 'success' : 'info'} 
                        size="xs"
                      >
                        <TypeIcon className="w-3 h-3 mr-1" />
                        {enc.type === 'Telemedicine' ? 'Tele' : 'Office'}
                      </Badge>
                    </div>
                    
                    {/* Expand */}
                    <div className="col-span-1 flex justify-end">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-slate-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 bg-slate-900/50">
                      <div className="grid grid-cols-2 gap-4">
                        {/* Diagnoses */}
                        <div>
                          <h4 className="text-xs font-medium text-slate-500 mb-2">DIAGNOSES</h4>
                          <div className="space-y-1">
                            {enc.diagnoses.map((diag, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm">
                                <span className="font-mono text-teal-400">{diag.code}</span>
                                <span className="text-slate-300">{diag.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div>
                          <h4 className="text-xs font-medium text-slate-500 mb-2">ACTIONS</h4>
                          <div className="flex items-center gap-2">
                            <Button variant="secondary" size="xs" icon={Eye} onClick={() => handleViewRecord(enc)}>
                              View Full Record
                            </Button>
                            <Button variant="secondary" size="xs" icon={Printer} onClick={() => handlePrint(enc)}>
                              Print
                            </Button>
                            <Button variant="secondary" size="xs" icon={Download} onClick={() => handleExport(enc)}>
                              Export
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex-1 flex items-center justify-center py-12">
              <div className="text-center">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No records found</p>
                {hasActiveFilters && (
                  <button 
                    onClick={clearFilters}
                    className="text-teal-400 text-sm mt-2 hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ReAuth Modal */}
      <ReAuthModal
        isOpen={showReAuth}
        onClose={() => { setShowReAuth(false); setPendingAction(null); }}
        onSuccess={handleAuthSuccess}
        action={pendingAction}
        itemName="patient encounter"
      />

      {/* Encounter Viewer Modal */}
      <EncounterViewerModal
        isOpen={showEncounterViewer}
        onClose={() => { setShowEncounterViewer(false); setSelectedEncounter(null); }}
        encounter={selectedEncounter}
        onDownload={() => {
          setPendingAction('download');
          setShowReAuth(true);
        }}
        onPrint={() => {
          setPendingAction('print');
          setShowReAuth(true);
        }}
      />
    </div>
  );
};

export default RecordViewer;
