import {
  createContext,
  useContext,
  useState,
} from "react";

const MetricsContext =
  createContext();

export function MetricsProvider({
  children,
}) {

  const [metrics, setMetrics] =
    useState({
      incidents: 12,
      logs: 45,
      critical: 3,
      uptime: 99.9,
    });

  const incrementIncidents = () => {

    setMetrics((prev) => ({
      ...prev,
      incidents: prev.incidents + 1,
    }));
  };

  const incrementLogs = () => {

    setMetrics((prev) => ({
      ...prev,
      logs: prev.logs + 1,
    }));
  };

  return (

    <MetricsContext.Provider
      value={{
        metrics,
        incrementIncidents,
        incrementLogs,
      }}
    >

      {children}

    </MetricsContext.Provider>
  );
}

export function useMetrics() {
  return useContext(MetricsContext);
}