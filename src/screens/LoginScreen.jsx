import React, { useState } from 'react';
import { Stethoscope, Mail, Lock, Eye, EyeOff, RefreshCw, LogIn, AlertCircle, Info, ShieldCheck } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { DEMO_CREDENTIALS, MOCK_USER } from '../data';
import { useToast } from '../contexts';

const LoginScreen = ({ onLogin }) => {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    if (email.toLowerCase() === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      toast.success(`Welcome back, ${MOCK_USER.name}!`);
      onLogin(MOCK_USER);
    } else {
      toast.error('Invalid credentials');
      setError('Invalid email or password. Please use the demo credentials below.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl shadow-lg shadow-teal-500/30 mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">ExtendiLite eMR</h1>
          <p className="text-slate-400">Provider Portal - Secure Login</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-900/30 border border-rose-700 rounded-lg flex items-start gap-2 text-rose-400 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              label="Email Address" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="provider@extendilite.com" 
              icon={Mail} 
            />
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full pl-8 pr-10 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200 text-sm focus:border-teal-500 outline-none" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full" 
              size="lg" 
              icon={isLoading ? RefreshCw : LogIn} 
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-6 p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-teal-400" />
              <span className="text-sm font-medium text-teal-400">Demo Account</span>
            </div>
            <div className="text-xs text-slate-400 space-y-1 font-mono">
              <p>Email: {DEMO_CREDENTIALS.email}</p>
              <p>Password: {DEMO_CREDENTIALS.password}</p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/30 border border-emerald-700/50 rounded">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-emerald-400">HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-900/30 border border-cyan-700/50 rounded">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-cyan-400">256-bit SSL</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
