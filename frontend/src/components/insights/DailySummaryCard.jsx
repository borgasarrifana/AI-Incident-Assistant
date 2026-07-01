export default function DailySummaryCard({
  totalIncidents,
  criticalIncidents,
  availability
}) {

  return (

    <div className="
      bg-slate-900
      border border-slate-800
      rounded-3xl
      p-6
      space-y-4
    ">

      <h2 className="
        text-lg font-semibold
        text-white
      ">
        Daily Operational Summary
      </h2>

      <div className="
        text-sm
        text-slate-300
        leading-7
      ">

        Production experienced
        <span className="text-white font-semibold">
          {" "} {totalIncidents}
        </span>
        {" "}incidents.

        <br /><br />

        Critical events:

        <span className="text-red-400 font-semibold">
          {" "} {criticalIncidents}
        </span>

        <br /><br />

        Availability remained at

        <span className="text-emerald-400 font-semibold">
          {" "} {availability}%
        </span>

        <br /><br />

        Monitoring systems remain healthy.

      </div>

    </div>

  );

}