import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { lazy, Suspense } from "react";
import CommandPalette from "./components/CommandPalette";
import { SidebarProvider } from "./context/SidebarContext";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Incidents = lazy(() => import("./pages/Incidents"));
const Logs = lazy(() => import("./pages/Logs"));
const Insights = lazy(() => import("./pages/Insights"));

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="*"
        element={
          <ProtectedRoute>
            <SidebarProvider>
              <div className="flex min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
                <CommandPalette />
                <Sidebar />

                <div className="flex-1 overflow-y-auto p-6">
                  <Suspense
                    fallback={
                      <div className="text-slate-900 dark:text-white p-10">
                        Loading...
                      </div>
                    }
                  >
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/incidents" element={<Incidents />} />
                      <Route path="/logs" element={<Logs />} />
                      <Route path="/insights" element={<Insights />} />
                    </Routes>
                  </Suspense>
                </div>
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;