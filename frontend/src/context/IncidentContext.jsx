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
import { useToast } from "./ToastContext";

const IncidentContext = createContext();

export function IncidentProvider({ children }) {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const { showToast } = useToast();

  const selectedIncident =
    incidents.find((inc) => inc.id === selectedIncidentId) ?? null;

  const setSelectedIncident = useCallback((incident) => {
    setSelectedIncidentId(incident?.id ?? null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchIncidents();
        if (!cancelled) setIncidents(res.data);
      } catch (e) {
        console.error("Failed to load incidents", e);
        if (!cancelled) showToast("Failed to load incidents from server.", "error");
      }
    })();
    return () => { cancelled = true; };
  }, [showToast]);

  const addIncident = useCallback(async (incident) => {
    try {
      const res = await createIncidentAPI(incident);
      setIncidents((prev) => [res.data, ...prev]);
      showToast("Incident saved.", "success");
      return res.data;
    } catch (e) {
      console.error("Failed to save incident", e);
      showToast("Failed to save incident. Please try again.", "error");
      return null;
    }
  }, [showToast]);

  const updateIncidentStatus = useCallback(async (id, status) => {
    // Snapshot for rollback
    let previous;
    setIncidents((prev) => {
      previous = prev;
      return prev.map((inc) =>
        inc.id === id ? { ...inc, status } : inc
      );
    });

    try {
      const res = await updateIncidentStatusAPI(id, status);
      // Reconcile with the server's version (in case backend adds fields)
      setIncidents((prev) =>
        prev.map((inc) => (inc.id === id ? res.data : inc))
      );
    } catch (e) {
      console.error("Failed to update incident status", e);
      setIncidents(previous); // rollback
      showToast("Couldn't update status — change reverted.", "error");
    }
  }, [showToast]);

  const clearIncidents = useCallback(async () => {
    const previous = incidents;
    setIncidents([]); // optimistic
    try {
      await clearIncidentsAPI();
      showToast("Incident history cleared.", "success");
    } catch (e) {
      console.error("Failed to clear incidents", e);
      setIncidents(previous); // rollback
      showToast("Couldn't clear incidents — restored.", "error");
    }
  }, [incidents, showToast]);

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