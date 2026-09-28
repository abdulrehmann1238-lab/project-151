import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/marketing/LandingPage';
import { SituationsPage } from './pages/marketing/SituationsPage';
import { AppShell } from './components/layout/AppShell';
import { AppHomePage } from './pages/app/AppHomePage';
import { IntakePage } from './pages/app/IntakePage';
import { UnderstandingPage } from './pages/app/UnderstandingPage';
import { QuestionsPage } from './pages/app/QuestionsPage';
import { PlanPage } from './pages/app/PlanPage';
import { CaseResourcesPage } from './pages/app/CaseResourcesPage';
import { MyCasesPage } from './pages/app/MyCasesPage';
import { ResourceFinderPage } from './pages/app/ResourceFinderPage';
import { AccountPage } from './pages/app/AccountPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Marketing Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/situations" element={<SituationsPage />} />

        {/* App Workspace Routes (wrapped in AppShell) */}
        <Route path="/app" element={<AppShell />}>
          <Route index element={<AppHomePage />} />
          <Route path="new" element={<IntakePage />} />
          <Route path="case/:id/understanding" element={<UnderstandingPage />} />
          <Route path="case/:id/questions" element={<QuestionsPage />} />
          <Route path="case/:id/plan" element={<PlanPage />} />
          <Route path="case/:id/resources" element={<CaseResourcesPage />} />
          <Route path="cases" element={<MyCasesPage />} />
          <Route path="resources" element={<ResourceFinderPage />} />
          <Route path="account" element={<AccountPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
