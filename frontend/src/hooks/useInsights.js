import { useMemo } from "react";
import { useIncident } from "../context/IncidentContext";
import { generateInsights } from "../utils/insightsEngine";

export default function useInsights() {
  const { incidents } = useIncident();

  // useMemo now correctly depends on the incidents array from context,
  // so it recomputes whenever incidents change — no more stale localStorage reads.
  return useMemo(() => generateInsights(incidents), [incidents]);
}
