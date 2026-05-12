import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { FeatureGate } from "./components/FeatureGate";
import { AboutPage } from "./pages/AboutPage";
import { BigramsPage } from "./pages/BigramsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LandingPage } from "./pages/LandingPage";
import { LessonDetailPage } from "./pages/LessonDetailPage";
import { LessonsPage } from "./pages/LessonsPage";
import { ContactPage, DeleteAccountPage, PrivacyPage, RefundPage, TermsPage } from "./pages/LegalPage";
import { LoginPage } from "./pages/LoginPage";
import { BillingPage } from "./pages/BillingPage";
import { PricingPage } from "./pages/PricingPage";
import { SettingsPage } from "./pages/SettingsPage";
import { StatsPage } from "./pages/StatsPage";
import { TypingTestPage } from "./pages/TypingTestPage";
import { WeakKeysPage } from "./pages/WeakKeysPage";

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/test" element={<TypingTestPage />} />
        <Route path="/lessons" element={<LessonsPage />} />
        <Route path="/lessons/:slug" element={<LessonDetailPage />} />
        <Route path="/weak-keys" element={<FeatureGate feature="weak_keys_analysis"><WeakKeysPage /></FeatureGate>} />
        <Route path="/bigrams" element={<FeatureGate feature="bigram_advanced"><BigramsPage /></FeatureGate>} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/billing" element={<BillingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/refund" element={<RefundPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/delete-account" element={<DeleteAccountPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
