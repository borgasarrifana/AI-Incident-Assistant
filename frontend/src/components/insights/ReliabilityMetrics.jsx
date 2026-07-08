export default function ReliabilityMetrics({
  availability,
  mttr,
  mttd,
  sla
}) {

  const metrics = [
    { title: "Availability", value: `${availability}%` },
    { title: "MTTR", value: `${mttr} min` },
    { title: "MTTD", value: `${mttd} min` },
    { title: "SLA", value: `${sla}%` },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">

      {metrics.map((metric) => (
        <div
          key={metric.title}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center"
        >
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {metric.title}
          </div>

          <div className="text-3xl font-bold text-slate-900 dark:text-white mt-3">
            {metric.value}
          </div>
        </div>
      ))}

    </div>
  );
}