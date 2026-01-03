import React, { useState } from 'react';
import { FileText, Calendar, User, ChevronRight, Video, Building, Eye } from 'lucide-react';
import { Badge } from './ui';

const EncounterHistory = ({ encounters = [], onViewEncounter }) => {
  const [expandedId, setExpandedId] = useState(null);

  if (encounters.length === 0) {
    return (
      <div className="text-center py-6 text-slate-500">
        <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No past encounters</p>
      </div>
    );
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getTypeIcon = (type) => {
    return type === 'Telemedicine' ? Video : Building;
  };

  return (
    <div className="space-y-2">
      {encounters.map((enc) => {
        const TypeIcon = getTypeIcon(enc.type);
        const isExpanded = expandedId === enc.id;
        
        return (
          <div 
            key={enc.id} 
            className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 transition-colors"
          >
            {/* Header Row - Always Visible */}
            <button
              onClick={() => toggleExpand(enc.id)}
              className="w-full px-3 py-2 flex items-center gap-3 text-left"
            >
              <div className={`p-1.5 rounded ${enc.type === 'Telemedicine' ? 'bg-emerald-900/30' : 'bg-blue-900/30'}`}>
                <TypeIcon className={`w-4 h-4 ${enc.type === 'Telemedicine' ? 'text-emerald-400' : 'text-blue-400'}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white font-medium truncate">{enc.chiefComplaint}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(enc.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {enc.provider}
                  </span>
                </div>
              </div>

              <Badge variant={enc.type === 'Telemedicine' ? 'success' : 'info'} size="xs">
                {enc.type}
              </Badge>
              
              <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </button>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="px-3 pb-3 pt-1 border-t border-slate-700/50">
                <div className="text-xs text-slate-500 mb-1">Diagnoses</div>
                <div className="space-y-1 mb-3">
                  {enc.diagnoses.map((diag, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="font-mono text-teal-400">{diag.code}</span>
                      <span className="text-slate-300">{diag.description}</span>
                    </div>
                  ))}
                </div>
                
                {onViewEncounter && (
                  <button
                    onClick={() => onViewEncounter(enc)}
                    className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Full Encounter
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default EncounterHistory;
