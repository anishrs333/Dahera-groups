import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, UserCheck, CalendarDays, Receipt, Users, Sun, Moon, User } from 'lucide-react';

export const BottomDock = ({ activeTab, setActiveTab, darkMode, setDarkMode }) => {
  const { user } = useAuth();
  if (!user) return null;

  const isAdmin = user?.role === 'ADMIN' || user?.is_superuser;

  const adminDockItems = [
    { id: 'admin-dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'admin-attendance', label: 'Attendance', icon: UserCheck },
    { id: 'admin-employees', label: 'Directory', icon: Users },
    { id: 'admin-leaves', label: 'Leaves', icon: CalendarDays },
    { id: 'admin-payroll', label: 'Payslips', icon: Receipt },
  ];

  const employeeDockItems = [
    { id: 'dashboard', label: 'My Bio', icon: User },
    { id: 'attendance', label: 'Attendance', icon: UserCheck },
    { id: 'leaves', label: 'Leaves', icon: CalendarDays },
    { id: 'payroll', label: 'Payslips', icon: Receipt },
  ];

  const dockItems = isAdmin ? adminDockItems : employeeDockItems;

  return (
    <div className="fixed bottom-2 sm:bottom-5 left-1/2 -translate-x-1/2 z-50 font-['Plus_Jakarta_Sans',sans-serif] px-2 max-w-[98vw] sm:max-w-full">
      <div className={`flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full border shadow-2xl backdrop-blur-md transition-all duration-300 ${
        darkMode
          ? 'bg-stone-900/90 border-stone-800 text-white shadow-rose-950/40'
          : 'bg-white/90 border-stone-200 text-stone-900 shadow-stone-400/30'
      }`}>
        {dockItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group relative flex flex-col items-center justify-center px-2 sm:px-4 py-1 sm:py-2 rounded-full transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-[#881337] text-white shadow-lg shadow-rose-950/30 scale-105 font-black'
                  : darkMode
                    ? 'text-stone-400 hover:bg-stone-800 hover:text-white'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 sm:w-5 sm:h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-white' : 'group-hover:scale-110'}`} />
              <span className="text-[8px] sm:text-[10px] font-bold tracking-tight mt-0.5 whitespace-nowrap">
                {item.label}
              </span>

              {isActive && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 bg-rose-400 rounded-full shadow-xs" />
              )}
            </button>
          );
        })}

        <div className={`h-5 sm:h-6 w-[1px] mx-0.5 ${darkMode ? 'bg-stone-800' : 'bg-stone-200'}`} />

        <button
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle Theme"
          className={`p-1.5 sm:p-2 rounded-full transition-transform active:scale-90 ${
            darkMode ? 'text-amber-300 hover:bg-stone-800' : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          {darkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>
      </div>
    </div>
  );
};

export default BottomDock;
