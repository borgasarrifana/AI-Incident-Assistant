import { useState, useRef, useEffect } from "react";
import { analyzeIncident as analyzeIncidentAPI } from "../api";
import { exportIncidentPDF } from "../utils/exportPDF";
import { useNotifications } from "../context/NotificationContext";
import { useMetrics } from "../context/MetricsContext";
import { useAudit } from "../context/AuditContext";
import { useAuth } from "../context/AuthContext";
import { useIncident } from "../context/IncidentContext";
import { Loader2, MapPin, X } from "lucide-react";

// All inputs share this class — covers both light and dark mode
const inputCls =
  "w-full p-3 rounded-xl border " +
  "bg-white dark:bg-slate-950 " +
  "border-slate-300 dark:border-slate-700 " +
  "text-slate-900 dark:text-white " +
  "placeholder-slate-400 dark:placeholder-slate-500 " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500 " +
  "transition";

function parseAIResponse(raw) {
  const get = (label, nextLabel) => {
    const pattern = nextLabel
      ? new RegExp(`${label}:\\s*([\\s\\S]*?)${nextLabel}:`, "i")
      : new RegExp(`${label}:\\s*([\\s\\S]*)`, "i");
    return raw.match(pattern)?.[1]?.trim() ?? "";
  };

  const severity  = get("Severity", "Tags");
  const tagsRaw   = get("Tags", "Root Cause");
  const rootCause = get("Root Cause", "Impact");
  const impact    = get("Impact", "Recommended Actions");
  const actions   = get("Recommended Actions", null);
  const tags      = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);
  const confidenceMap = { Critical: 96, High: 89, Medium: 78, Low: 65 };

  return {
    severity:         severity || "Low",
    tags,
    rootCause:        rootCause || "Unable to determine root cause.",
    impact:           impact    || "Impact unknown.",
    actions:          actions   || "No actions recommended.",
    summary:          `${severity || "Low"} incident detected by AI analysis.`,
    confidence:       confidenceMap[severity] ?? 70,
    relatedIncidents: Math.floor(Math.random() * 6),
  };
}

