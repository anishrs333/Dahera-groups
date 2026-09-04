import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, Lock, User, Clock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid login credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (userType) => {
    setError('');
    if (userType === 'admin') {
      setUsername('admin@dahera.com');
      setPassword('Admin@123');
    } else if (userType === 'male') {
      setUsername('john.male@dahera.com');
      setPassword('Employee@123');
    } else if (userType === 'female') {
      setUsername('sarah.female@dahera.com');
      setPassword('Employee@123');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-slate-800 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden relative z-10">
        
        {/* Left Side: Branding & Info */}
        <div className="p-8 bg-gradient-to-br from-blue-900/40 via-slate-800 to-slate-900 border-b md:border-b-0 md:border-r border-slate-700/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Dahera Groups</h1>
                <p className="text-xs text-blue-400 font-medium tracking-wide uppercase">Enterprise Portal</p>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Welcome to the secure HR management, attendance, and payroll portal for Dahera Groups.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 bg-slate-800/80 p-3 rounded-lg border border-slate-700/50">
                <Clock className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">Male Employee Shift Schedule</span>
                  <span className="text-xs text-blue-300">Standard Daily Check-in: <strong>10:00 AM</strong></span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-800/80 p-3 rounded-lg border border-slate-700/50">
                <Clock className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">Female Employee Shift Schedule</span>
                  <span className="text-xs text-purple-300">Standard Daily Check-in: <strong>9:30 AM</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 pt-4 border-t border-slate-700/40">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secured with JWT, Object-Level RBAC & Encrypted Sessions</span>
          </div>
        </div>

        {/* Right Side: Login Form & Quick Selectors */}
        <div className="p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Account Sign In</h2>
            <p className="text-xs text-slate-400 mb-6">Enter your organizational credentials to continue.</p>

            {error && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-center gap-2 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Username / Email</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="name@dahera.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg text-sm transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
              </button>
            </form>
          </div>

          {/* Quick Fill Buttons for Demo */}
          <div className="mt-8 pt-4 border-t border-slate-700/50">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">Quick Demo Login</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="px-2 py-1.5 bg-slate-700/60 hover:bg-slate-700 text-slate-200 border border-slate-600/50 rounded text-xs font-medium text-center transition-colors"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemo('male')}
                className="px-2 py-1.5 bg-blue-950/60 hover:bg-blue-900/60 text-blue-300 border border-blue-800/50 rounded text-xs font-medium text-center transition-colors"
              >
                Male (10:00)
              </button>
              <button
                type="button"
                onClick={() => fillDemo('female')}
                className="px-2 py-1.5 bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-800/50 rounded text-xs font-medium text-center transition-colors"
              >
                Female (9:30)
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
