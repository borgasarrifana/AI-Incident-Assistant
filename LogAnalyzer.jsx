import { useState } from "react";
import { analyzeLogs } from "../api";

export default function LogAnalyzer() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await analyzeLogs(text);
      setResult(res.data.result);
    } catch (err) {
      setResult("Error analyzing logs.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border">
      <h2 className="text-xl font-semibold mb-3 text-gray-700">
        Log Analyzer
      </h2>

      <textarea
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        rows="5"
        placeholder="Paste logs here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={handleAnalyze}
        disabled={!text || loading}
        className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Analyze Logs"}
      </button>

      {result && (
        <div className="mt-4 bg-gray-50 p-3 rounded-lg border text-sm whitespace-pre-wrap">
          {result}
        </div>
      )}
    </div>
  );
}