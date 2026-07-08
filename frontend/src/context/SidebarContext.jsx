import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <SidebarContext.Provider
      value={{
        collapsed, setCollapsed,
        rightPanelCollapsed, setRightPanelCollapsed,
        mobileNavOpen, setMobileNavOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}