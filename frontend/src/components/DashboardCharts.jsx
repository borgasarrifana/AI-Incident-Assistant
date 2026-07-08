import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { useMetrics } from "../context/MetricsContext";

import { memo } from "react";

const DashboardCharts = memo(function DashboardCharts() {

  const { metrics } = useMetrics();

  const data = [
    {
      name: "Mon",
      incidents: 4,
      logs: 20,
    },
    {
      name: "Tue",
      incidents: 6,
      logs: 25,
    },
    {
      name: "Wed",
      incidents: 8,
      logs: 28,
    },
    {
      name: "Thu",
      incidents: 5,
      logs: 30,
    },
    {
      name: "Fri",
      incidents: metrics.incidents,
      logs: metrics.logs,
    },
  ];

  return (

    <div className=" bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white">
          Operational Activity
        </h2>
        <p className="text-sm text-slate-400">
          Real-time AI operational metrics
        </p>
      </div>
      <div className="h-[350px]">
        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
            />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="incidents"
              stroke="#3b82f6"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="logs"
              stroke="#22c55e"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

export default DashboardCharts;