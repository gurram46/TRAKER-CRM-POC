import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import RFQManagement from './pages/RFQManagement';
import QuotationBuilder from './pages/QuotationBuilder';
import VendorManagement from './pages/VendorManagement';
import Vendors from './pages/Vendors';
import Quotations from './pages/Quotations';
import TransporterMaster from './pages/TransporterMaster';
import PaymentTracking from './pages/PaymentTracking';
import LogisticsTracking from './pages/LogisticsTracking';
import FollowupTracker from './pages/FollowupTracker';
import Communications from './pages/Communications';
import Automations from './pages/Automations';
import ItemMaster from './pages/ItemMaster';
import NewEnquiry from './pages/NewEnquiry';
import PriceCalculator from './pages/PriceCalculator';
import WhatsAppGenerator from './pages/WhatsAppGenerator';
import AdminSettings from './pages/AdminSettings';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rfq" element={<RFQManagement />} />
        <Route path="/quotations" element={<Quotations />} />
        <Route path="/quotation-builder" element={<QuotationBuilder />} />
        <Route path="/contacts" element={<VendorManagement />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/transporters" element={<TransporterMaster />} />
        <Route path="/payments" element={<PaymentTracking />} />
        <Route path="/logistics" element={<LogisticsTracking />} />
        <Route path="/followups" element={<FollowupTracker />} />
        <Route path="/automations" element={<Automations />} />
        <Route path="/communications" element={<Communications />} />
        <Route path="/items" element={<ItemMaster />} />
        <Route path="/new-enquiry" element={<NewEnquiry />} />
        <Route path="/calculator" element={<PriceCalculator />} />
        <Route path="/whatsapp" element={<WhatsAppGenerator />} />
        <Route path="/settings" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
