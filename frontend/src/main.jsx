import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "leaflet/dist/leaflet.css";
import "./utils/fixLeafletIcons";
import { IncidentProvider } from "./context/IncidentContext";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { WorkspaceProvider } from "./context/WorkspaceContext";
import { AuditProvider } from "./context/AuditContext";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

<AuthProvider>
  <NotificationProvider>
    <WorkspaceProvider>
      <AuditProvider>
        <BrowserRouter>
          <IncidentProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </IncidentProvider>
        </BrowserRouter>
      </AuditProvider>
    </WorkspaceProvider>
  </NotificationProvider>
</AuthProvider>
);