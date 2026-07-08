import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useTheme } from "../../context/ThemeContext";

export default function AvailabilityGauge({ value, title }) {
  const { darkMode } = useTheme();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
      <div className="text-center text-slate-500 dark:text-slate-400 mb-6">
        {title}
      </div>

      <div className="h-40">
        <CircularProgressbar
          value={value}
          text={`${value}%`}
          styles={buildStyles({
            pathColor: "#3b82f6",
            textColor: darkMode ? "#fff" : "#0f172a",
            trailColor: darkMode ? "#1e293b" : "#e2e8f0",
          })}
        />
      </div>
    </div>
  );
}