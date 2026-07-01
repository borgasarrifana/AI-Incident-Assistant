import {
  BarChart,
  Bar,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

export default function AssigneeWorkloadChart({
  assigneeData,
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
        Assignee Workload
      </h2>

      <ResponsiveContainer>

        <BarChart data={assigneeData}>

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="value"
            fill="#10b981"
            radius={[8,8,0,0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  );

}