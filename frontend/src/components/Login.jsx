import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, Lock, User, ShieldCheck, AlertCircle, Phone, ArrowRight, Shield } from 'lucide-react';

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
      setError(err.response?.data?.detail || 'Invalid login credentials. Please check your Employee ID / Email and Password (Initial Password is your Mobile Number).');
    } fiudnally: {
      setLoading(false);
    }
  };

  const handleAdminDirectLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginDirectly('thahira_admin');
    } catch (err) {
      setError('Admin access error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4 relative font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Left Side: Brand Overview & Instant Admin Access */}
        <div className="p-8 md:p-10 bg-gradient-to-br from-[#4C0519] via-[#881337] to-[#991B1B] text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3.5 mb-8">
              <div className="p-3 bg-white/10 backdrop-blur rounded-2xl text-white shadow-lg border border-white/20">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight">Thahira Groups</h1>
                <span className="text-[11px] font-semibold text-rose-200 tracking-wider uppercase">Enterprise ERP Portal</span>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-3">Employee & Admin Portal</h2>
            <p className="text-rose-100 text-xs leading-relaxed mb-6">
              Sign in with your assigned <strong>Employee ID</strong> (e.g. <code className="bg-rose-950/60 px-1.5 py-0.5 rounded text-white">THG-M-01</code> / <code className="bg-rose-950/60 px-1.5 py-0.5 rounded text-white">THG-F-01</code>) or Email address.
            </p>

            {/* Initial Password Note */}
            <div className="bg-black/20 backdrop-blur border border-white/20 p-4 rounded-2xl mb-4 space-y-2">
              <div className="flex items-center gap-2 text-rose-200 font-bold text-xs">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Initial Password = Mobile Number</span>
              </div>
              <p className="text-[11px] text-rose-100">
                When Admin creates your employee profile (Male or Female), your <strong>initial password is set to your Mobile Number</strong>.
              </p>
            </div>

            {/* Direct Admin Access Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleAdminDirectLogin}
                disabled={loading}
                className="w-full bg-white hover:bg-rose-50 text-[#881337] font-black py-3 px-4 rounded-xl text-xs transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" />
                <span>Enter Admin Dashboard Directly</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-rose-200/80 pt-6 border-t border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Thahira Groups ERP System • Secured & Verified</span>
          </div>
        </div>

        {/* Right Side: Clean Sign In Form */}
        <div className="p-8 md:p-10 flex flex-col justify-between bg-white">
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-black text-stone-900">Sign In to Portal</h3>
              <p className="text-xs text-stone-500 mt-1">Enter your Employee ID or Email address below.</p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-800 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-700" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Employee ID or Email Address
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. THG-M-01 or thahira_admin"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:border-[#881337] font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-stone-800">Password</label>
                  <span className="text-[10px] text-rose-900 font-semibold">(Default: Mobile Number)</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your registered Mobile Number"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:border-[#881337]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#881337] hover:bg-[#991B1B] text-white font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-rose-950/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? 'Signing in...' : 'Sign In to Portal'}
              </button>
            </form>
          </div>

          <div className="mt-8 pt-4 border-t border-stone-100 text-center">
            <span className="text-[11px] text-stone-400">
              Admin username: <strong className="text-stone-800">thahira_admin</strong> • Employee Initial Password: <strong>Mobile Number</strong>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
