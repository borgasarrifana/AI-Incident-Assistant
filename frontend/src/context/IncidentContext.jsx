import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  fetchIncidents,
  createIncidentAPI,
  updateIncidentStatusAPI,
  clearIncidentsAPI,
} from "../api";

const IncidentContext = createContext();

export function IncidentProvider({ children }) {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);

  // Always derived from the incidents array, so it's never stale
  const selectedIncident =
    incidents.find((inc) => inc.id === selectedIncidentId) ?? null;

  // Keeps the same signature: accepts an incident object (or null)
  const setSelectedIncident = useCallback((incident) => {
    setSelectedIncidentId(incident?.id ?? null);
  }, []);

  // Load incidents from the backend on first mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchIncidents();
        if (!cancelled) setIncidents(res.data);
      } catch (e) {
        console.error("Failed to load incidents", e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const addIncident = useCallback(async (incident) => {
    try {
      const res = await createIncidentAPI(incident);
      setIncidents((prev) => [res.data, ...prev]);
      return res.data; // return the saved incident so callers can access its real id
    } catch (e) {
      console.error("Failed to save incident", e);
      return null;
    }
  }, []);

  const updateIncidentStatus = useCallback(async (id, status) => {
    try {
      const res = await updateIncidentStatusAPI(id, status);
      setIncidents((prev) =>
        prev.map((inc) => (inc.id === id ? res.data : inc))
      );
    } catch (e) {
      console.error("Failed to update incident status", e);
    }
  }, []);

  const clearIncidents = useCallback(async () => {
    try {
      await clearIncidentsAPI();
      setIncidents([]);
    } catch (e) {
      console.error("Failed to clear incidents", e);
    }
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