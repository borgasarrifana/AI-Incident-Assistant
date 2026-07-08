import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Activity,
  ShieldAlert,
  BrainCircuit,
} from "lucide-react";

function Counter({ target }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;

    const duration = 1000;
    const increment = target / (duration / 16);

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
  const metrics = [
    {
      title: "Incidents",
      value: 128,
      icon: AlertTriangle,
      color: "text-red-400",
    },
    {
      title: "AI Insights",
      value: 432,
      icon: BrainCircuit,
      color: "text-blue-400",
    },
    {
      title: "Critical Alerts",
      value: 12,
      icon: ShieldAlert,
      color: "text-yellow-400",
    },
    {
      title: "System Health",
      value: 99,
      icon: Activity,
      color: "text-green-400",
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
            className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl"
          >

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-400">
                  {metric.title}
                </p>

                <h2 className={`text-4xl font-bold mt-3 ${metric.color}`}>
                  <Counter target={metric.value} />
                  {metric.suffix || ""}
                </h2>
              </div>

              <div className="p-3 rounded-xl bg-slate-800">
                <Icon className={`w-6 h-6 ${metric.color}`} />
              </div>

            </div>

          </div>
        );
      })}

    </div>
  );
}