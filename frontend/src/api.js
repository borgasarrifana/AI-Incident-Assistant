import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  timeout: 60000,
});

// --- AI analysis ---
export const analyzeIncident = (text) => API.post("/incident/analyze", { text });
export const analyzeLogs = (text) => API.post("/logs/analyze", { text });

// --- Incidents CRUD ---
export const fetchIncidents = () => API.get("/incidents/");
export const fetchIncidentAPI = (id) => API.get(`/incidents/${id}`);
export const fetchIncidentEventsAPI = (id) => API.get(`/incidents/${id}/events`);
export const createIncidentAPI = (incident) => API.post("/incidents/", incident);
// actor: who made the change — until real auth (phase 2), this is the mock-auth email
export const updateIncidentStatusAPI = (id, status, actor) =>
  API.patch(`/incidents/${id}/status`, { status, actor });
export const clearIncidentsAPI = () => API.delete("/incidents/");

// --- Assignees CRUD ---
export const fetchAssignees = () => API.get("/assignees/");
export const createAssigneeAPI = (name) => API.post("/assignees/", { name });
// payload: { name, avatar_url } — PUT replaces the record, so always send both
export const updateAssigneeAPI = (id, payload) => API.put(`/assignees/${id}`, payload);
export const deleteAssigneeAPI = (id) => API.delete(`/assignees/${id}`);

// --- Workspaces CRUD ---
export const fetchWorkspaces = () => API.get("/workspaces/");
export const createWorkspaceAPI = (name) => API.post("/workspaces/", { name });
export const deleteWorkspaceAPI = (id) => API.delete(`/workspaces/${id}`);

export default API;
