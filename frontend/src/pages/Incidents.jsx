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

export default function Incidents() {
  const { incidents } = useIncident();

  const total    = incidents.length;
  const open     = incidents.filter((i) => i.status === "Open").length;
  const critical = incidents.filter((i) => i.result?.severity === "Critical").length;
  const resolved = incidents.filter((i) => i.status === "Resolved").length;

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] gap-4 overflow-hidden -mr-4">

      {/* PAGE HEADER + QUICK STATS */}
      <div className="flex items-center justify-between flex-shrink-0 pr-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Incidents</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Analyze and track operational incidents in real time
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatPill icon={<Activity size={15} className="text-blue-500" />}    label="Total"    value={total}    color="border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/5" />
          <StatPill icon={<AlertTriangle size={15} className="text-yellow-500" />} label="Open"  value={open}     color="border-yellow-200 dark:border-yellow-500/20 bg-yellow-50 dark:bg-yellow-500/5" />
          <StatPill icon={<ShieldAlert size={15} className="text-red-500" />}   label="Critical" value={critical} color="border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5" />
          <StatPill icon={<CheckCircle2 size={15} className="text-green-500" />} label="Resolved" value={resolved} color="border-green-200 dark:border-green-500/20 bg-green-50 dark:bg-green-500/5" />
        </div>
      </div>

      {/* MAIN ROW — fills remaining height, nothing overflows */}
      <div className="flex gap-4 flex-1 min-h-0">

        {/* LEFT: Incident Analyzer — fixed width, scrollable */}
        <div className="w-[480px] flex-shrink-0 overflow-y-auto">
          <IncidentAnalyzer />
        </div>

        {/* CENTRE: Map — fills all remaining width, full height */}
        <div className="flex-1 min-w-0">
          <IncidentMap incidents={incidents} fullHeight />
        </div>

        {/* RIGHT: Recent Incidents Panel — fixed width, scrolls internally */}
        <RecentIncidentsPanel />

      </div>
    </div>
  );
}
