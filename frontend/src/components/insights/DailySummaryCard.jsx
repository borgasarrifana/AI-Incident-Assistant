export default function DailySummaryCard({
  totalIncidents,
  criticalIncidents,
  availability
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        Daily Operational Summary
      </h2>

      <div className="text-sm text-slate-600 dark:text-slate-300 leading-7">
        Production experienced
        <span className="text-slate-900 dark:text-white font-semibold">
          {" "} {totalIncidents}
        </span>
        {" "}incidents.

        <br /><br />

        Critical events:
        <span className="text-red-600 dark:text-red-400 font-semibold">
          {" "} {criticalIncidents}
        </span>

        <br /><br />

        Availability remained at
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
          {" "} {availability}%
        </span>

        <br /><br />

        Monitoring systems remain healthy.
      </div>
    </div>
  );
}