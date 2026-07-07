import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Search,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { useIncident } from "../context/IncidentContext";
import { motion, AnimatePresence } from "framer-motion";

const SEVERITY_STYLES = {
  Critical: "bg-red-500/20 text-red-400 border-red-500/30",
  High: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const STATUS_ICON = {
  Open: <AlertTriangle size={14} className="text-yellow-400" />,
  Resolved: <CheckCircle2 size={14} className="text-green-400" />,
  Critical: <ShieldAlert size={14} className="text-red-400" />,
};

export default function RecentIncidentsPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const {
    incidents,
    selectedIncident,
    setSelectedIncident,
    updateIncidentStatus,
    clearIncidents,
  } = useIncident();

  const openCount = incidents.filter((i) => i.status === "Open").length;

  const filteredIncidents = incidents.filter((item) => {
    const matchesSearch = (item.incident || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesSeverity =
      severityFilter === "All" || item.result?.severity === severityFilter;
    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  // COLLAPSED STATE — shows counter badge
  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="relative flex flex-col items-center gap-3 px-2 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition flex-shrink-0"
      >
        {/* OPEN INCIDENTS BADGE */}
        {openCount > 0 && (
          <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full bg-yellow-500 text-black text-xs font-bold">
            {openCount}
          </span>
        )}

        <ChevronLeft size={16} />

        <span className="text-xs [writing-mode:vertical-rl] tracking-wide">
          Recent Incidents
        </span>

        {/* TOTAL COUNT */}
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
          {incidents.length}
        </span>
      </button>
    );
  }

  return (
    // h-full fills the flex parent's height; flex-col lets header/filters stay fixed
    // while the list scrolls
    <div className="w-80 flex-shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col h-full overflow-hidden">

      {/* HEADER — fixed, never scrolls */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Recent Incidents</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {filteredIncidents.length} of {incidents.length}
            {openCount > 0 && (
              <span className="ml-2 text-yellow-500 dark:text-yellow-400 font-medium">
                · {openCount} open
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSearch((s) => !s)}
            className={`p-1.5 rounded-lg transition ${
              showSearch
                ? "bg-blue-600 text-white"
                : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
            title="Search"
          >
            <Search size={14} />
          </button>

          {incidents.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Clear all incident history?")) {
                  clearIncidents();
                  setSelectedIncident(null);
                }
              }}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition"
              title="Clear all"
            >
              <Trash2 size={14} />
            </button>
          )}

          <button
            onClick={() => setCollapsed(true)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            title="Collapse"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* SEARCH — fixed, animates open/closed */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-slate-200 dark:border-slate-800 overflow-hidden flex-shrink-0"
          >
            <div className="px-4 py-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search incidents..."
                autoFocus
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEVERITY FILTER — fixed */}
      <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex gap-1.5 flex-wrap flex-shrink-0">
        {["All", "Critical", "High", "Medium", "Low"].map((s) => (
          <button
            key={s}
            onClick={() => setSeverityFilter(s)}
            className={`text-xs px-2 py-1 rounded-full border transition ${
              severityFilter === s
                ? "bg-blue-600 border-blue-500 text-white"
                : "border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-600"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* STATUS FILTER — fixed */}
      <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex gap-1.5 flex-shrink-0">
        {["All", "Open", "Resolved"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-xs px-2 py-1 rounded-full border transition ${
              statusFilter === s
                ? "bg-slate-600 border-slate-500 text-white"
                : "border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-600"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* INCIDENT LIST — this is the only part that scrolls */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-800 min-h-0">
        {filteredIncidents.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <div className="text-2xl">🔍</div>
            <p className="text-sm text-slate-500">
              {incidents.length === 0
                ? "No incidents yet. Analyze your first incident above."
                : "No incidents match your filters."}
            </p>
          </div>
        ) : (
          filteredIncidents.map((item) => (
            <div
              key={item.id}
              onClick={() =>
                setSelectedIncident(
                  selectedIncident?.id === item.id ? null : item
                )
              }
              className={`p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors space-y-2 ${
                selectedIncident?.id === item.id
                  ? "bg-slate-100 dark:bg-slate-800 border-l-2 border-l-blue-500"
                  : ""
              }`}
            >
              {/* SEVERITY + STATUS */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                    SEVERITY_STYLES[item.result?.severity] ?? SEVERITY_STYLES.Low
                  }`}
                >
                  {item.result?.severity ?? "Low"}
                </span>

                <div className="flex items-center gap-1">
                  {STATUS_ICON[item.status] ?? STATUS_ICON.Open}
                  <span className="text-xs text-slate-500 dark:text-slate-400">{item.status}</span>
                </div>
              </div>

              {/* DESCRIPTION */}
              <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                {item.incident}
              </p>

              {/* META */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                {item.locationName && item.locationName !== "Unknown" && (
                  <span className="flex items-center gap-1">
                    <MapPin size={11} />
                    {item.locationName}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>

              {/* RESOLVE BUTTON */}
              {item.status === "Open" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateIncidentStatus(item.id, "Resolved");
                  }}
                  className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition font-medium"
                >
                  ✓ Mark as Resolved
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}