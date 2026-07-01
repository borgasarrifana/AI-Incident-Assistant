import { useState } from "react";
import { analyzeLogs } from "../api";
import { useNotifications } from "../context/NotificationContext";
import { useMetrics } from "../context/MetricsContext";
import { Loader2 } from "lucide-react";

// Parse structured OpenAI response into sections
function parseAIResponse(raw) {
  const get = (label, nextLabel) => {
    const pattern = nextLabel
      ? new RegExp(`${label}:\\s*([\\s\\S]*?)${nextLabel}:`, "i")
      : new RegExp(`${label}:\\s*([\\s\\S]*)`, "i");
    return raw.match(pattern)?.[1]?.trim() ?? "";
  };

  const severity = get("Severity", "Tags");
  const tagsRaw = get("Tags", "Root Cause");
  const rootCause = get("Root Cause", "Impact");
  const impact = get("Impact", "Recommended Actions");
  const actions = get("Recommended Actions", null);
  const tags = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);

  return { severity, tags, rootCause, impact, actions };
}

export default function LogAnalyzer() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hooks at top level — not inside helper functions
  const { addNotification } = useNotifications();
  const { incrementLogs } = useMetrics();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setText(e.target.result);
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await analyzeLogs(text);
      const parsed = parseAIResponse(res.data.result);
      setResult(parsed);
      incrementLogs();
      addNotification("Logs analyzed successfully", "success");
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.detail ||
        "Failed to analyze logs. Check your backend connection.";
      setError(message);
      addNotification("Log analysis failed", "error");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Log Analyzer
        </h2>
        <span className="text-xs px-3 py-1 rounded-full bg-green-950 text-green-400 border border-green-800">
          AI Enabled
        </span>
      </div>

      {/* FILE UPLOAD */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-slate-300">
          Upload .log file
        </label>
        <input
          type="file"
          accept=".log,.txt"
          onChange={handleFileUpload}
          className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-green-950 file:text-green-400 hover:file:opacity-80"
        />
      </div>

      {/* TEXTAREA */}
      <textarea
        rows="10"
        placeholder="Paste logs here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={8000}
        className="w-full p-4 rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <div className="text-right text-xs text-slate-500 mt-1">
        {text.length} / 8000
      </div>

      {/* ERROR */}
      {error && (
        <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* BUTTON */}
      <button
        onClick={handleAnalyze}
        disabled={!text.trim() || loading}
        className="mt-4 w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Analyzing...
          </>
        ) : (
          "Analyze Logs"
        )}
      </button>

      {/* RESULTS */}
      {result && (
        <div className="mt-6 space-y-4">

          <div className="p-4 rounded-xl border border-red-900 bg-red-950">
            <h3 className="font-semibold text-red-400 mb-2">Severity</h3>
            <p className="text-sm text-slate-300">{result.severity}</p>
          </div>

          <div className="p-4 rounded-xl border border-purple-900 bg-purple-950">
            <h3 className="font-semibold text-purple-400 mb-3">AI Tags</h3>
            <div className="flex flex-wrap gap-2">
              {result.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-sm bg-purple-900 text-purple-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-blue-900 bg-blue-950">
            <h3 className="font-semibold text-blue-400 mb-2">Root Cause</h3>
            <p className="text-sm text-slate-300">{result.rootCause}</p>
          </div>

          <div className="p-4 rounded-xl border border-yellow-900 bg-yellow-950">
            <h3 className="font-semibold text-yellow-400 mb-2">Impact</h3>
            <p className="text-sm text-slate-300">{result.impact}</p>
          </div>

          <div className="p-4 rounded-xl border border-green-900 bg-green-950">
            <h3 className="font-semibold text-green-400 mb-2">Recommended Actions</h3>
            <pre className="whitespace-pre-wrap text-sm text-slate-300 font-sans">
              {result.actions}
            </pre>
          </div>

        </div>
      )}
    </div>
  );
}
