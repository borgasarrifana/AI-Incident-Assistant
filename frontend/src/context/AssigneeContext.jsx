import { createContext, useContext, useState, useEffect } from "react";
import {
  fetchAssignees,
  createAssigneeAPI,
  updateAssigneeAPI,
  deleteAssigneeAPI,
} from "../api";

const AssigneeContext = createContext();

export function AssigneeProvider({ children }) {
  const [assignees, setAssignees] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchAssignees();
        if (!cancelled) setAssignees(res.data);
      } catch (e) {
        console.error("Failed to load assignees", e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const addAssignee = async (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      const res = await createAssigneeAPI(trimmed);
      setAssignees((prev) => [...prev, res.data]);
    } catch (e) {
      console.error("Failed to add assignee", e);
    }
  };

  const updateAssignee = async (id, name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      const res = await updateAssigneeAPI(id, trimmed);
      setAssignees((prev) => prev.map((a) => (a.id === id ? res.data : a)));
    } catch (e) {
      console.error("Failed to update assignee", e);
    }
  };

  const removeAssignee = async (id) => {
    try {
      await deleteAssigneeAPI(id);
      setAssignees((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.error("Failed to remove assignee", e);
    }
  };

  return (
    <AssigneeContext.Provider
      value={{ assignees, addAssignee, updateAssignee, removeAssignee }}
    >
      {children}
    </AssigneeContext.Provider>
  );
}

export function useAssignees() {
  return useContext(AssigneeContext);
}