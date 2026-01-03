import React, { useState, useMemo } from 'react';
import { 
  Users, Search, User, Phone, Mail, Calendar, MapPin, 
  FileText, Video, Plus, Eye, ChevronRight
} from 'lucide-react';
import { Badge, Button, Input, Select } from '../components/ui';
import { useTheme } from '../contexts';
import { MOCK_PATIENTS } from '../data';

const PatientLookup = ({ onSelectPatient, onRegisterNew, onViewChart }) => {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Filter patients
  const filteredPatients = useMemo(() => {
    let filtered = [...MOCK_PATIENTS];

    if (filterGender !== 'all') {
      filtered = filtered.filter(p => p.gender?.toLowerCase() === filterGender);
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.mrn?.toLowerCase().includes(search) ||
        p.email?.toLowerCase().includes(search) ||
        p.phone?.includes(search)
      );
    }

    return filtered;
  }, [filterGender, searchTerm]);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
  };

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="flex-1 flex flex-col p-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-amber-900/30' : 'bg-amber-100'}`}>
            <Users className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Patient Lookup
            </h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Search and manage patient records
            </p>
          </div>
        </div>
        <Button variant="primary" icon={Plus} onClick={onRegisterNew}>
          Register New Patient
        </Button>
      </div>

      {/* Search & Filters */}
      <div className={`rounded-lg border p-3 mb-4 flex items-center gap-4 ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <div className="flex-1">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, MRN, email, or phone..."
            icon={Search}
          />
        </div>
        <Select
          value={filterGender}
          onChange={(e) => setFilterGender(e.target.value)}
          options={[
            { value: 'all', label: 'All Genders' },
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
          ]}
          small
        />
        <Badge variant="info" size="sm">{filteredPatients.length} patients</Badge>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Patient List */}
        <div className={`w-1/2 rounded-lg border overflow-hidden flex flex-col ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className={`px-4 py-2 border-b ${
            isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Patient List
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredPatients.map(patient => (
              <button
                key={patient.id}
                onClick={() => handleSelectPatient(patient)}
                className={`w-full px-4 py-3 flex items-center gap-3 border-b text-left transition-colors ${
                  isDark ? 'border-slate-700 hover:bg-slate-700/50' : 'border-slate-100 hover:bg-slate-50'
                } ${selectedPatient?.id === patient.id ? isDark ? 'bg-teal-900/20 border-l-2 border-l-teal-500' : 'bg-teal-50 border-l-2 border-l-teal-500' : ''}`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold text-sm">
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {patient.name}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {patient.mrn} • {calculateAge(patient.dob)}yo {patient.gender}
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
              </button>
            ))}
            {filteredPatients.length === 0 && (
              <div className="flex-1 flex items-center justify-center py-12">
                <div className="text-center">
                  <Users className={`w-10 h-10 mx-auto mb-2 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                  <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    No patients found
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Patient Detail */}
        <div className={`w-1/2 rounded-lg border overflow-hidden flex flex-col ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          {selectedPatient ? (
            <>
              {/* Patient Header */}
              <div className={`px-4 py-4 border-b ${
                isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold text-xl">
                    {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {selectedPatient.name}
                    </h2>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      MRN: {selectedPatient.mrn}
                    </p>
                    <div className="flex gap-2 mt-1">
                      {selectedPatient.conditions?.map((c, i) => (
                        <Badge key={i} variant="warning" size="xs">{c}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Info */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Demographics */}
                <div>
                  <h3 className={`text-xs font-semibold mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    DEMOGRAPHICS
                  </h3>
                  <div className={`rounded-lg border p-3 space-y-2 ${
                    isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Calendar className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        DOB: {selectedPatient.dob} ({calculateAge(selectedPatient.dob)} years old)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        Gender: {selectedPatient.gender}
                      </span>
                    </div>
                    {selectedPatient.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                        <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {selectedPatient.phone}
                        </span>
                      </div>
                    )}
                    {selectedPatient.email && (
                      <div className="flex items-center gap-2">
                        <Mail className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                        <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {selectedPatient.email}
                        </span>
                      </div>
                    )}
                    {selectedPatient.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                        <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {selectedPatient.address}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Allergies */}
                {selectedPatient.allergies?.length > 0 && (
                  <div>
                    <h3 className={`text-xs font-semibold mb-2 text-rose-400`}>
                      ALLERGIES
                    </h3>
                    <div className="p-3 bg-rose-900/20 border border-rose-700/50 rounded-lg">
                      <p className="text-sm text-rose-300">
                        {selectedPatient.allergies.join(', ')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Insurance */}
                {selectedPatient.insurance && (
                  <div>
                    <h3 className={`text-xs font-semibold mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      INSURANCE
                    </h3>
                    <div className={`rounded-lg border p-3 ${
                      isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {selectedPatient.insurance.provider}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        Member ID: {selectedPatient.insurance.memberId}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className={`px-4 py-3 border-t flex gap-2 ${
                isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}>
                <Button 
                  variant="primary" 
                  size="sm" 
                  icon={Eye} 
                  onClick={() => onViewChart?.(selectedPatient)}
                  className="flex-1"
                >
                  View Chart
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  icon={FileText}
                  onClick={() => onSelectPatient?.(selectedPatient)}
                  className="flex-1"
                >
                  Start Encounter
                </Button>
                <Button 
                  variant="success" 
                  size="sm" 
                  icon={Video}
                  className="flex-1"
                >
                  Video Call
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <User className={`w-16 h-16 mx-auto mb-3 ${isDark ? 'text-slate-700' : 'text-slate-200'}`} />
                <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Select a patient to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientLookup;