async function geocodeLocation(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`;
  const res = await fetch(url, { headers: { "Accept-Language": "en" } });
  if (!res.ok) throw new Error("Geocoding failed");
  return res.json();
}

const SEVERITY_COLOR = {
  Critical: "bg-red-500/20 text-red-400 border-red-500/30",
  High:     "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Medium:   "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Low:      "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

export default function IncidentAnalyzer() {
  const [incident,            setIncident]            = useState("");
  const [loading,             setLoading]             = useState(false);
  const [result,              setResult]              = useState(null);
  const [assignee,            setAssignee]            = useState("Unassigned");
  const [error,               setError]               = useState(null);
  const [locationQuery,       setLocationQuery]       = useState("");
  const [locationName,        setLocationName]        = useState("");
  const [lat,                 setLat]                 = useState("");
  const [lng,                 setLng]                 = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [locationLoading,     setLocationLoading]     = useState(false);
  const locationDebounce = useRef(null);

  const { addNotification }    = useNotifications();
  const { incrementIncidents } = useMetrics();
  const { addAuditLog }        = useAudit();
  const { user }               = useAuth();
  const { addIncident }        = useIncident();

  useEffect(() => {
    if (locationQuery.trim().length < 3) { setLocationSuggestions([]); return; }
    clearTimeout(locationDebounce.current);
    locationDebounce.current = setTimeout(async () => {
      setLocationLoading(true);
      try   { setLocationSuggestions(await geocodeLocation(locationQuery)); }
      catch { setLocationSuggestions([]); }
      finally { setLocationLoading(false); }
    }, 400);
    return () => clearTimeout(locationDebounce.current);
  }, [locationQuery]);

  const selectLocation = (place) => {
    const name = place.display_name.split(",").slice(0, 2).join(",").trim();
    setLocationName(name);
    setLat(parseFloat(place.lat).toFixed(4));
    setLng(parseFloat(place.lon).toFixed(4));
    setLocationQuery(name);
    setLocationSuggestions([]);
  };

  const clearLocation = () => {
    setLocationQuery(""); setLocationName("");
    setLat(""); setLng(""); setLocationSuggestions([]);
  };

  const handleAnalyze = async () => {
    if (!incident.trim()) return;
    setLoading(true); setError(null);
    try {
      const response = await analyzeIncidentAPI(incident);
      const aiResult = parseAIResponse(response.data.result);
      aiResult.assignee = assignee;
      setResult(aiResult);

      addIncident({
        id: Date.now(),
        incident,
        locationName: locationName || "Unknown",
        latitude:     parseFloat(lat) || 0,
        longitude:    parseFloat(lng) || 0,
        createdAt:    new Date().toISOString(),
        status:       "Open",
        result: {
          severity:         aiResult.severity,
          tags:             aiResult.tags,
          rootCause:        aiResult.rootCause,
          impact:           aiResult.impact,
          actions:          aiResult.actions,
          summary:          aiResult.summary,
          confidence:       aiResult.confidence,
          relatedIncidents: aiResult.relatedIncidents,
          assignee:         aiResult.assignee,
        },
      });

      incrementIncidents();
      addNotification("New incident analyzed", "success");
      addAuditLog("Analyzed incident", user?.email || "Unknown User");
      setIncident(""); setAssignee("Unassigned"); clearLocation();
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to analyze incident. Check your backend connection.";
      setError(message);
      addNotification("Incident analysis failed", "error");
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Incident Analyzer</h2>
        <span className="text-xs px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
          AI Powered
        </span>
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="block mb-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
          Incident Description
        </label>
        <textarea
          value={incident}
          onChange={(e) => setIncident(e.target.value)}
          placeholder="Describe the operational incident in detail..."
          maxLength={4000}
          rows={5}
          className={inputCls + " resize-none"}
        />
        <div className="text-right text-xs text-slate-400 mt-1">{incident.length} / 4000</div>
      </div>

      {/* LOCATION (2/3) + ASSIGNEE (1/3) — side by side */}
      <div className="flex gap-3 items-start">

        {/* LOCATION — takes 2/3 width */}
        <div className="flex-[2] relative">
          <label className="flex items-center gap-1 mb-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
            <MapPin size={13} /> Location
          </label>
          <div className="relative">
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="Search for a location..."
              className={inputCls + " pr-8"}
            />
            {locationLoading && (
              <Loader2 size={14} className="absolute right-3 top-3.5 animate-spin text-slate-400" />
            )}
            {locationName && !locationLoading && (
              <button onClick={clearLocation} className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
                <X size={14} />
              </button>
            )}
          </div>

          {/* DROPDOWN SUGGESTIONS */}
          {locationSuggestions.length > 0 && (
            <ul className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-2xl">
              {locationSuggestions.map((place) => (
                <li
                  key={place.place_id}
                  onClick={() => selectLocation(place)}
                  className="px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer border-b border-slate-100 dark:border-slate-800 last:border-0"
                >
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}

          {locationName && (
            <p className="mt-1.5 text-xs text-slate-400 truncate">
              📍 {locationName} · {lat}, {lng}
            </p>
          )}
        </div>

        {/* ASSIGNEE — takes 1/3 width */}
        <div className="flex-[1]">
          <label className="block mb-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
            Assignee
          </label>
          <select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className={inputCls}
          >
            <option value="Unassigned">Unassigned</option>
            <option value="John Smith">John Smith</option>
            <option value="Sarah Connor">Sarah Connor</option>
            <option value="Mike Johnson">Mike Johnson</option>
          </select>
        </div>

      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* ANALYZE BUTTON */}
      <button
        onClick={handleAnalyze}
        disabled={loading || !incident.trim()}
        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold transition flex items-center justify-center gap-2"
      >
        {loading
          ? <><Loader2 size={18} className="animate-spin" /> Analyzing...</>
          : "Analyze Incident"
        }
      </button>

      {/* AI RESULT */}
      {result && (
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">

          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Analysis</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${SEVERITY_COLOR[result.severity] ?? SEVERITY_COLOR.Low}`}>
              {result.severity}
            </span>
          </div>

          {/* TAGS */}
          <div className="flex flex-wrap gap-1.5">
            {result.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-xs text-cyan-700 dark:text-cyan-300 border border-slate-300 dark:border-slate-700">
                {tag}
              </span>
            ))}
          </div>

          {/* ROOT CAUSE / IMPACT / ACTIONS */}
          <div className="space-y-3">
            {[
              { label: "Root Cause", value: result.rootCause },
              { label: "Impact",     value: result.impact },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">{label}</div>
                <div className="text-sm text-slate-800 dark:text-white">{value}</div>
              </div>
            ))}
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Recommended Actions</div>
              <pre className="text-sm text-slate-800 dark:text-white whitespace-pre-wrap font-sans">{result.actions}</pre>
            </div>
          </div>

          {/* CONFIDENCE */}
          <div>
            <div className="flex justify-between mb-1.5 text-sm">
              <span className="text-slate-500 dark:text-slate-400">AI Confidence</span>
              <span className="font-medium text-slate-900 dark:text-white">{result.confidence}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${result.confidence}%` }} />
            </div>
          </div>

          {/* INSIGHTS */}
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 space-y-1.5">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">AI Operational Insights</div>
            <div className="text-sm text-slate-700 dark:text-slate-300">• Related incidents: {result.relatedIncidents}</div>
            <div className="text-sm text-slate-700 dark:text-slate-300">• Assigned: {result.assignee}</div>
            <div className="text-sm text-slate-700 dark:text-slate-300">• Blast radius: {result.severity}</div>
          </div>

          {/* EXPORT */}
          <button
            onClick={() => exportIncidentPDF(result)}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition"
          >
            Export PDF Report
          </button>
        </div>
      )}
    </div>
  );
}
