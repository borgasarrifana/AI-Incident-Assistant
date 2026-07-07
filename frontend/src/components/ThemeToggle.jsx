import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle({ collapsed }) {

  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        flex items-center justify-center
        p-3 rounded-xl
        border transition
        bg-slate-100 dark:bg-slate-900
        border-slate-300 dark:border-slate-700
        hover:bg-slate-200 dark:hover:bg-slate-800
        ${collapsed ? "w-full" : "flex-1"}
      `}
    >
      {darkMode ? (
        <Sun size={18} className="text-yellow-400" />
      ) : (
        <Moon size={18} className="text-slate-700" />
      )}
    </button>
  );
}