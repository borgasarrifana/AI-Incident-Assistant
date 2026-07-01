import { useState } from "react";
import { Link, useLocation,} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import NotificationPopover from "./NotificationPopover";
import NotificationCenter from "./NotificationCenter";
import ThemeToggle from "./ThemeToggle";
import {
  LayoutDashboard,
  AlertTriangle,
  FileText,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Bell,
  LogOut,
} from "lucide-react";

export default function Sidebar() {

  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { notifications } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount =
    notifications.filter(
      (n) => !n.read
    ).length;

  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
      roles: [
        "admin",
        "analyst",
        "viewer",
      ],
    },
    {
      name: "Incidents",
      path: "/incidents",
      icon: AlertTriangle,
      roles: [
        "admin",
        "analyst",
      ],
    },
    {
      name: "Logs",
      path: "/logs",
      icon: FileText,
      roles: [
        "admin",
        "analyst",
      ],
    },
    {
      name: "AI Insights",
      path: "/insights",
      icon: BrainCircuit,
      roles: [
        "admin",
        "analyst",
      ],
    },
  ];

  return (

    <aside
      className={`
        ${collapsed ? "w-18" : "w-72"}
        min-h-screen
        bg-slate-950
        border-r border-slate-800
        transition-all duration-300
        p-4
        flex flex-col
      `}
    >

      {/* TOP */}
      <div>

        {/* HEADER */}
        <div className="
          flex items-center justify-between
          mb-8
        ">

          {!collapsed && (

            <div>

              <h1 className="
                text-2xl font-bold text-white
              ">
                AI Ops
              </h1>

              <p className="
                text-sm text-slate-400
              ">
                Operations Platform
              </p>

            </div>

          )}

          <button
            onClick={() =>
              setCollapsed(!collapsed)
            }
            className="
              p-2 rounded-lg
              bg-slate-800
              hover:bg-slate-700
              text-white
            "
          >

            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}

          </button>

        </div>

        {/* WORKSPACE */}
        <WorkspaceSwitcher
          collapsed={collapsed}
        />

        {/* NAVIGATION */}
        <nav className="
          space-y-3 mt-6
        ">

          {navItems
            .filter((item) =>
              item.roles.includes(
                user?.role
              )
            )
            .map((item) => {

              const Icon =
                item.icon;

              const active =
                location.pathname ===
                item.path;

              return (

                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    flex items-center
                    gap-3 p-3 rounded-xl
                    transition
                    ${
                      active
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-800"
                    }
                  `}
                >

                  <Icon size={20} />

                  {!collapsed && (

                    <span className="
                      text-sm font-medium
                    ">
                      {item.name}
                    </span>

                  )}

                </Link>

              );
            })}

        </nav>

      </div>

      {/* FOOTER */}
      <div className="mt-auto">

        {/* USER */}
        {!collapsed && (

          <div className="
            mb-4 p-4 rounded-2xl
            bg-white dark:bg-slate-900
            border border-slate-800
          ">

            <p className="
              text-xs text-slate-400
            ">
              Logged in as
            </p>

            <p className="
              text-sm text-white mt-1
              truncate
            ">
              {user?.email}
            </p>

            <span className="
              inline-block mt-3
              px-3 py-1 rounded-full
              bg-blue-600
              text-xs text-white capitalize
            ">
              {user?.role}
            </span>

          </div>

        )}

        

        {/* ACTIONS */}
        <div
          className={`
            flex
            ${
              collapsed
                ? "flex-col"
                : "items-center"
            }
            gap-3
          `}
        >
          <ThemeToggle />

          {/* NOTIFICATIONS */}
          <NotificationPopover
            onOpenCenter={() =>
              setShowNotifications(true)
            }
          />

          <NotificationCenter
            open={showNotifications}
            onClose={() =>
              setShowNotifications(false)
            }
          />

          {/* LOGOUT */}
          <button
            onClick={logout}
            className={`
              flex items-center
              justify-center gap-2
              p-3 rounded-xl
              bg-red-600
              hover:bg-red-700
              text-white
              ${
                collapsed
                  ? "w-full"
                  : "flex-1"
              }
            `}
          >

            <LogOut size={18} />

            {!collapsed && (
              <span>
                Logout
              </span>
            )}

          </button>

        </div>

      </div>

    </aside>
  );
}