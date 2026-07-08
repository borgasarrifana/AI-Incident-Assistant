import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { useWorkspace } from "../context/WorkspaceContext";
import { useAuth } from "../context/AuthContext";

export default function WorkspaceSwitcher({ collapsed }) {

  const { workspaces, activeWorkspace, setActiveWorkspace, createWorkspace } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState("");
  const { user } = useAuth();

  const handleCreate = () => {
    if (!newWorkspace) return;
    createWorkspace(newWorkspace);
    setNewWorkspace("");
    setOpen(false);
  };

  return (
    <div className="relative mb-4">

      <button
        onClick={() => setOpen(!open)}
        className={`
          w-full flex items-center
          ${collapsed ? "justify-center" : "justify-between"}
          bg-slate-100 dark:bg-slate-800
          hover:bg-slate-200 dark:hover:bg-slate-700
          p-3 rounded-xl
          text-slate-900 dark:text-white
          overflow-hidden
        `}
      >
        {!collapsed ? (
          <div className="min-w-0">
            <p className="text-xs text-slate-500 dark:text-slate-400">Workspace</p>
            <p className="font-medium truncate">{activeWorkspace ? activeWorkspace.name : "No workspace"}</p>
          </div>
        ) : (
          <div className="w-3 h-3 rounded-full bg-blue-500" />
        )}

        {!collapsed && <ChevronDown size={18} />}
      </button>

      {open && (
        <div
          className={`
            absolute
            ${collapsed ? "left-full top-0 ml-2 w-[260px]" : "left-0 top-full mt-2 w-full"}
            bg-white dark:bg-slate-900
            border border-slate-200 dark:border-slate-800
            rounded-2xl shadow-2xl
            z-50
            overflow-hidden
          `}
        >
          <div className="p-2">
            {workspaces.map((workspace) => (
              <button
                key={workspace.id}
                onClick={() => {
                  setActiveWorkspace(workspace);
                  setOpen(false);
                }}
                className={`
                  w-full text-left p-3 rounded-xl transition
                  ${
                    activeWorkspace?.id === workspace.id
                      ? "bg-blue-600 text-white"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }
                `}
              >
                {workspace.name}
              </button>
            ))}
          </div>
          {user?.role === "admin" && (
          <div className="border-t border-slate-200 dark:border-slate-800 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New workspace"
                value={newWorkspace}
                onChange={(e) => setNewWorkspace(e.target.value)}
                className="flex-1 p-2 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
              />
              <button
                onClick={handleCreate}
                className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
          )}
        </div>
      )}
    </div>
  );
}