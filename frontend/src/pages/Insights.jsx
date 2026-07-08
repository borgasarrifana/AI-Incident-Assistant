import useInsights from "../hooks/useInsights";
import { useIncident } from "../context/IncidentContext";

import KPICards from "../components/insights/KPICards";
import IncidentTrendChart from "../components/insights/IncidentTrendChart";
import SeverityPieChart from "../components/insights/SeverityPieChart";
import RootCauseChart from "../components/insights/RootCauseChart";
import AssigneeWorkloadChart from "../components/insights/AssigneeWorkloadChart";
import AIInsightsCard from "../components/insights/AIInsightsCard";
import PredictiveInsightsCard from "../components/insights/PredictiveInsightsCard";
import DailySummaryCard from "../components/insights/DailySummaryCard";
import ReliabilityMetrics from "../components/insights/ReliabilityMetrics";
import IncidentHeatmap from "../components/insights/IncidentHeatmap";
import IncidentCorrelationGraph from "../components/insights/IncidentCorrelationGraph";
import IncidentMap from "../components/IncidentMap";

export default function Insights() {
  // Get incidents from context (source of truth)
  const { incidents } = useIncident();

  // useInsights reads from context internally — no localStorage reads here
  const insights = useInsights();

  if (incidents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
        <div className="text-4xl">📊</div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          No incidents yet
        </h2>
        <p className="text-slate-400 text-sm max-w-sm">
          Analyze your first incident on the Incidents page and your insights
          dashboard will populate automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pr-4">

      <KPICards {...insights} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <IncidentTrendChart history={incidents} />
        <SeverityPieChart severityData={insights.severityData} />
        <RootCauseChart rootCauseData={insights.rootCauseData} />
        <AssigneeWorkloadChart assigneeData={insights.assigneeData} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AIInsightsCard history={incidents} />
        <PredictiveInsightsCard
          criticalIncidents={insights.criticalIncidents}
          totalIncidents={insights.totalIncidents}
        />
        <DailySummaryCard
          totalIncidents={insights.totalIncidents}
          criticalIncidents={insights.criticalIncidents}
          availability={insights.availability}
        />
        <ReliabilityMetrics
          availability={insights.availability}
          mttr={insights.mttr}
          mttd={insights.mttd}
          sla={insights.sla}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <IncidentHeatmap history={incidents} />
        <IncidentCorrelationGraph />
      </div>

      <div className="h-[600px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
        <IncidentMap incidents={incidents} fullHeight />
      </div>

    </div>
  );
}
