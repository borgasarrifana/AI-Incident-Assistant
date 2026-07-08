import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";

export default function IncidentTrendChart({ history }) {
  const { darkMode } = useTheme();

  const trendData = {};

  history.forEach((incident) => {
    const day = new Date(incident.createdAt).toLocaleDateString();
    trendData[day] = (trendData[day] || 0) + 1;
  });

  const data = Object.entries(trendData).map(([date, count]) => ({
    date,
    count,
  }));

  const gridColor = darkMode ? "#1e293b" : "#e2e8f0";
  const textColor = darkMode ? "#94a3b8" : "#64748b";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 h-[350px]">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        Incident Trend
      </h2>

      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid stroke={gridColor} />
          <XAxis dataKey="date" stroke={textColor} tick={{ fill: textColor, fontSize: 12 }} />
          <YAxis stroke={textColor} tick={{ fill: textColor, fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? "#0f172a" : "#ffffff",
              border: `1px solid ${darkMode ? "#1e293b" : "#e2e8f0"}`,
              borderRadius: "8px",
              color: darkMode ? "#fff" : "#0f172a",
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#3b82f6"
            strokeWidth={3}
            isAnimationActive
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}