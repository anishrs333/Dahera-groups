import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, Lock, User, ShieldCheck, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';

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
      setError(err.response?.data?.detail || 'Invalid login credentials. Please check your Employee ID / Email and password.');
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
      setUsername('DHG-M-01'); // Male Employee ID (John Doe)
      setPassword('Employee@123');
    } else if (userType === 'sarah') {
      setUsername('DHG-F-01'); // Female Employee ID (Sarah Connor)
      setPassword('Employee@123');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-['Inter',sans-serif]">
      {/* Background Glowing Effects */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative z-10 backdrop-blur-xl">
        
        {/* Left Side: Brand Overview & Easy Instructions */}
        <div className="p-8 md:p-10 bg-gradient-to-br from-emerald-950/60 via-slate-900 to-teal-950/40 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3.5 mb-8">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 shadow-lg shadow-emerald-500/10">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Dahera Groups</h1>
                <span className="text-[11px] font-semibold text-emerald-400 tracking-wider uppercase">Easy ERP & Staff Portal</span>
              </div>
            </div>

            <h2 className="text-xl font-bold text-white mb-3">Beginner-Friendly Portal Login</h2>
            <p className="text-slate-400 text-xs leading-relaxed mb-6">
              Log in using your <strong>Employee ID</strong> (e.g., <code className="bg-slate-800 px-1.5 py-0.5 rounded text-emerald-300">DHG-M-01</code> or <code className="bg-slate-800 px-1.5 py-0.5 rounded text-teal-300">DHG-F-01</code>) or your company email.
            </p>

            <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs">
              <div className="flex items-start gap-2.5 text-slate-300">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Male Staff IDs (Shift: 10:00 AM)</span>
                  <span className="text-[11px] text-emerald-400 font-mono">DHG-M-01, DHG-M-02, DHG-M-03</span>
                </div>
              </div>
              
              <div className="flex items-start gap-2.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Female Staff IDs (Shift: 9:30 AM)</span>
                  <span className="text-[11px] text-teal-300 font-mono">DHG-F-01, DHG-F-02, DHG-F-03</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 pt-6 border-t border-slate-800">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>Need assistance? Contact Dahera Administrator.</span>
          </div>
        </div>

        {/* Right Side: Form & Quick Fill */}
        <div className="p-8 md:p-10 flex flex-col justify-between bg-slate-900">
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white">Employee Sign In</h3>
              <p className="text-xs text-slate-400 mt-1">Enter your Employee ID or Email below.</p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2.5 text-rose-300 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Employee ID or Email Address
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. DHG-M-01 or DHG-F-01"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Type DHG-M-01 or DHG-F-01 to log in directly!</span>
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
                {loading ? 'Logging in...' : 'Sign In to Portal'}
              </button>
            </form>
          </div>

          {/* Quick Demo Fill Buttons with updated DHG Employee IDs */}
          <div className="mt-8 pt-4 border-t border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
              1-Click Demo Login Selectors
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="px-2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-[11px] font-semibold transition-colors"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemo('john')}
                className="px-2 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 rounded-xl text-[11px] font-semibold transition-colors"
              >
                DHG-M-01
              </button>
              <button
                type="button"
                onClick={() => fillDemo('sarah')}
                className="px-2 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 rounded-xl text-[11px] font-semibold transition-colors"
              >
                DHG-F-01
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
