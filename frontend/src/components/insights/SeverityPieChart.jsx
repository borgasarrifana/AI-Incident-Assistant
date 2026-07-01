import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#3b82f6",
];

export default function SeverityPieChart({
  severityData,
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
        Severity Distribution
      </h2>

      <ResponsiveContainer>

        <PieChart>

          <Pie
            data={severityData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
          >

            {severityData.map(
              (_, index) => (

                <Cell
                  key={index}
                  fill={
                    COLORS[index]
                  }
                />

              )
            )}

          </Pie>

          <Tooltip />

        </PieChart>

      </ResponsiveContainer>

    </div>

  );

}