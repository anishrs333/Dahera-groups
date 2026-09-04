import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, Clock, Menu, Shield, RefreshCw } from 'lucide-react';

export const Navbar = ({ onMobileMenuToggle }) => {
  const { user, logout } = useAuth();

  const isAdmin = user?.role === 'ADMIN' || user?.is_superuser;
  const isMale = user?.gender === 'MALE';
  const scheduledTime = user?.scheduled_login_time || (isMale ? '10:00 AM' : '09:30 AM');

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs font-['Inter',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Mobile Menu Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-600/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-base tracking-tight block leading-tight">Dahera Groups</span>
              <span className="text-[10px] text-blue-600 font-bold tracking-wider uppercase">ERP & Staff Portal</span>
            </div>
          </div>
        </div>

        {/* Right: User Status & Shift Badge */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Shift Schedule Badge for Employees */}
          {!isAdmin && user && (
            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${
              isMale
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-purple-50 text-purple-700 border-purple-200'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>Shift Login: {scheduledTime}</span>
            </div>
          )}

          {/* Admin Indicator */}
          {isAdmin && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Admin Control Mode</span>
            </div>
          )}

          {/* User Profile Badge */}
          <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-black shadow-xs">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="text-left hidden md:block">
              <span className="text-xs font-bold text-slate-800 block leading-tight">
                {user?.full_name || user?.username}
              </span>
              <span className="text-[10px] text-slate-500 font-medium uppercase">
                {user?.role} • {user?.employee_id || 'ID N/A'}
              </span>
            </div>
          </div>

          {/* Reset / Sign Out Button */}
          <button
            onClick={logout}
            title="Sign Out"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
};

export default Navbar;
