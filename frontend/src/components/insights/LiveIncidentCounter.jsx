import CountUp from "react-countup";

export default function LiveIncidentCounter({
  incidents,
}) {

  return (

    <div className="
      bg-gradient-to-r
      from-red-500/20
      to-orange-500/10
      border border-red-500/30
      rounded-3xl
      p-8
    ">

      <div className="
        text-sm text-slate-400
      ">
        Live Incident Count
      </div>

      <div className="
        text-6xl font-bold
        text-white mt-3
      ">

        <CountUp
          end={incidents}
          duration={1}
        />

      </div>

    </div>

  );

}