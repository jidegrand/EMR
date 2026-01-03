import React from 'react';
import Badge from './ui/Badge';

const StatusBadge = ({ status }) => {
  const configs = {
    'active': { variant: 'success', label: 'Active' },
    'pending': { variant: 'warning', label: 'Pending' },
    'completed': { variant: 'success', label: 'Completed' },
    'in-progress': { variant: 'info', label: 'In Progress' },
    'stat': { variant: 'danger', label: 'STAT' },
    'routine': { variant: 'default', label: 'Routine' },
    'urgent': { variant: 'warning', label: 'Urgent' },
  };
  
  const config = configs[status] || { variant: 'default', label: status };
  
  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
