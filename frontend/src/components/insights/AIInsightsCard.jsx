export default function AIInsightsCard({ history }) {
  const apiIncidents = history.filter(
    (i) => i.incident?.toLowerCase().includes("api")
  ).length;

  const dbIncidents = history.filter(
    (i) => i.incident?.toLowerCase().includes("database")
  ).length;

  const k8sIncidents = history.filter(
    (i) => i.incident?.toLowerCase().includes("kubernetes")
  ).length;

  return (
    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-200 dark:border-blue-500/20 rounded-3xl p-6 space-y-4">
      <h2 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
        AI Operational Insights
      </h2>

      <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
        <div>• APIs involved in {apiIncidents} incidents.</div>
        <div>• Database-related incidents: {dbIncidents}.</div>
        <div>• Kubernetes issues detected: {k8sIncidents}.</div>
        <div>• Critical incidents require proactive monitoring.</div>
        <div>• Most common pattern indicates service degradation.</div>
      </div>
    </div>
  );
}