import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchIncidentAPI, fetchIncidentEventsAPI } from "../api";
import { useAssignees } from "../context/AssigneeContext";
import { Avatar } from "../components/AssigneeDropdown";
import {
  ArrowLeft,
  Loader2,
  MapPin,
  Clock,
  CheckCircle2,
  PlusCircle,
  RefreshCw,
  History,
  AlertTriangle,
} from "lucide-react";

const SEVERITY_COLOR = {
  Critical: "bg-red-500/20 text-red-400 border-red-500/30",
  High:     "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Medium:   "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Low:      "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const STATUS_COLOR = {
  Open:          "bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20",
  Investigating: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
  Mitigated:     "bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20",
  Resolved:      "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20",
};

const EVENT_ICON = {
  created:        <PlusCircle size={15} className="text-blue-500" />,
  status_changed: <RefreshCw size={15} className="text-emerald-500" />,
};

const EVENT_LABEL = {
  created:        "Incident created",
  status_changed: "Status changed",
};

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d) ? "—" : d.toLocaleString();
}

function Section({ label, children }) {
  return (
    <div>
      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
        {label}
      </div>
      {children}
    </div>
  );
}

export default function IncidentDetail() {
  const { id } = useParams();
  const { assignees } = useAssignees();

  const [incident, setIncident] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const [incRes, evRes] = await Promise.all([
          fetchIncidentAPI(id),
          fetchIncidentEventsAPI(id),
        ]);
        if (!cancelled) {
          setIncident(incRes.data);
          setEvents(evRes.data);
        }
      } catch (e) {
        console.error("Failed to load incident detail", e);
        if (!cancelled) {
          setError(
            e.response?.status === 404
              ? "This incident doesn't exist — it may have been deleted."
              : "Failed to load incident. Check your backend connection."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl space-y-4">
        <Link
          to="/incidents"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft size={15} /> Back to Incidents
        </Link>
        <div className="flex items-center gap-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-5 text-sm text-red-600 dark:text-red-400">
          <AlertTriangle size={18} className="flex-shrink-0" />
          {error}
        </div>
      </div>
    );
  }

  const result = incident.result || {};
  const assigneeRecord = assignees.find((a) => a.name === result.assignee) || null;

  return (
    <div className="max-w-3xl space-y-5 pb-8">

      {/* BACK + HEADER */}
      <div className="space-y-3">
        <Link
          to="/incidents"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft size={15} /> Back to Incidents
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mr-1">
            Incident Detail
          </h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${SEVERITY_COLOR[result.severity] ?? SEVERITY_COLOR.Low}`}>
            {result.severity || "Low"}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${STATUS_COLOR[incident.status] ?? STATUS_COLOR.Open}`}>
            {incident.status}
          </span>
        </div>
        <p className="text-xs text-slate-400 font-mono">{incident.id}</p>
      </div>

      {/* MAIN RECORD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">

        <Section label="Description">
          <p className="text-sm text-slate-800 dark:text-white whitespace-pre-wrap">
            {incident.incident}
          </p>
        </Section>

        {result.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {result.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-xs text-cyan-700 dark:text-cyan-300 border border-slate-300 dark:border-slate-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <Section label="Root Cause">
          <p className="text-sm text-slate-800 dark:text-white">{result.rootCause || "—"}</p>
        </Section>

        <Section label="Impact">
          <p className="text-sm text-slate-800 dark:text-white">{result.impact || "—"}</p>
        </Section>

        <Section label="Recommended Actions">
          <pre className="text-sm text-slate-800 dark:text-white whitespace-pre-wrap font-sans">
            {result.actions || "—"}
          </pre>
        </Section>

        {/* META GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Section label="Assignee">
            <div className="flex items-center gap-2">
              <Avatar
                name={result.assignee || "Unassigned"}
                avatarUrl={assigneeRecord?.avatar_url}
                size={26}
              />
              <span className="text-sm text-slate-800 dark:text-white">
                {result.assignee || "Unassigned"}
              </span>
            </div>
          </Section>

          <Section label="Location">
            <div className="flex items-center gap-1.5 text-sm text-slate-800 dark:text-white">
              <MapPin size={14} className="text-slate-400 flex-shrink-0" />
              {incident.locationName || "Unknown"}
            </div>
          </Section>

          <Section label="Created">
            <div className="flex items-center gap-1.5 text-sm text-slate-800 dark:text-white">
              <Clock size={14} className="text-slate-400 flex-shrink-0" />
              {formatDate(incident.createdAt)}
            </div>
          </Section>

          <Section label="Resolved">
            <div className="flex items-center gap-1.5 text-sm text-slate-800 dark:text-white">
              <CheckCircle2 size={14} className="text-slate-400 flex-shrink-0" />
              {formatDate(incident.resolvedAt)}
            </div>
          </Section>
        </div>

        {/* CONFIDENCE */}
        <div>
          <div className="flex justify-between mb-1.5 text-sm">
            <span className="text-slate-500 dark:text-slate-400">AI Confidence</span>
            <span className="font-medium text-slate-900 dark:text-white">
              {result.confidence ?? 0}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${result.confidence ?? 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* AUDIT TRAIL */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white mb-4">
          <History size={18} /> Audit Trail
        </h2>

        {events.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No events recorded for this incident. (Events are only tracked for
            incidents created after the audit trail was introduced.)
          </p>
        ) : (
          <ul className="space-y-0">
            {events.map((event, idx) => (
              <li key={event.id} className="flex gap-3">
                {/* TIMELINE RAIL */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {EVENT_ICON[event.action] ?? <History size={15} className="text-slate-400" />}
                  </div>
                  {idx < events.length - 1 && (
                    <div className="w-px flex-1 bg-slate-200 dark:bg-slate-800 my-1" />
                  )}
                </div>

                {/* EVENT CONTENT */}
                <div className="pb-5 min-w-0">
                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                    {EVENT_LABEL[event.action] ?? event.action}
                  </div>
                  {event.detail && (
                    <div className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                      {event.detail}
                    </div>
                  )}
                  <div className="text-xs text-slate-400 mt-1">
                    {event.actor} · {formatDate(event.createdAt)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
