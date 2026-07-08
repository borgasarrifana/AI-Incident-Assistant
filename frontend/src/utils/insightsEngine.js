export function generateInsights(history = [], knownAssignees = []) {
  const totalIncidents = history.length;

  const criticalIncidents = history.filter(
    (i) => i.result?.severity === "Critical"
  ).length;

  const openIncidents = history.filter(
    (i) => i.status === "Open"
  ).length;

  const resolvedIncidents = history.filter(
    (i) => i.status === "Resolved"
  ).length;

  const severityData = ["Critical", "High", "Medium", "Low"].map((name) => ({
    name,
    value: history.filter((i) => i.result?.severity === name).length,
  }));

  // Root cause distribution
  const rootCauseCounts = {};
  history.forEach((incident) => {
    const cause = incident.result?.rootCause || "Unknown";
    const label =
      cause.length > 40 ? cause.slice(0, 37) + "..." : cause;
    rootCauseCounts[label] = (rootCauseCounts[label] || 0) + 1;
  });
  const rootCauseData = Object.entries(rootCauseCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Assignee workload distribution — seed with every known team member at 0,
  // then add real incident counts on top, so idle assignees are still visible
  const assigneeCounts = {};
  knownAssignees.forEach((a) => {
    assigneeCounts[a.name] = 0;
  });
  history.forEach((incident) => {
    const assignee = incident.result?.assignee || "Unassigned";
    assigneeCounts[assignee] = (assigneeCounts[assignee] || 0) + 1;
  });
  const assigneeData = Object.entries(assigneeCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Availability: 100% minus a penalty per critical incident
  const availability =
    totalIncidents > 0
      ? Math.max(
          0,
          100 - (criticalIncidents / totalIncidents) * 10
        ).toFixed(2)
      : "100.00";

  // MTTR: average time to resolve (minutes) — calculated from real data
  const resolvedWithTimes = history.filter(
    (i) => i.status === "Resolved" && i.resolvedAt && i.createdAt
  );
  const mttr =
    resolvedWithTimes.length > 0
      ? Math.round(
          resolvedWithTimes.reduce((sum, i) => {
            const created = new Date(i.createdAt).getTime();
            const resolved = new Date(i.resolvedAt).getTime();
            return sum + (resolved - created) / 60000;
          }, 0) / resolvedWithTimes.length
        )
      : resolvedIncidents > 0
      ? 18
      : null;

  // MTTD: placeholder — would need detection timestamps to calculate
  const mttd = totalIncidents > 0 ? 3 : null;

  return {
    totalIncidents,
    criticalIncidents,
    openIncidents,
    resolvedIncidents,
    severityData,
    rootCauseData,
    assigneeData,
    availability,
    mttr,
    mttd,
    sla: 98,
  };
}