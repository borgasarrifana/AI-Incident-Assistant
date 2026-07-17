import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

// Small circular avatar with initials fallback.
// Exported so Team.jsx (and later the incident detail page) can reuse it.
export function Avatar({ name, avatarUrl, size = 24 }) {
  const [imgFailed, setImgFailed] = useState(false);

  // Reset the failure flag if the URL changes (e.g. photo replaced)
  useEffect(() => {
    setImgFailed(false);
  }, [avatarUrl]);

  const initials = (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  if (avatarUrl && !imgFailed) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        onError={() => setImgFailed(true)}
        style={{ width: size, height: size }}
        className="rounded-full object-cover flex-shrink-0 border border-slate-200 dark:border-slate-700"
      />
    );
  }

  return (
    <span
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      className="rounded-full flex-shrink-0 flex items-center justify-center font-semibold
        bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400
        border border-blue-200 dark:border-blue-800"
    >
      {initials}
    </span>
  );
}

/**
 * Custom dropdown for selecting an assignee, with avatar photos.
 * Native <select> can't render images, hence this component.
 *
 * Props:
 * - value: currently selected assignee name (string, "Unassigned" for none)
 * - onChange: (name: string) => void
 * - assignees: [{ id, name, avatar_url? }] — shape returned by the FastAPI backend
 */
export default function AssigneeDropdown({ value, onChange, assignees }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = assignees.find((a) => a.name === value) || null;

  const select = (name) => {
    onChange(name);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* TRIGGER — styled to match the app's shared input class */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full p-3 rounded-xl border flex items-center gap-2
          bg-white dark:bg-slate-950
          border-slate-300 dark:border-slate-700
          text-slate-900 dark:text-white
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition text-left"
      >
        <Avatar
          name={selected ? selected.name : "?"}
          avatarUrl={selected ? selected.avatar_url : null}
          size={22}
        />
        <span className="flex-1 truncate text-sm">{value}</span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* MENU */}
      {open && (
        <ul
          className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto
            bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700
            rounded-xl shadow-2xl"
        >
          <li
            onClick={() => select("Unassigned")}
            className="flex items-center gap-2 px-3 py-2.5 text-sm cursor-pointer
              text-slate-700 dark:text-slate-300
              hover:bg-slate-100 dark:hover:bg-slate-800
              border-b border-slate-100 dark:border-slate-800"
          >
            <Avatar name="?" avatarUrl={null} size={22} />
            <span className="flex-1 truncate">Unassigned</span>
            {value === "Unassigned" && (
              <Check size={15} className="text-blue-500 flex-shrink-0" />
            )}
          </li>

          {assignees.map((a) => (
            <li
              key={a.id}
              onClick={() => select(a.name)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm cursor-pointer
                text-slate-700 dark:text-slate-300
                hover:bg-slate-100 dark:hover:bg-slate-800
                border-b border-slate-100 dark:border-slate-800 last:border-0"
            >
              <Avatar name={a.name} avatarUrl={a.avatar_url} size={22} />
              <span className="flex-1 truncate">{a.name}</span>
              {value === a.name && (
                <Check size={15} className="text-blue-500 flex-shrink-0" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
