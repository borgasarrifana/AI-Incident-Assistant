import { createContext, useContext, useState, useEffect } from "react";

const AssigneeContext = createContext();

const DEFAULT_ASSIGNEES = [
  { id: "a1", name: "John Smith" },
  { id: "a2", name: "Sarah Connor" },
  { id: "a3", name: "Mike Johnson" },
];

export function AssigneeProvider({ children }) {
  const [assignees, setAssignees] = useState(() => {
    const saved = localStorage.getItem("assignees");
    return saved ? JSON.parse(saved) : DEFAULT_ASSIGNEES;
  });

  useEffect(() => {
    localStorage.setItem("assignees", JSON.stringify(assignees));
  }, [assignees]);

  const addAssignee = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setAssignees((prev) => [
      ...prev,
      { id: `a${Date.now()}`, name: trimmed },
    ]);
  };

  const updateAssignee = (id, name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setAssignees((prev) =>
      prev.map((a) => (a.id === id ? { ...a, name: trimmed } : a))
    );
  };

  const removeAssignee = (id) => {
    setAssignees((prev) => prev.filter((a) => a.id !== id));
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