import LogAnalyzer from "../components/LogAnalyzer";
import RoleGuard from "../components/RoleGuard";

export default function Logs() {

  return (
    <RoleGuard allowedRoles={["admin", "analyst"]}>
      <LogAnalyzer />
    </RoleGuard>
  );
}