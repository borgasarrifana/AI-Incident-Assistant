export default function PredictiveInsightsCard({
  criticalIncidents,
  totalIncidents
}) {

  const probability =
    totalIncidents === 0
      ? 0
      : Math.round(
          (criticalIncidents / totalIncidents) * 100
        );

  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-500/20 rounded-3xl p-6 space-y-4">

      <h2 className="text-lg font-semibold text-purple-600 dark:text-purple-400">
        Predictive Insights
      </h2>

      <div className="text-5xl font-bold text-slate-900 dark:text-white">
        {probability}%
      </div>

      <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
        <div>Probability of another critical incident.</div>
        <div>Highest risk component: Payments API</div>
        <div>Suggested escalation: SRE Team</div>
        <div>Estimated blast radius: Medium</div>
      </div>

    </div>
  );
}