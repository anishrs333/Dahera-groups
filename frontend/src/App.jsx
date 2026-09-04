import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';

const MainLayout = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-stone-900 flex flex-col items-center justify-center font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="w-10 h-10 border-4 border-rose-900 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs font-bold text-stone-700">Initializing Thahira Groups Enterprise Portal...</span>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const isAdmin = user.role === 'ADMIN' || user.is_superuser;

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
          {isAdmin ? (
            activeTab === 'attendance' ? (
              <EmployeeDashboard subTab="attendance" />
            ) : (
              <AdminDashboard subTab={activeTab} />
            )
          ) : (
            <EmployeeDashboard subTab={activeTab} />
          )}
        </main>
      </div>
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
