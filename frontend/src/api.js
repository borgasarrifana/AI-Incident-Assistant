import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-incident-assistant.onrender.com",
});

export const analyzeIncident = (text) =>
  API.post("/incident/analyze", { text });

export const analyzeLogs = (text) =>
  API.post("/logs/analyze", { text });
