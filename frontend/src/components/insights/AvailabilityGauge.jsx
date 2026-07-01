import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

export default function AvailabilityGauge({
  value,
  title,
}) {

  return (

    <div className="
      bg-slate-900
      border border-slate-800
      rounded-3xl
      p-6
    ">

      <div className="
        text-center text-slate-400
        mb-6
      ">
        {title}
      </div>

      <div className="h-40">

        <CircularProgressbar
          value={value}
          text={`${value}%`}
          styles={buildStyles({
            pathColor: "#3b82f6",
            textColor: "#fff",
            trailColor: "#1e293b",
          })}
        />

      </div>

    </div>

  );

}