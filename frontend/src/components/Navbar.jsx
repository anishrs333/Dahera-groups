import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, LogOut, Clock, User, Shield, Menu } from 'lucide-react';

export const Navbar = ({ onMobileMenuToggle }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Mobile Menu Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 text-white rounded-lg shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base tracking-tight block leading-tight">Dahera Groups</span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">ERP System</span>
            </div>
          </div>
        </div>

        {/* Right: User Profile & Shift Info */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Shift Schedule Badge */}
          {user && (
            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${
              user.gender === 'FEMALE'
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>Shift Login: {user.scheduled_login_time || (user.gender === 'FEMALE' ? '9:30 AM' : '10:00 AM')}</span>
            </div>
          )}

          {/* User Info */}
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="text-left hidden md:block">
              <span className="text-xs font-semibold text-slate-800 block leading-tight">
                {user?.full_name || user?.username}
              </span>
              <span className="text-[10px] text-slate-500 font-medium uppercase">
                {user?.role} • {user?.employee_id || 'ID N/A'}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            title="Logout"
            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
