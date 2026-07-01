import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function IncidentTrendChart({ history }) {

  const trendData = {};

  history.forEach((incident) => {

    const day = new Date(
      incident.createdAt
    ).toLocaleDateString();

    trendData[day] =
      (trendData[day] || 0) + 1;

  });

  const data = Object.entries(
    trendData
  ).map(([date, count]) => ({
    date,
    count,
  }));

  return (

    <div className="
      bg-slate-900
      border border-slate-800
      rounded-3xl
      p-6
      h-[350px]
    ">

      <h2 className="
        text-lg font-semibold
        text-white mb-4
      ">
        Incident Trend
      </h2>

      <ResponsiveContainer>

        <LineChart data={data}>

          <CartesianGrid stroke="#1e293b" />

          <XAxis dataKey="date" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="count"
            stroke="#3b82f6"
            strokeWidth={3}
            isAnimationActive
            animationDuration={1500}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );

}