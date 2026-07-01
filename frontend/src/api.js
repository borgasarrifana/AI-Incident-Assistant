import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  timeout: 30000, // 30s — AI calls can be slow
});

export const analyzeIncident = (text) =>
  API.post("/incident/analyze", { text });

export const analyzeLogs = (text) =>
  API.post("/logs/analyze", { text });

export default API;
