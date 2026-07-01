import {
  createContext,
  useContext,
  useState,
} from "react";

const WorkspaceContext =
  createContext();

export function WorkspaceProvider({
  children,
}) {

  const [workspaces, setWorkspaces] =
    useState([
      {
        id: 1,
        name: "Production",
      },
      {
        id: 2,
        name: "Staging",
      },
      {
        id: 3,
        name: "Development",
      },
    ]);

  const [activeWorkspace,
    setActiveWorkspace] =
    useState(workspaces[0]);

  const createWorkspace = (name) => {

    const newWorkspace = {
      id: Date.now(),
      name,
    };

    setWorkspaces((prev) => [
      ...prev,
      newWorkspace,
    ]);

    setActiveWorkspace(newWorkspace);
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