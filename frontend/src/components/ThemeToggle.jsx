import { Moon, Sun,} from "lucide-react";
import { useTheme,} from "../context/ThemeContext";

export default function ThemeToggle() {

  const { darkMode, toggleTheme, } = useTheme();

  return (

    <button
      onClick={toggleTheme}
      className="
        p-2 rounded-xl
        border transition-all
        bg-white dark:bg-slate-900
        border-slate-300
        dark:border-slate-700
        hover:scale-105
      "
    >
      {darkMode ? (
        <Sun
          size={18}
          className="
            text-yellow-400
          "
        />
      ) : (
        <Moon
          size={18}
          className="
            text-slate-700
          "
        />
      )}
    </button>
  );
}