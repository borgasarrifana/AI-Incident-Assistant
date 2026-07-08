import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useTheme } from "../../context/ThemeContext";

export default function IncidentHeatmap({ history }) {
  const { darkMode } = useTheme();
  const textColor = darkMode ? "#94a3b8" : "#64748b";

  const hours = {};

  history.forEach((incident) => {
    const hour = new Date(incident.createdAt).getHours();
    hours[hour] = (hours[hour] || 0) + 1;
  });

  const data = Object.entries(hours)
    .map(([hour, count]) => ({ hour, count }))
    .sort((a, b) => Number(a.hour) - Number(b.hour));

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 h-[350px]">
      <h2 className="text-slate-900 dark:text-white font-semibold mb-4">
        Incident Heatmap
      </h2>

      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="hour" stroke={textColor} tick={{ fill: textColor, fontSize: 12 }} />
          <YAxis stroke={textColor} tick={{ fill: textColor, fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? "#0f172a" : "#ffffff",
              border: `1px solid ${darkMode ? "#1e293b" : "#e2e8f0"}`,
              borderRadius: "8px",
              color: darkMode ? "#fff" : "#0f172a",
            }}
          />
          <Bar dataKey="count" fill="#ef4444" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}