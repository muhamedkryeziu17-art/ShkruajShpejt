import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { FeatureGate } from "./components/FeatureGate";

const AboutPage = lazy(() => import("./pages/AboutPage").then((module) => ({ default: module.AboutPage })));
const BigramsPage = lazy(() => import("./pages/BigramsPage").then((module) => ({ default: module.BigramsPage })));
const DashboardPage = lazy(() => import("./pages/DashboardPage").then((module) => ({ default: module.DashboardPage })));
const LandingPage = lazy(() => import("./pages/LandingPage").then((module) => ({ default: module.LandingPage })));
const LessonDetailPage = lazy(() => import("./pages/LessonDetailPage").then((module) => ({ default: module.LessonDetailPage })));
const LessonsPage = lazy(() => import("./pages/LessonsPage").then((module) => ({ default: module.LessonsPage })));
const LoginPage = lazy(() => import("./pages/LoginPage").then((module) => ({ default: module.LoginPage })));
const BillingPage = lazy(() => import("./pages/BillingPage").then((module) => ({ default: module.BillingPage })));
const PricingPage = lazy(() => import("./pages/PricingPage").then((module) => ({ default: module.PricingPage })));
const SettingsPage = lazy(() => import("./pages/SettingsPage").then((module) => ({ default: module.SettingsPage })));
const StatsPage = lazy(() => import("./pages/StatsPage").then((module) => ({ default: module.StatsPage })));
const TypingTestPage = lazy(() => import("./pages/TypingTestPage").then((module) => ({ default: module.TypingTestPage })));
const WeakKeysPage = lazy(() => import("./pages/WeakKeysPage").then((module) => ({ default: module.WeakKeysPage })));
const ContactPage = lazy(() => import("./pages/LegalPage").then((module) => ({ default: module.ContactPage })));
const DeleteAccountPage = lazy(() => import("./pages/LegalPage").then((module) => ({ default: module.DeleteAccountPage })));
const PrivacyPage = lazy(() => import("./pages/LegalPage").then((module) => ({ default: module.PrivacyPage })));
const RefundPage = lazy(() => import("./pages/LegalPage").then((module) => ({ default: module.RefundPage })));
const TermsPage = lazy(() => import("./pages/LegalPage").then((module) => ({ default: module.TermsPage })));

export function App() {
  return (
    <Suspense fallback={<RouteLoading />}>
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
    </Suspense>
  );
}

function RouteLoading() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-navy dark:text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
        <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-5 py-4 text-sm font-bold shadow-soft dark:border-white/10 dark:bg-white/10">
          Po ngarkohet...
        </div>
      </div>
    </div>
  );
}
