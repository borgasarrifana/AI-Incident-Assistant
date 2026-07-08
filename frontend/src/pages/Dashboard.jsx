import MetricsCards from "../components/MetricsCards";
import DashboardCharts from "../components/DashboardCharts";
//import LiveFeed from "../components/LiveFeed";
import WorkspaceSummary from "../components/WorkspaceSummary";
import DashboardIncidentMap from "../components/DashboardIncidentMap";

export default function Dashboard() {
  return (
    <div className="space-y-6 pr-6">
      <MetricsCards />
      <DashboardCharts />
      <DashboardIncidentMap />
      <WorkspaceSummary />
    </div>
  );
}