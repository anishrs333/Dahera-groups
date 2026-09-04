import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import BottomDock from './components/BottomDock';

const MainLayout = () => {
  const { user, loading } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.is_superuser;

  const [activeTab, setActiveTab] = useState(isAdmin ? 'admin-dashboard' : 'dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showEmployeeLoginModal, setShowEmployeeLoginModal] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('thahira_theme') === 'dark';
  });

  useEffect(() => {
    if (user) {
      setActiveTab(isAdmin ? 'admin-dashboard' : 'dashboard');
    }
  }, [user?.id, isAdmin]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('thahira_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('thahira_theme', 'light');
    }
  }, [darkMode]);

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center font-['Plus_Jakarta_Sans',sans-serif] ${darkMode ? 'bg-stone-950 text-white' : 'bg-[#FAF9F6] text-stone-900'}`}>
        <div className="w-10 h-10 border-4 border-rose-900 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs font-bold">Loading Thahira Groups System...</span>
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={() => setActiveTab('dashboard')} />;
  }

  return (
    <div className={`min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-300 ${
      darkMode ? 'bg-stone-950 text-stone-100' : 'bg-[#FAF9F6] text-stone-900'
    }`}>
      <Navbar
        onMobileMenuToggle={() => setMobileOpen(!mobileOpen)}
        onOpenEmployeeLogin={() => setShowEmployeeLoginModal(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <div className="flex flex-1 max-w-7xl w-full mx-auto px-2 sm:px-6 lg:px-8 pb-24">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          darkMode={darkMode}
        />

        <main className="flex-1 p-2 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
          {isAdmin ? (
            <AdminDashboard subTab={activeTab} darkMode={darkMode} />
          ) : (
            <EmployeeDashboard subTab={activeTab} darkMode={darkMode} />
          )}
        </main>
      </div>

      <BottomDock
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {showEmployeeLoginModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <Login
              isModal={true}
              onClose={() => setShowEmployeeLoginModal(false)}
              onLoginSuccess={() => {
                setShowEmployeeLoginModal(false);
                setActiveTab('dashboard');
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

export default App;
