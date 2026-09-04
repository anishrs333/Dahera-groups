import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, UserCheck, CalendarDays, Receipt, Users, X, Shield } from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.is_superuser;

  const employeeNav = [
    { id: 'dashboard', label: 'My Portal & Bio', icon: LayoutDashboard },
    { id: 'attendance', label: 'Check-In / Attendance', icon: UserCheck },
    { id: 'leaves', label: 'Leave Applications', icon: CalendarDays },
    { id: 'payroll', label: 'Salary Slips', icon: Receipt },
  ];

  const adminNav = [
    { id: 'admin-dashboard', label: 'Admin Executive Overview', icon: LayoutDashboard },
    { id: 'admin-employees', label: 'Employee Directory', icon: Users },
    { id: 'admin-leaves', label: 'Leave Approvals Queue', icon: CalendarDays },
    { id: 'admin-payroll', label: 'Payroll & Salary Slips', icon: Receipt },
    { id: 'attendance', label: 'My Personal Attendance', icon: UserCheck },
  ];

  const navItems = isAdmin ? adminNav : employeeNav;

  const handleSelect = (id) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between py-5 bg-white border-r border-slate-200">
      <div>
        <div className="px-5 mb-5 flex items-center justify-between">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
            {isAdmin ? (
              <>
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span>Admin Command Center</span>
              </>
            ) : (
              <span>Employee Portal</span>
            )}
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-1.5 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="px-5 pt-4 border-t border-slate-100 text-xs text-slate-400">
        <p className="font-bold text-slate-700">Dahera Groups ERP v1.0</p>
        <p className="text-[11px]">User-Friendly Enterprise Suite</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 min-h-[calc(100vh-4rem)] shrink-0">
        {navContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Mobile Drawer Panel */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent}
      </div>
    </>
  );
};

export default Sidebar;
