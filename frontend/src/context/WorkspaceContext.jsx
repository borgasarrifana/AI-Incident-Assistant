import { createContext, useContext, useState, useEffect } from "react";
import { fetchWorkspaces, createWorkspaceAPI } from "../api";

const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchWorkspaces();
        if (!cancelled) {
          setWorkspaces(res.data);
          if (res.data.length > 0) setActiveWorkspace(res.data[0]);
        }
      } catch (e) {
        console.error("Failed to load workspaces", e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const createWorkspace = async (name) => {
    try {
      const res = await createWorkspaceAPI(name);
      setWorkspaces((prev) => [...prev, res.data]);
      setActiveWorkspace(res.data);
    } catch (e) {
      console.error("Failed to create workspace", e);
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        activeWorkspace,
        setActiveWorkspace,
        createWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  return useContext(WorkspaceContext);
}