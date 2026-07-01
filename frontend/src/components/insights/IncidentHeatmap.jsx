import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function IncidentHeatmap({ history }) {

  const hours = {};

  history.forEach((incident) => {

    const hour = new Date(
      incident.createdAt
    ).getHours();

    hours[hour] =
      (hours[hour] || 0) + 1;

  });

  const data = Object.entries(hours)
    .map(([hour, count]) => ({
      hour,
      count,
    }))
    .sort(
      (a, b) =>
        Number(a.hour) -
        Number(b.hour)
    );

  return (

    <div className="
      bg-slate-900
      border border-slate-800
      rounded-3xl
      p-6
      h-[350px]
    ">

      <h2 className="
        text-white font-semibold
        mb-4
      ">
        Incident Heatmap
      </h2>

      <ResponsiveContainer>

        <BarChart data={data}>

          <XAxis dataKey="hour" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="count"
            fill="#ef4444"
            radius={[6,6,0,0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  );

}