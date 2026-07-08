import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { lazy, Suspense } from "react";
import CommandPalette from "./components/CommandPalette";
import { SidebarProvider } from "./context/SidebarContext";
import { useIncident } from "./context/IncidentContext";
import IncidentDetailModal from "./components/IncidentDetailModal";
import { AssigneeProvider } from "./context/AssigneeContext";
import PageSkeleton from "./components/PageSkeleton";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Incidents = lazy(() => import("./pages/Incidents"));
const Logs = lazy(() => import("./pages/Logs"));
const Insights = lazy(() => import("./pages/Insights"));
const Team = lazy(() => import("./pages/Team"));

function AppShell() {
  const { selectedIncident, setSelectedIncident } = useIncident();

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <CommandPalette />
      <Sidebar />

      <div className="flex-1 overflow-y-auto p-4">
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/team" element={<Team />} />
          </Routes>
        </Suspense>
      </div>

      {/* GLOBAL incident detail modal — works from any page */}
      <IncidentDetailModal
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
      />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="*"
        element={
          <ProtectedRoute>
            <SidebarProvider>
              <AssigneeProvider>
                <AppShell />
              </AssigneeProvider>
            </SidebarProvider>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;