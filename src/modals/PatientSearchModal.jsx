import React, { useState } from 'react';
import { X, Search, Info } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { MOCK_PATIENTS } from '../data';
import { useToast } from '../contexts';

const PatientSearchModal = ({ isOpen, onClose, onSelect }) => {
  const toast = useToast();
  const [searchFields, setSearchFields] = useState({ mrn: '', firstName: '', lastName: '' });
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    const filtered = MOCK_PATIENTS.filter(p => {
      if (searchFields.mrn && !p.mrn.toLowerCase().includes(searchFields.mrn.toLowerCase())) return false;
      if (searchFields.firstName && !p.firstName.toLowerCase().includes(searchFields.firstName.toLowerCase())) return false;
      if (searchFields.lastName && !p.lastName.toLowerCase().includes(searchFields.lastName.toLowerCase())) return false;
      return true;
    });
    setResults(filtered);
    if (filtered.length === 0) {
      toast.info('No patients found');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-3xl border border-slate-600 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-700">
          <h2 className="text-teal-400 font-medium">Search for a Patient</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-4 gap-3 mb-4">
            <Input 
              label="MRN/HCN" 
              value={searchFields.mrn} 
              onChange={(e) => setSearchFields(p => ({ ...p, mrn: e.target.value }))} 
              small 
            />
            <Input 
              label="First Name" 
              value={searchFields.firstName} 
              onChange={(e) => setSearchFields(p => ({ ...p, firstName: e.target.value }))} 
              small 
            />
            <Input 
              label="Last Name" 
              value={searchFields.lastName} 
              onChange={(e) => setSearchFields(p => ({ ...p, lastName: e.target.value }))} 
              small 
            />
            <div className="flex items-end">
              <Button variant="primary" size="sm" icon={Search} onClick={handleSearch}>Find</Button>
            </div>
          </div>
          <div className="h-48 overflow-y-auto bg-slate-900/30 border border-slate-700 rounded">
            {results.length > 0 ? (
              <table className="w-full text-xs">
                <thead className="bg-slate-800 sticky top-0">
                  <tr className="text-slate-400">
                    <th className="px-3 py-2 text-left">MRN</th>
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-left">DOB</th>
                    <th className="px-3 py-2 text-left">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(p => (
                    <tr 
                      key={p.id} 
                      onClick={() => { onSelect(p); onClose(); }} 
                      className="border-t border-slate-700 hover:bg-teal-900/30 cursor-pointer text-slate-300"
                    >
                      <td className="px-3 py-2 font-mono">{p.mrn}</td>
                      <td className="px-3 py-2">{p.lastName}, {p.firstName}</td>
                      <td className="px-3 py-2">{p.dob}</td>
                      <td className="px-3 py-2">{p.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                <Info className="w-4 h-4 mr-2" />
                Enter search criteria and click Find
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-4 py-3 bg-slate-900 border-t border-slate-700">
          <Button variant="danger" size="sm" icon={X} onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export default PatientSearchModal;
