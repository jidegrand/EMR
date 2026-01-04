import React, { useState, useRef, useEffect } from 'react';
import { 
  Stethoscope, Shield, Lock, Smartphone, Mail, MessageSquare, 
  RefreshCw, ArrowLeft, CheckCircle2, AlertCircle, Clock, Key
} from 'lucide-react';
import { Button } from '../components/ui';
import { TWO_FACTOR_CONFIG, DEMO_2FA_CODE } from '../data';
import { useToast } from '../contexts';

const TwoFactorScreen = ({ user, onVerify, onCancel, onResend }) => {
  const toast = useToast();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Lockout timer
  useEffect(() => {
    if (lockoutTimer > 0) {
      const timer = setTimeout(() => setLockoutTimer(lockoutTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isLocked && lockoutTimer === 0) {
      setIsLocked(false);
      setAttempts(0);
    }
  }, [lockoutTimer, isLocked]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index, value) => {
    if (isLocked) return;
    
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (value && index === 5 && newCode.every(d => d !== '')) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (isLocked) return;
    
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    if (isLocked) return;
    
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      const newCode = pastedData.split('');
      setCode(newCode);
      inputRefs.current[5]?.focus();
      handleSubmit(pastedData);
    }
  };

  const handleSubmit = async (submittedCode = code.join('')) => {
    if (isLocked || submittedCode.length !== 6) return;
    
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    await new Promise(r => setTimeout(r, 800));
    
    // Demo validation - in production this would validate against server
    if (submittedCode === DEMO_2FA_CODE) {
      toast.success('Two-factor authentication successful!');
      onVerify({ rememberDevice });
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= TWO_FACTOR_CONFIG.maxAttempts) {
        setIsLocked(true);
        setLockoutTimer(TWO_FACTOR_CONFIG.lockoutMinutes * 60);
        setError(`Too many failed attempts. Please wait ${TWO_FACTOR_CONFIG.lockoutMinutes} minutes.`);
        toast.error('Account temporarily locked due to failed attempts');
      } else {
        setError(`Invalid code. ${TWO_FACTOR_CONFIG.maxAttempts - newAttempts} attempts remaining.`);
        toast.error('Invalid verification code');
      }
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
    
    setIsLoading(false);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    setResendCooldown(30);
    toast.info('A new verification code has been sent');
    onResend?.();
  };

  const getMethodIcon = () => {
    switch (user?.twoFactorMethod) {
      case 'sms': return MessageSquare;
      case 'email': return Mail;
      default: return Smartphone;
    }
  };

  const getMethodText = () => {
    switch (user?.twoFactorMethod) {
      case 'sms': return 'We sent a code to your phone ending in ****7890';
      case 'email': return `We sent a code to ${user?.email?.replace(/(.{2}).*(@.*)/, '$1***$2')}`;
      default: return 'Enter the code from your authenticator app';
    }
  };

  const MethodIcon = getMethodIcon();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl shadow-lg shadow-teal-500/30 mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Two-Factor Authentication</h1>
          <p className="text-slate-400">Verify your identity to continue</p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          {/* Method Indicator */}
          <div className="flex items-center gap-3 mb-6 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
            <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center">
              <MethodIcon className="w-5 h-5 text-teal-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-200">Verification Required</p>
              <p className="text-xs text-slate-400">{getMethodText()}</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-rose-900/30 border border-rose-700 rounded-lg flex items-start gap-2 text-rose-400 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Lockout Message */}
          {isLocked && (
            <div className="mb-4 p-3 bg-amber-900/30 border border-amber-700 rounded-lg flex items-center gap-2 text-amber-400 text-sm">
              <Clock className="w-4 h-4" />
              <span>Try again in {formatTime(lockoutTimer)}</span>
            </div>
          )}

          {/* Code Input */}
          <div className="mb-6">
            <label className="block text-xs font-medium text-slate-400 mb-3 text-center">
              Enter 6-digit verification code
            </label>
            <div className="flex justify-center gap-2" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={isLocked || isLoading}
                  className={`w-12 h-14 text-center text-2xl font-mono font-bold rounded-lg border-2 outline-none transition-all ${
                    isLocked
                      ? 'bg-slate-900/50 border-slate-700 text-slate-500 cursor-not-allowed'
                      : digit
                        ? 'bg-teal-900/30 border-teal-500 text-teal-400'
                        : 'bg-slate-900 border-slate-600 text-slate-200 focus:border-teal-500'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Remember Device */}
          <label className="flex items-center gap-2 mb-6 cursor-pointer group">
            <input
              type="checkbox"
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.target.checked)}
              className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-teal-500 focus:ring-teal-500 focus:ring-offset-slate-800"
            />
            <span className="text-sm text-slate-400 group-hover:text-slate-300">
              Remember this device for {TWO_FACTOR_CONFIG.rememberDeviceDays} days
            </span>
          </label>

          {/* Verify Button */}
          <Button
            onClick={() => handleSubmit()}
            variant="primary"
            className="w-full mb-4"
            size="lg"
            icon={isLoading ? RefreshCw : CheckCircle2}
            disabled={isLoading || isLocked || code.some(d => d === '')}
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </Button>

          {/* Resend Code */}
          {user?.twoFactorMethod !== 'totp' && (
            <div className="text-center mb-4">
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className={`text-sm ${
                  resendCooldown > 0 
                    ? 'text-slate-500 cursor-not-allowed' 
                    : 'text-teal-400 hover:text-teal-300'
                }`}
              >
                {resendCooldown > 0 
                  ? `Resend code in ${resendCooldown}s` 
                  : "Didn't receive a code? Resend"}
              </button>
            </div>
          )}

          {/* Back to Login */}
          <button
            onClick={onCancel}
            className="w-full flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-slate-300 py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </button>
        </div>

        {/* Demo Info */}
        <div className="mt-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-4 h-4 text-teal-400" />
            <span className="text-sm font-medium text-teal-400">Demo 2FA Code</span>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            <p>Code: <span className="text-teal-300 font-bold tracking-widest">{DEMO_2FA_CODE}</span></p>
          </div>
        </div>

        {/* Security Badges */}
        <div className="mt-6 flex justify-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/30 border border-emerald-700/50 rounded">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-emerald-400">HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-900/30 border border-cyan-700/50 rounded">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-cyan-400">2FA Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorScreen;
