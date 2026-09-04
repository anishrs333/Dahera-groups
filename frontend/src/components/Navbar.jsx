import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, Clock, Menu, Shield, RefreshCw } from 'lucide-react';

export const Navbar = ({ onMobileMenuToggle }) => {
  const { user, logout } = useAuth();

  const isAdmin = user?.role === 'ADMIN' || user?.is_superuser;
  const isMale = user?.gender === 'MALE';
  const scheduledTime = user?.scheduled_login_time || (isMale ? '10:00 AM' : '09:30 AM');

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Mobile Menu Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#881337] text-white rounded-xl shadow-md shadow-rose-950/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-stone-900 text-base tracking-tight block leading-tight">Thahira Groups</span>
              <span className="text-[10px] text-rose-900 font-bold tracking-wider uppercase">ERP & Staff Portal</span>
            </div>
          </div>
        </div>

        {/* Right: User Status & Shift Badge */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Shift Schedule Badge for Employees */}
          {!isAdmin && user && (
            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${
              isMale
                ? 'bg-rose-50 text-rose-900 border-rose-200'
                : 'bg-amber-50 text-amber-900 border-amber-200'
            }`}>
              <Clock className="w-3.5 h-3.5 text-rose-800" />
              <span>Shift Login: {scheduledTime}</span>
            </div>
          )}

          {/* Admin Mode Badge */}
          {isAdmin && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-900 border border-rose-200 rounded-full text-xs font-bold">
              <Shield className="w-3.5 h-3.5 text-rose-900" />
              <span>Admin Mode</span>
            </div>
          )}

          {/* User Profile Badge */}
          <div className="flex items-center gap-2.5 bg-stone-100/80 px-3 py-1.5 rounded-xl border border-stone-200">
            <div className="w-7 h-7 bg-[#881337] text-white rounded-full flex items-center justify-center text-xs font-black shadow-xs">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'T'}
            </div>
            <div className="text-left hidden md:block">
              <span className="text-xs font-bold text-stone-900 block leading-tight">
                {user?.full_name || user?.username}
              </span>
              <span className="text-[10px] text-stone-500 font-semibold uppercase">
                {user?.role} • {user?.employee_id || 'ID N/A'}
              </span>
            </div>
          </div>

          {/* Reset / Sign Out Button */}
          <button
            onClick={logout}
            title="Sign Out"
            className="p-2 text-stone-400 hover:text-rose-900 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
};

export default Navbar;
