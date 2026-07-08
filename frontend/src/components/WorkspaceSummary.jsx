import {
  useWorkspace,
} from "../context/WorkspaceContext";

import {
  useMetrics,
} from "../context/MetricsContext";

export default function WorkspaceSummary() {

  const { activeWorkspace } = useWorkspace();
  const { metrics } = useMetrics();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
        AI Workspace Summary
      </h2>
      <div className="space-y-4 text-slate-600 dark:text-slate-300">
        <p>
          <span className="font-semibold text-slate-900 dark:text-white">
            {activeWorkspace ? activeWorkspace.name : "No workspace"}
          </span>
          {" "}
          had
          {" "}
          <span className="text-red-500 dark:text-red-400 font-bold">
            {metrics.incidents}
          </span>
          {" "}
          incidents today.
        </p>
        <p>
          AI detected increased
          operational activity in logs
          and infrastructure services.
        </p>
        <p>
          Recommended focus:
          investigate recurring
          authentication failures
          and API latency spikes.
        </p>
      </div>
    </div>
  );
}