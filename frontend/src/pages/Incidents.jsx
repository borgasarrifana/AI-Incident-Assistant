import { useState } from "react";
import IncidentAnalyzer from "../components/IncidentAnalyzer";
import IncidentMap from "../components/IncidentMap";
import RecentIncidentsPanel from "../components/RecentIncidentsPanel";
import { useIncident } from "../context/IncidentContext";
import { AlertTriangle, CheckCircle2, ShieldAlert, Activity } from "lucide-react";

function StatPill({ icon, label, value, color }) {
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${color}`}>
      {icon}
      <div>
        <div className="text-lg font-bold text-slate-900 dark:text-white leading-none">{value}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</div>
      </div>
    </div>
  );
}

const TABS = [
  { key: "analyzer", label: "Analyzer" },
  { key: "map", label: "Map" },
  { key: "recent", label: "Recent" },
];

export default function Incidents() {
  const { incidents } = useIncident();
  const [activeTab, setActiveTab] = useState("analyzer");

  const total    = incidents.length;
  const open     = incidents.filter((i) => i.status === "Open").length;
  const critical = incidents.filter((i) => i.result?.severity === "Critical").length;
  const resolved = incidents.filter((i) => i.status === "Resolved").length;

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] gap-4 overflow-hidden -mr-6">

      {/* PAGE HEADER + QUICK STATS */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between flex-shrink-0 pr-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Incidents</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Analyze and track operational incidents in real time
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto md:overflow-visible md:flex-wrap pb-1 md:pb-0 -mx-1 px-1 md:mx-0 md:px-0">
          <StatPill icon={<Activity size={15} className="text-blue-500 flex-shrink-0" />}    label="Total"    value={total}    color="border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/5 flex-shrink-0" />
          <StatPill icon={<AlertTriangle size={15} className="text-yellow-500 flex-shrink-0" />} label="Open"  value={open}     color="border-yellow-200 dark:border-yellow-500/20 bg-yellow-50 dark:bg-yellow-500/5 flex-shrink-0" />
          <StatPill icon={<ShieldAlert size={15} className="text-red-500 flex-shrink-0" />}   label="Critical" value={critical} color="border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 flex-shrink-0" />
          <StatPill icon={<CheckCircle2 size={15} className="text-green-500 flex-shrink-0" />} label="Resolved" value={resolved} color="border-green-200 dark:border-green-500/20 bg-green-50 dark:bg-green-500/5 flex-shrink-0" />
        </div>

      {/* MOBILE TABS — hidden on desktop */}
      <div className="flex md:hidden gap-2 pr-6 flex-shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === tab.key
                ? "bg-blue-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* MOBILE: only the active tab's panel, full width */}
      <div className="flex md:hidden flex-1 min-h-0 pr-6">
        {activeTab === "analyzer" && (
          <div className="w-full overflow-y-auto">
            <IncidentAnalyzer />
          </div>
        )}
        {activeTab === "map" && (
          <div className="w-full h-full">
            <IncidentMap incidents={incidents} fullHeight />
          </div>
        )}
        {activeTab === "recent" && (
          <div className="w-full h-full">
            <RecentIncidentsPanel forceExpanded />
          </div>
        )}
      </div>

      {/* DESKTOP: original 3-column layout, hidden on mobile */}
      <div className="hidden md:flex gap-4 flex-1 min-h-0">
        <div className="w-[480px] flex-shrink-0 overflow-y-auto">
          <IncidentAnalyzer />
        </div>
        <div className="flex-1 min-w-0">
          <IncidentMap incidents={incidents} fullHeight />
        </div>
        <RecentIncidentsPanel />
      </div>
    </div>
  );
}