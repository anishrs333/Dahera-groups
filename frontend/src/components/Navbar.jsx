import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, Clock, Menu, Shield, RefreshCw, Sun, Moon } from 'lucide-react';

export const Navbar = ({ onMobileMenuToggle, darkMode, setDarkMode }) => {
  const { user, logout } = useAuth();

  const isAdmin = user?.role === 'ADMIN' || user?.is_superuser;
  const isMale = user?.gender === 'MALE';
  const scheduledTime = user?.scheduled_login_time || (isMale ? '10:00 AM' : '09:30 AM');

  return (
    <div className="sticky top-2 sm:top-3 z-40 px-2 sm:px-6 lg:px-8 mb-4 sm:mb-6 font-['Plus_Jakarta_Sans',sans-serif]">
      <header className={`max-w-7xl mx-auto rounded-2xl sm:rounded-full border transition-all duration-300 shadow-lg backdrop-blur-md px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between ${
        darkMode
          ? 'bg-stone-900/90 border-stone-800 text-white shadow-rose-950/20'
          : 'bg-white/90 border-stone-200 text-stone-900 shadow-stone-300/40'
      }`}>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onMobileMenuToggle}
            className={`md:hidden p-1.5 rounded-xl transition-transform active:scale-95 ${
              darkMode ? 'text-stone-300 hover:bg-stone-800' : 'text-stone-600 hover:bg-stone-100'
            }`}
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer">
            <div className="p-1.5 sm:p-2 bg-[#881337] text-white rounded-xl sm:rounded-full shadow-md shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className={`font-black text-xs sm:text-sm tracking-tight block leading-tight ${darkMode ? 'text-white' : 'text-stone-900'}`}>
                Thahira Groups
              </span>
              <span className="text-[9px] sm:text-[10px] text-rose-800 font-bold tracking-wider uppercase block leading-none">
                Portal
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {!isAdmin && user && (
            <div className={`hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${
              darkMode
                ? 'bg-stone-800 text-rose-300 border-stone-700'
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}>
              <Clock className="w-3.5 h-3.5 text-rose-800" />
              <span>Shift: {scheduledTime}</span>
            </div>
          )}

          {isAdmin && (
            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 rounded-full border text-[11px] sm:text-xs font-bold ${
              darkMode
                ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}>
              <Shield className="w-3.5 h-3.5 text-rose-800 shrink-0" />
              <span className="truncate">Admin</span>
            </div>
          )}

          <button
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Theme"
            className={`p-1.5 sm:p-2 rounded-full border transition-all duration-200 active:scale-95 ${
              darkMode
                ? 'bg-stone-800 text-amber-300 border-stone-700 hover:bg-stone-700'
                : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
            }`}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className={`flex items-center gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border ${
            darkMode
              ? 'bg-stone-800 border-stone-700'
              : 'bg-stone-100 border-stone-200'
          }`}>
            <div className="w-6 h-6 bg-[#881337] text-white rounded-full flex items-center justify-center text-xs font-black shadow-xs shrink-0">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'T'}
            </div>
            <div className="text-left hidden md:block">
              <span className={`text-xs font-bold block leading-tight truncate max-w-[120px] ${darkMode ? 'text-white' : 'text-stone-900'}`}>
                {user?.full_name || user?.username}
              </span>
              <span className={`text-[9px] font-semibold uppercase block ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                {user?.role}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            title="Logout"
            className={`p-1.5 sm:p-2 rounded-full border transition-all duration-200 active:scale-95 ${
              darkMode
                ? 'text-stone-400 border-stone-800 hover:text-rose-400 hover:bg-rose-950/40'
                : 'text-stone-400 border-stone-200 hover:text-rose-900 hover:bg-rose-50'
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
