import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  FolderOpen,
  CheckCircle2,
  Clock3,
  Shield
} from "lucide-react";


export default function KPICards({
  totalIncidents,
  criticalIncidents,
  openIncidents,
  resolvedIncidents,
  availability,
  mttr,
}) {

  const cards = [
    {
      title: "Total Incidents",
      value: totalIncidents,
      icon: Activity,
      color:
        "from-blue-500/20 to-cyan-500/10 border-blue-500/30",
    },

    {
      title: "Critical",
      value: criticalIncidents,
      icon: AlertTriangle,
      color:
        "from-red-500/20 to-red-700/10 border-red-500/30",
    },

    {
      title: "Open",
      value: openIncidents,
      icon: FolderOpen,
      color:
        "from-yellow-500/20 to-yellow-700/10 border-yellow-500/30",
    },

    {
      title: "Resolved",
      value: resolvedIncidents,
      icon: CheckCircle2,
      color:
        "from-emerald-500/20 to-emerald-700/10 border-emerald-500/30",
    },

    {
      title: "Availability %",
      value: availability,
      suffix: "%",
      decimals: 2,
      icon: Shield,
      color:
        "from-purple-500/20 to-purple-700/10 border-purple-500/30",
    },

    {
      title: "MTTR",
      value: mttr,
      suffix: "m",
      icon: Clock3,
      color:
        "from-orange-500/20 to-orange-700/10 border-orange-500/30",
    },
  ];

  return (

    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-3
        2xl:grid-cols-6
        gap-5
      "
    >

      {cards.map((card) => {

        const Icon = card.icon;

        return (

          <div
            key={card.title}
            className={`
              rounded-3xl
              border
              bg-gradient-to-br
              ${card.color}
              p-5
              shadow-xl
              backdrop-blur-xl
              hover:scale-[1.02]
              transition-all duration-300
            `}
          >

            <div className="flex items-center justify-between mb-5">

              <div className="text-slate-400 text-sm">

                {card.title}

              </div>

              <Icon
                size={22}
                className="text-white"
              />

            </div>

            <div className="text-3xl font-bold text-white">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-3xl font-bold text-white"
              >
                {card.value}
                {card.suffix || ""}
              </motion.div>
            </div>

          </div>

        );

      })}

    </div>

  );

}