import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Activity,
  ShieldAlert,
  BrainCircuit,
} from "lucide-react";
import { useIncident } from "../context/IncidentContext";

function Counter({ target }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = target / (duration / 16) || target;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}</span>;
}

export default function MetricsCards() {
  const { incidents } = useIncident();

  const totalIncidents = incidents.length;
  const criticalCount = incidents.filter((i) => i.result?.severity === "Critical").length;
  const openCount = incidents.filter((i) => i.status === "Open").length;
  const resolvedCount = incidents.filter((i) => i.status === "Resolved").length;
  const health = totalIncidents === 0 ? 100 : Math.max(0, 100 - Math.round((criticalCount / totalIncidents) * 15));

  const metrics = [
    {
      title: "Total Incidents",
      value: totalIncidents,
      icon: AlertTriangle,
      color: "text-red-500 dark:text-red-400",
    },
    {
      title: "Open",
      value: openCount,
      icon: BrainCircuit,
      color: "text-yellow-500 dark:text-yellow-400",
    },
    {
      title: "Critical",
      value: criticalCount,
      icon: ShieldAlert,
      color: "text-orange-500 dark:text-orange-400",
    },
    {
      title: "System Health",
      value: health,
      icon: Activity,
      color: "text-green-500 dark:text-green-400",
      suffix: "%",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <div
            key={metric.title}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {metric.title}
                </p>
                <h2 className={`text-4xl font-bold mt-3 ${metric.color}`}>
                  <Counter target={metric.value} />
                  {metric.suffix || ""}
                </h2>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                <Icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}