import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useAssignees } from "../context/AssigneeContext";
import { Plus, Pencil, Trash2, Check, X, ShieldAlert, Users } from "lucide-react";

export default function Team() {
  const { user } = useAuth();
  const { assignees, addAssignee, updateAssignee, removeAssignee } = useAssignees();

  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  // Guard against direct URL access by non-admins (nav item is already hidden for them)
  if (user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
        <ShieldAlert size={40} className="text-slate-400" />
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Admin access required
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
          Only Admin accounts can manage team assignees.
        </p>
      </div>
    );
  }

  const handleAdd = () => {
    if (!newName.trim()) return;
    addAssignee(newName);
    setNewName("");
  };

  const startEdit = (assignee) => {
    setEditingId(assignee.id);
    setEditingName(assignee.name);
  };

  const saveEdit = () => {
    if (editingId) updateAssignee(editingId, editingName);
    setEditingId(null);
    setEditingName("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  return (
    <div className="space-y-6 pr-4 max-w-2xl">

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users size={24} /> Team
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage who incidents can be assigned to
        </p>
      </div>

      {/* ADD NEW */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl">
        <label className="block mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">
          Add team member
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Full name"
            className="flex-1 p-3 rounded-xl border bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            onClick={handleAdd}
            disabled={!newName.trim()}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium transition"
          >
            <Plus size={18} /> Add
          </button>
        </div>
      </div>

      {/* LIST */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {assignees.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
            No team members yet — add one above.
          </div>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {assignees.map((assignee) => (
              <li key={assignee.id} className="flex items-center gap-3 p-4">
                {editingId === assignee.id ? (
                  <>
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                      autoFocus
                      className="flex-1 p-2 rounded-lg border bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <button
                      onClick={saveEdit}
                      className="p-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <X size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm text-slate-900 dark:text-white">
                      {assignee.name}
                    </span>
                    <button
                      onClick={() => startEdit(assignee)}
                      className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => removeAssignee(assignee.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}