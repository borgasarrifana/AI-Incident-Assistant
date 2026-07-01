import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { lazy, Suspense,} from "react";
import CommandPalette from "./components/CommandPalette";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Incidents = lazy(() => import("./pages/Incidents"));
const Logs = lazy(() => import("./pages/Logs"));
const Insights = lazy(() => import("./pages/Insights"));

function App() {

  return (

    <Routes>

      {/* LOGIN */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* PROTECTED APP */}
      <Route
        path="*"
        element={

          <ProtectedRoute>

            <div className="
              flex min-h-screen
              bg-white dark:bg-slate-950 text-white
            ">
              <CommandPalette />
              <Sidebar />

              <div className="
                flex-1 overflow-y-auto
                p-6
              ">

                <div>

                  <Suspense
                    fallback={

                      <div className="
                        text-white p-10
                      ">
                        Loading...
                      </div>
                    }
                  >

                    <Routes>

                      <Route
                        path="/"
                        element={<Dashboard />}
                      />

                      <Route
                        path="/incidents"
                        element={<Incidents />}
                      />

                      <Route
                        path="/logs"
                        element={<Logs />}
                      />

                      <Route
                        path="/insights"
                        element={<Insights />}
                      />

                    </Routes>

                  </Suspense>  

                </div>

              </div>

            </div>

          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;