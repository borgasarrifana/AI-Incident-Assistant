import IncidentMap from "./IncidentMap";
import { useIncident } from "../context/IncidentContext";

export default function DashboardIncidentMap() {
  const { incidents } = useIncident();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Global Incident Map
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Real-time operational incident visibility.
        </p>
      </div>

      <IncidentMap incidents={incidents} />
    </div>
  );
}