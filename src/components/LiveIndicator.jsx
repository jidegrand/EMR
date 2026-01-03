import React from 'react';

const LiveIndicator = ({ isLive, kioskId }) => {
  if (!isLive) return null;
  
  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
      </span>
      <span className="text-xs text-emerald-400 font-medium">
        {kioskId || 'LIVE'}
      </span>
    </div>
  );
};

export default LiveIndicator;
