import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import RFQManagement from './pages/RFQManagement';
import QuotationBuilder from './pages/QuotationBuilder';
import VendorManagement from './pages/VendorManagement';
import PaymentTracking from './pages/PaymentTracking';
import LogisticsTracking from './pages/LogisticsTracking';
import FollowupTracker from './pages/FollowupTracker';
import Communications from './pages/Communications';

const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rfq" element={<RFQManagement />} />
        <Route path="/quotations" element={<QuotationBuilder />} />
        <Route path="/vendors" element={<VendorManagement />} />
        <Route path="/payments" element={<PaymentTracking />} />
        <Route path="/logistics" element={<LogisticsTracking />} />
        <Route path="/followups" element={<FollowupTracker />} />
        <Route path="/communications" element={<Communications />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
