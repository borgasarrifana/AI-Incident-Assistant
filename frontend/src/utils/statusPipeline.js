import { AlertTriangle, Search, Wrench, CheckCircle2 } from "lucide-react";

// Single source of truth for the incident status pipeline
export const STATUS_ORDER = ["Open", "Investigating", "Mitigated", "Resolved"];

export const STATUS_META = {
  Open: {
    icon: AlertTriangle,
    color: "text-yellow-500 dark:text-yellow-400",
    badge: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
  },
  Investigating: {
    icon: Search,
    color: "text-blue-500 dark:text-blue-400",
    badge: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30",
  },
  Mitigated: {
    icon: Wrench,
    color: "text-orange-500 dark:text-orange-400",
    badge: "bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30",
  },
  Resolved: {
    icon: CheckCircle2,
    color: "text-green-500 dark:text-green-400",
    badge: "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30",
  },
};

// Returns the next status in the pipeline, or null if already at the end
export function getNextStatus(current) {
  const idx = STATUS_ORDER.indexOf(current);
  if (idx === -1 || idx === STATUS_ORDER.length - 1) return null;
  return STATUS_ORDER[idx + 1];
}