import {
  createContext,
  useContext,
  useState,
} from "react";

const AuditContext =
  createContext();

export function AuditProvider({
  children,
}) {

  const [auditLogs, setAuditLogs] =
    useState([]);

  const addAuditLog = (
    action,
    user
  ) => {

    const log = {
      id: Date.now(),
      action,
      user,
      timestamp:
        new Date().toLocaleString(),
    };

    setAuditLogs((prev) => [
      log,
      ...prev,
    ]);
  };

  return (

    <AuditContext.Provider
      value={{
        auditLogs,
        addAuditLog,
      }}
    >

      {children}

    </AuditContext.Provider>
  );
}

export function useAudit() {
  return useContext(AuditContext);
}