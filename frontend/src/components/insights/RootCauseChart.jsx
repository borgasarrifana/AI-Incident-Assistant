import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RootCauseChart({
  rootCauseData,
}) {

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
        Top Root Causes
      </h2>

      <ResponsiveContainer>

        <BarChart data={rootCauseData}>

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="value"
            fill="#8b5cf6"
            radius={[8, 8, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  );

}