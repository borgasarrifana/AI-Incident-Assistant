import IncidentMap from "./IncidentMap";

export default function DashboardIncidentMap() {

  const incidents = JSON.parse(
    localStorage.getItem("incidentHistory") || "[]"
  );

  return (

    <div className="space-y-4">

      <div>

        <h2 className="
          text-2xl font-bold text-white
        ">
          Global Incident Map
        </h2>

        <p className="
          text-slate-400 mt-2
        ">
          Real-time operational
          incident visibility.
        </p>

      </div>

      <IncidentMap incidents={incidents} />

    </div>
  );
}