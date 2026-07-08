import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";

export default function RootCauseChart({ rootCauseData }) {
  const { darkMode } = useTheme();
  const textColor = darkMode ? "#94a3b8" : "#64748b";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 h-[350px]">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        Top Root Causes
      </h2>

      <ResponsiveContainer>
        <BarChart data={rootCauseData}>
          <XAxis dataKey="name" stroke={textColor} tick={{ fill: textColor, fontSize: 12 }} />
          <YAxis stroke={textColor} tick={{ fill: textColor, fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? "#0f172a" : "#ffffff",
              border: `1px solid ${darkMode ? "#1e293b" : "#e2e8f0"}`,
              borderRadius: "8px",
              color: darkMode ? "#fff" : "#0f172a",
            }}
          />
          <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}