import React, { useState, useEffect, useCallback } from 'react';
import { Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui';

/**
 * SessionTimeoutModal - Warns user before auto-logout due to inactivity
 * 
 * Props:
 * - timeoutMinutes: Minutes of inactivity before showing warning (default: 14)
 * - warningSeconds: Seconds to show warning before logout (default: 60)
 * - onTimeout: Callback when session expires
 * - isAuthenticated: Only track when user is logged in
 */

const SessionTimeoutModal = ({ 
  timeoutMinutes = 14, 
  warningSeconds = 60, 
  onTimeout, 
  isAuthenticated 
}) => {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(warningSeconds);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Reset activity timer
  const resetTimer = useCallback(() => {
    setLastActivity(Date.now());
    setShowWarning(false);
    setCountdown(warningSeconds);
  }, [warningSeconds]);

  // Track user activity
  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    
    const handleActivity = () => {
      if (!showWarning) {
        setLastActivity(Date.now());
      }
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isAuthenticated, showWarning]);

  // Check for inactivity
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkInterval = setInterval(() => {
      const inactiveTime = Date.now() - lastActivity;
      const timeoutMs = timeoutMinutes * 60 * 1000;

      if (inactiveTime >= timeoutMs && !showWarning) {
        setShowWarning(true);
        setCountdown(warningSeconds);
      }
    }, 1000);

    return () => clearInterval(checkInterval);
  }, [isAuthenticated, lastActivity, timeoutMinutes, warningSeconds, showWarning]);

  // Countdown when warning is shown
  useEffect(() => {
    if (!showWarning) return;

    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          onTimeout?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [showWarning, onTimeout]);

  if (!showWarning || !isAuthenticated) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return `${secs}s`;
  };

  const progressPercent = (countdown / warningSeconds) * 100;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[70] p-4">
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-md border border-amber-600 overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-slate-700">
          <div 
            className="h-full bg-amber-500 transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-center px-4 py-4 bg-amber-900/30 border-b border-amber-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-900/50 rounded-full animate-pulse">
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Session Timeout Warning</h2>
              <p className="text-xs text-amber-300/70">Your session is about to expire</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="mb-4">
            <div className="text-5xl font-bold text-amber-400 font-mono mb-2">
              {formatTime(countdown)}
            </div>
            <p className="text-sm text-slate-400">
              until automatic sign out
            </p>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-900 rounded-lg text-left mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-slate-300">
              <p>You have been inactive for {timeoutMinutes} minutes.</p>
              <p className="text-slate-500 mt-1">
                For HIPAA compliance and security, your session will be automatically terminated.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Click anywhere or press any key to stay signed in
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-3 px-4 py-4 bg-slate-900 border-t border-slate-700">
          <Button variant="primary" icon={RefreshCw} onClick={resetTimer} className="w-full">
            Stay Signed In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutModal;
