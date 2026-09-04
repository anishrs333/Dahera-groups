import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, Clock, Menu, Shield, RefreshCw, Sun, Moon } from 'lucide-react';

export const Navbar = ({ onMobileMenuToggle, darkMode, setDarkMode }) => {
  const { user, logout } = useAuth();

  const isAdmin = user?.role === 'ADMIN' || user?.is_superuser;
  const isMale = user?.gender === 'MALE';
  const scheduledTime = user?.scheduled_login_time || (isMale ? '10:00 AM' : '09:30 AM');

  return (
    <div className="sticky top-3 z-40 px-4 sm:px-6 lg:px-8 mb-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Floating Magnetic Dock Container */}
      <header className={`max-w-7xl mx-auto rounded-full border transition-all duration-300 shadow-xl backdrop-blur-md px-6 h-16 flex items-center justify-between ${
        darkMode
          ? 'bg-stone-900/90 border-stone-800 text-white shadow-rose-950/20'
          : 'bg-white/90 border-stone-200 text-stone-900 shadow-stone-300/40'
      }`}>
        
        {/* Left: Brand & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className={`md:hidden p-2 rounded-full transition-transform hover:scale-110 ${
              darkMode ? 'text-stone-300 hover:bg-stone-800' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="p-2 bg-[#881337] text-white rounded-full shadow-md transition-transform group-hover:scale-110 duration-200">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className={`font-black text-sm tracking-tight block leading-tight ${darkMode ? 'text-white' : 'text-stone-900'}`}>
                Thahira Groups
              </span>
              <span className="text-[10px] text-rose-800 font-bold tracking-wider uppercase">ERP & Staff Portal</span>
            </div>
          </div>
        </div>

        {/* Right: Magnetic Dock Actions & User Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Shift Schedule Badge for Employees */}
          {!isAdmin && user && (
            <div className={`hidden sm:flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-xs font-bold transition-transform hover:scale-105 ${
              darkMode
                ? 'bg-stone-800 text-rose-300 border-stone-700'
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}>
              <Clock className="w-3.5 h-3.5 text-rose-800" />
              <span>Shift Login: {scheduledTime}</span>
            </div>
          )}

          {/* Admin Mode Badge */}
          {isAdmin && (
            <div className={`hidden sm:flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-xs font-bold transition-transform hover:scale-105 ${
              darkMode
                ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}>
              <Shield className="w-3.5 h-3.5 text-rose-800" />
              <span>Admin Mode</span>
            </div>
          )}

          {/* Dark Mode / Light Mode Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Dark/Light Mode"
            className={`p-2 rounded-full border transition-all duration-200 hover:scale-110 ${
              darkMode
                ? 'bg-stone-800 text-amber-300 border-stone-700 hover:bg-stone-700'
                : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
            }`}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile Badge */}
          <div className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border transition-transform hover:scale-105 ${
            darkMode
              ? 'bg-stone-800 border-stone-700'
              : 'bg-stone-100 border-stone-200'
          }`}>
            <div className="w-6 h-6 bg-[#881337] text-white rounded-full flex items-center justify-center text-xs font-black shadow-xs">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'T'}
            </div>
            <div className="text-left hidden md:block">
              <span className={`text-xs font-bold block leading-tight ${darkMode ? 'text-white' : 'text-stone-900'}`}>
                {user?.full_name || user?.username}
              </span>
              <span className={`text-[9px] font-semibold uppercase ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                {user?.role} • {user?.employee_id || 'ID N/A'}
              </span>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={logout}
            title="Sign Out"
            className={`p-2 rounded-full border transition-all duration-200 hover:scale-110 ${
              darkMode
                ? 'text-stone-400 border-stone-800 hover:text-rose-400 hover:border-rose-900 hover:bg-rose-950/40'
                : 'text-stone-400 border-stone-200 hover:text-rose-900 hover:border-rose-200 hover:bg-rose-50'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>

        </div>

      </header>
    </div>
  );
};

export default Navbar;
