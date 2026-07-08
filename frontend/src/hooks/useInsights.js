import { useMemo } from "react";
import { useIncident } from "../context/IncidentContext";
import { useAssignees } from "../context/AssigneeContext";
import { generateInsights } from "../utils/insightsEngine";

export default function useInsights() {
  const { incidents } = useIncident();
  const { assignees } = useAssignees();

  return useMemo(
    () => generateInsights(incidents, assignees),
    [incidents, assignees]
  );
}