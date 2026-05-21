import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

const AppShell: React.FC = () => {
  const isAuthenticated = localStorage.getItem('crm_authenticated') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Topbar />
      <Sidebar />
      <main className="ml-[240px] mt-[60px] h-[calc(100vh-60px)] overflow-y-auto p-6">
        <div className="page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppShell;
