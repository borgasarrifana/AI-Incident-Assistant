import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

export const analyzeIncident = (text) =>
  API.post("/incident/analyze", { text });

export const analyzeLogs = (text) =>
  API.post("/logs/analyze", { text });