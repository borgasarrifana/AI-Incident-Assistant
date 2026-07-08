import { X, MapPin, Clock, User } from "lucide-react";

const SEVERITY_COLOR = {
  Critical: "bg-red-500/20 text-red-400 border-red-500/30",
  High:     "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Medium:   "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Low:      "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

export default function IncidentDetailModal({ incident, onClose }) {
  if (!incident) return null;

  const result = incident.result || {};

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4"
      >
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Incident Details</h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
              {incident.locationName && incident.locationName !== "Unknown" && (
                <span className="flex items-center gap-1">
                  <MapPin size={11} /> {incident.locationName}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock size={11} /> {new Date(incident.createdAt).toLocaleString()}
              </span>
              {result.assignee && (
                <span className="flex items-center gap-1">
                  <User size={11} /> {result.assignee}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* DESCRIPTION */}
        <div className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
          {incident.incident}
        </div>

        {/* SEVERITY */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Status</span>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {incident.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${SEVERITY_COLOR[result.severity] ?? SEVERITY_COLOR.Low}`}>
              {result.severity ?? "Low"}
            </span>
          </div>
        </div>

        {/* TAGS */}
        {result.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {result.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-xs text-cyan-700 dark:text-cyan-300 border border-slate-300 dark:border-slate-700">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* ROOT CAUSE / IMPACT / ACTIONS */}
        <div className="space-y-3">
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Root Cause</div>
            <div className="text-sm text-slate-800 dark:text-white">{result.rootCause}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Impact</div>
            <div className="text-sm text-slate-800 dark:text-white">{result.impact}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Recommended Actions</div>
            <pre className="text-sm text-slate-800 dark:text-white whitespace-pre-wrap font-sans">{result.actions}</pre>
          </div>
        </div>

        {/* CONFIDENCE */}
        {typeof result.confidence === "number" && (
          <div>
            <div className="flex justify-between mb-1.5 text-sm">
              <span className="text-slate-500 dark:text-slate-400">AI Confidence</span>
              <span className="font-medium text-slate-900 dark:text-white">{result.confidence}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${result.confidence}%` }} />
            </div>
          </div>
        )}

        {/* INSIGHTS */}
        <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 space-y-1.5">
          <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">AI Operational Insights</div>
          <div className="text-sm text-slate-700 dark:text-slate-300">• Related incidents: {result.relatedIncidents ?? 0}</div>
          <div className="text-sm text-slate-700 dark:text-slate-300">• Assigned: {result.assignee ?? "Unassigned"}</div>
          <div className="text-sm text-slate-700 dark:text-slate-300">• Blast radius: {result.severity ?? "Low"}</div>
        </div>
      </div>
    </div>
  );
}