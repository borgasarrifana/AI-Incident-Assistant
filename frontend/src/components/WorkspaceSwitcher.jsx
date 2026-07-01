import { useState } from "react";
import { ChevronDown, Plus,} from "lucide-react";
import { useWorkspace,} from "../context/WorkspaceContext";

export default function WorkspaceSwitcher({
  collapsed,
}) {

  const {
    workspaces,
    activeWorkspace,
    setActiveWorkspace,
    createWorkspace,
  } = useWorkspace();

  const [open, setOpen] =
    useState(false);

  const [newWorkspace,
    setNewWorkspace] =
    useState("");

  const handleCreate = () => {

    if (!newWorkspace) return;

    createWorkspace(newWorkspace);

    setNewWorkspace("");

    setOpen(false);
  };

  return (

    <div className="relative mb-6">

      {/* ACTIVE */}
      <button
        onClick={() =>
          setOpen(!open)
        }
        className={`
          w-full flex items-center
          ${
            collapsed
              ? "justify-center"
              : "justify-between"
          }
          bg-slate-800
          hover:bg-slate-700
          p-3 rounded-xl
          text-white
          overflow-hidden
        `}
      >

        {!collapsed ? (

          <div className="min-w-0">

            <p className="
              text-xs text-slate-400
            ">
              Workspace
            </p>

            <p className="
              font-medium truncate
            ">
              {activeWorkspace.name}
            </p>

          </div>

        ) : (

          <div className="
            w-3 h-3 rounded-full
            bg-blue-500
          " />

        )}

        {!collapsed && (
          <ChevronDown size={18} />
        )}

      </button>

      {/* DROPDOWN */}
      {open && (

        <div className="
          absolute mt-2 w-full
          bg-white dark:bg-slate-900
          border border-slate-800
          rounded-2xl shadow-2xl
          z-50
          overflow-hidden
        ">

          {/* WORKSPACES */}
          <div className="p-2">

            {workspaces.map((workspace) => (

              <button
                key={workspace.id}
                onClick={() => {

                  setActiveWorkspace(
                    workspace
                  );

                  setOpen(false);
                }}
                className={`
                  w-full text-left
                  p-3 rounded-xl
                  transition
                  ${
                    activeWorkspace.id ===
                    workspace.id
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }
                `}
              >
                {workspace.name}
              </button>

            ))}

          </div>

          {/* CREATE */}
          <div className="
            border-t border-slate-800
            p-3
          ">

            <div className="
              flex gap-2
            ">

              <input
                type="text"
                placeholder="New workspace"
                value={newWorkspace}
                onChange={(e) =>
                  setNewWorkspace(
                    e.target.value
                  )
                }
                className="
                  flex-1 p-2 rounded-lg
                  bg-slate-950
                  border border-slate-700
                  text-white text-sm
                "
              />

              <button
                onClick={handleCreate}
                className="
                  p-2 rounded-lg
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                "
              >

                <Plus size={18} />

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}