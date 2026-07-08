import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";

const COLORS = ["#ef4444", "#f97316", "#eab308", "#3b82f6"];

export default function SeverityPieChart({ severityData }) {
  const { darkMode } = useTheme();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 h-[350px]">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        Severity Distribution
      </h2>

      <ResponsiveContainer>
        <PieChart>
          <Pie data={severityData} dataKey="value" nameKey="name" outerRadius={100}>
            {severityData.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? "#0f172a" : "#ffffff",
              border: `1px solid ${darkMode ? "#1e293b" : "#e2e8f0"}`,
              borderRadius: "8px",
              color: darkMode ? "#fff" : "#0f172a",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}