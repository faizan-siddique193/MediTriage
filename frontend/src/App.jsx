import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import TriageInput from "./pages/TriageInput";
import TriageResults from "./pages/TriageResults";
import Navbar from "./components/Navbar";
import ReportHistory from "./components/ReportHistory";
import ErrorBoundary from "./components/ErrorBoundary";

function AppShell() {
  const location = useLocation();
  const isLanding = location.pathname === "/" || location.pathname === "/home";

  const routes = (
    <ErrorBoundary key={location.pathname}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/triage" element={<TriageInput />} />
        <Route path="/triage/results" element={<TriageResults />} />
        <Route path="/reports" element={<ReportHistory />} />
        <Route path="/settings" element={<Navigate to="/reports" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );

  if (isLanding) return routes;

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-content">{routes}</main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
