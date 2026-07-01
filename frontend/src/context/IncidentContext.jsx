import {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

const IncidentContext = createContext();

const STORAGE_KEY = "incidentHistory";
const MAX_HISTORY = 100;

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

function saveToStorage(incidents) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
  } catch (e) {
    console.error("Failed to persist incidents to localStorage", e);
  }
}

export function IncidentProvider({ children }) {
  const [incidents, setIncidents] = useState(() => loadFromStorage());
  const [selectedIncident, setSelectedIncident] = useState(null);

  const addIncident = useCallback((incident) => {
    setIncidents((prev) => {
      const updated = [incident, ...prev].slice(0, MAX_HISTORY);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const updateIncidentStatus = useCallback((id, status) => {
    setIncidents((prev) => {
      const updated = prev.map((inc) =>
        inc.id === id ? { ...inc, status } : inc
      );
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const clearIncidents = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setIncidents([]);
  }, []);

  return (
    <IncidentContext.Provider
      value={{
        incidents,
        selectedIncident,
        setSelectedIncident,
        addIncident,
        updateIncidentStatus,
        clearIncidents,
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
}

export function useIncident() {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error("useIncident must be used inside IncidentProvider");
  }
  return context;
}
