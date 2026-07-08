import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useIncident } from "../context/IncidentContext";
import { useTheme } from "../context/ThemeContext";
import { memo } from "react";

const DashboardCharts = memo(function DashboardCharts() {
  const { incidents } = useIncident();
  const { darkMode } = useTheme();
  const textColor = darkMode ? "#94a3b8" : "#64748b";
  const gridColor = darkMode ? "#1e293b" : "#e2e8f0";

  // Build the last 5 days as labeled buckets, counting real incidents per day
  const days = [];
  for (let i = 4; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      label: d.toLocaleDateString(undefined, { weekday: "short" }),
      dateKey: d.toDateString(),
    });
  }

  const data = days.map(({ label, dateKey }) => {
    const count = incidents.filter(
      (inc) => new Date(inc.createdAt).toDateString() === dateKey
    ).length;
    return { name: label, incidents: count };
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Operational Activity
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Incidents analyzed over the last 5 days
        </p>
      </div>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={textColor} tick={{ fill: textColor, fontSize: 12 }} />
            <YAxis stroke={textColor} tick={{ fill: textColor, fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? "#0f172a" : "#ffffff",
                border: `1px solid ${darkMode ? "#1e293b" : "#e2e8f0"}`,
                borderRadius: "8px",
                color: darkMode ? "#fff" : "#0f172a",
              }}
            />
            <Line type="monotone" dataKey="incidents" stroke="#3b82f6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

export default DashboardCharts;