import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, Lock, User, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

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
      setError(err.response?.data?.detail || 'Invalid login credentials. Please verify and try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (userType) => {
    setError('');
    if (userType === 'admin') {
      setUsername('admin@dahera.com');
      setPassword('Admin@123');
    } else if (userType === 'john') {
      setUsername('john.male@dahera.com');
      setPassword('Employee@123');
    } else if (userType === 'sarah') {
      setUsername('sarah.female@dahera.com');
      setPassword('Employee@123');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-['Inter',sans-serif]">
      {/* Dynamic Background Glowing Orbs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative z-10 backdrop-blur-xl">
        
        {/* Left Side: Brand Identity */}
        <div className="p-8 md:p-10 bg-gradient-to-br from-emerald-950/60 via-slate-900 to-teal-950/40 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3.5 mb-8">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 shadow-lg shadow-emerald-500/10">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Dahera Groups</h1>
                <span className="text-[11px] font-semibold text-emerald-400 tracking-wider uppercase">Enterprise ERP Portal</span>
              </div>
            </div>

            <h2 className="text-xl font-bold text-white mb-3">Human Resource & Management Suite</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Access your personalized employee dashboard, attendance logs, leave management portal, and salary slip statements securely.
            </p>

            <div className="space-y-3 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 text-xs">
              <div className="flex items-center gap-2.5 text-slate-300 font-medium">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Encrypted JWT Token Authentication</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300 font-medium">
                <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Role-Based Access Control (RBAC)</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300 font-medium">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Automated PDF Payslip Downloads</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 pt-6 border-t border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Dahera Security System • End-to-End Verified</span>
          </div>
        </div>

        {/* Right Side: Form & Generic Demo Account Fill */}
        <div className="p-8 md:p-10 flex flex-col justify-between bg-slate-900">
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white">Sign In to Account</h3>
              <p className="text-xs text-slate-400 mt-1">Enter your organization credentials below.</p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2.5 text-rose-300 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email / Username</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="user@dahera.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? 'Authenticating...' : 'Sign In to Portal'}
              </button>
            </form>
          </div>

          {/* Quick Selector (Generic Demo Accounts) */}
          <div className="mt-8 pt-4 border-t border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
              Quick Demo Login Selector
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition-colors"
              >
                Admin Account
              </button>
              <button
                type="button"
                onClick={() => fillDemo('john')}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 rounded-xl text-xs font-medium transition-colors"
              >
                Employee 1 (John)
              </button>
              <button
                type="button"
                onClick={() => fillDemo('sarah')}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 rounded-xl text-xs font-medium transition-colors"
              >
                Employee 2 (Sarah)
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
