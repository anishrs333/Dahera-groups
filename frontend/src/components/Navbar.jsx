import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, LogOut, Clock, Menu } from 'lucide-react';

export const Navbar = ({ onMobileMenuToggle }) => {
  const { user, logout } = useAuth();

  const isMale = user?.gender === 'MALE';
  const scheduledTime = user?.scheduled_login_time || (isMale ? '10:00 AM' : '09:30 AM');

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Mobile Menu Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-600/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight block leading-tight">Dahera Groups</span>
              <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">Enterprise ERP System</span>
            </div>
          </div>
        </div>

        {/* Right: User Profile & Shift Info */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Shift Schedule Badge */}
          {user && (
            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${
              isMale
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
                : 'bg-teal-950/80 text-teal-300 border-teal-800/80'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>Shift Login: {scheduledTime}</span>
            </div>
          )}

          {/* User Info */}
          <div className="flex items-center gap-2.5 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700/80">
            <div className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-extrabold shadow">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="text-left hidden md:block">
              <span className="text-xs font-bold text-white block leading-tight">
                {user?.full_name || user?.username}
              </span>
              <span className="text-[10px] text-slate-400 font-medium uppercase">
                {user?.role} • {user?.employee_id || 'ID N/A'}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            title="Logout"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 rounded-xl transition-colors border border-transparent hover:border-rose-900/50"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
