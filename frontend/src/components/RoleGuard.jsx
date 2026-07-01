import { useAuth } from "../context/AuthContext";

export default function RoleGuard({
  allowedRoles,
  children,
}) {

  const { user } = useAuth();

  if (!user) return null;

  if (
    !allowedRoles.includes(user.role)
  ) {

    return (

      <div className="
        bg-red-950
        border border-red-800
        rounded-2xl
        p-6
        text-red-300
      ">

        <h2 className="
          text-xl font-bold mb-2
        ">
          Access Denied
        </h2>

        <p>
          You do not have permission
          to access this section.
        </p>

      </div>
    );
  }

  return children;
}