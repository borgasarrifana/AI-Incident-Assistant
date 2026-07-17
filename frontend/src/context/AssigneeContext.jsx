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
    const current = assignees.find((a) => a.id === id);
    try {
      // PUT replaces the record — re-send the existing avatar_url
      // so renaming a member doesn't wipe their photo.
      const res = await updateAssigneeAPI(id, {
        name: trimmed,
        avatar_url: current?.avatar_url ?? null,
      });
      setAssignees((prev) => prev.map((a) => (a.id === id ? res.data : a)));
    } catch (e) {
      console.error("Failed to update assignee", e);
    }
  };

  // Persists a new avatar URL (image itself is already in Supabase Storage).
  // Throws on failure so the caller can show an error state.
  const updateAvatar = async (id, avatarUrl) => {
    const current = assignees.find((a) => a.id === id);
    if (!current) return;
    const res = await updateAssigneeAPI(id, {
      name: current.name,
      avatar_url: avatarUrl,
    });
    setAssignees((prev) => prev.map((a) => (a.id === id ? res.data : a)));
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
      value={{ assignees, addAssignee, updateAssignee, updateAvatar, removeAssignee }}
    >
      {children}
    </AssigneeContext.Provider>
  );
}

export function useAssignees() {
  return useContext(AssigneeContext);
}
