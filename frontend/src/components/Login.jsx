import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, Lock, User, ShieldCheck, AlertCircle, Sparkles, ArrowRight, Shield } from 'lucide-react';

export const Login = () => {
  const { login, loginDirectly } = useAuth();
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
      setError(err.response?.data?.detail || 'Invalid login credentials. Please check your Employee ID / Email.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (identifier) => {
    setError('');
    setLoading(true);
    try {
      await loginDirectly(identifier);
    } catch (err) {
      setError('Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 relative font-['Inter',sans-serif]">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Left Side: Brand Overview & Instant Admin Access */}
        <div className="p-8 md:p-10 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3.5 mb-8">
              <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-600/30">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">Dahera Groups</h1>
                <span className="text-[11px] font-semibold text-blue-400 tracking-wider uppercase">Enterprise ERP Portal</span>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-3">Beginner-Friendly Portal</h2>
            <p className="text-slate-300 text-xs leading-relaxed mb-6">
              Access staff profiles, daily check-in attendance, leave requests, and instant PDF salary slips.
            </p>

            {/* Seamless 1-Click Direct Admin Dashboard Access */}
            <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-2xl mb-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <Shield className="w-4 h-4" />
                <span>Instant Admin Access (No Login Needed)</span>
              </div>
              <p className="text-[11px] text-slate-300">Open the full Admin Dashboard with 1 click.</p>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@dahera.com')}
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-2 mt-1"
              >
                <span>Enter Admin Dashboard Directly</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 pt-4 border-t border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Dahera Groups ERP • User-Friendly Mode</span>
          </div>
        </div>

        {/* Right Side: Employee Sign In & Quick Buttons */}
        <div className="p-8 md:p-10 flex flex-col justify-between bg-white">
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-extrabold text-slate-900">Employee Sign In</h3>
              <p className="text-xs text-slate-500 mt-1">Enter your Employee ID or Email address.</p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-700 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Employee ID or Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. DHG-M-01 or DHG-F-01"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>

          {/* Quick Demo Selectors */}
          <div className="mt-8 pt-4 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
              Instant 1-Click Employee Login
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('DHG-M-01')}
                className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-xl text-xs font-bold transition-colors text-center"
              >
                Male Staff (DHG-M-01)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('DHG-F-01')}
                className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-xl text-xs font-bold transition-colors text-center"
              >
                Female Staff (DHG-F-01)
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
