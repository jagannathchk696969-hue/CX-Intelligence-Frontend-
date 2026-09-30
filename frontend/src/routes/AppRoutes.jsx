import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Pages
import { DashboardOverviewPage } from '../pages/DashboardOverviewPage';
import { AssistantStudioPage } from '../pages/AssistantStudioPage';
import { ConversationsPage } from '../pages/ConversationsPage';
import { CustomersPage } from '../pages/CustomersPage';
import { TicketsPage } from '../pages/TicketsPage';
import { RecommendationsPage } from '../pages/RecommendationsPage';
import { KnowledgeBasePage } from '../pages/KnowledgeBasePage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { CustomerPortalPage } from '../pages/CustomerPortalPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/customer-chat" element={<CustomerPortalPage />} />

      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Protected Dashboard Views */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverviewPage />} />
          <Route path="assistant" element={<AssistantStudioPage />} />
          <Route path="conversations" element={<ConversationsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="recommendations" element={<RecommendationsPage />} />
          <Route path="knowledge" element={<KnowledgeBasePage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
