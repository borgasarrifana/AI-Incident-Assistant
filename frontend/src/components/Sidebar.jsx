import { useState } from "react";
import { Link, useLocation,} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import NotificationPopover from "./NotificationPopover";
import NotificationCenter from "./NotificationCenter";
import ThemeToggle from "./ThemeToggle";
import { useSidebar } from "../context/SidebarContext";
import Tooltip from "./Tooltip";
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

  const { collapsed, setCollapsed } = useSidebar();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { notifications } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount =
    notifications.filter(
      (n) => !n.read
    ).length;

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard, roles: ["admin", "analyst", "viewer"] },
    { name: "Incidents", path: "/incidents", icon: AlertTriangle, roles: ["admin", "analyst"] },
    { name: "Logs", path: "/logs", icon: FileText, roles: ["admin", "analyst"] },
    { name: "AI Insights", path: "/insights", icon: BrainCircuit, roles: ["admin", "analyst"] },
  ];

  return (

    <aside
      className={`
        ${collapsed ? "w-18" : "w-72"}
        h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 p-4 flex flex-col
      `}
    >

      {/* TOP */}
      <div>

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">

          {!collapsed && (
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                AI Ops
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Operations Platform
              </p>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className=" p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* WORKSPACE */}
        <WorkspaceSwitcher collapsed={collapsed} />

        {/* NAVIGATION */}
        <nav className="space-y-3 mt-6">

          {navItems
            .filter((item) => item.roles.includes(user?.role))
            .map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;

              const link = (
                <Link
                  to={item.path}
                  className={`
                    flex items-center
                    gap-3 p-3 rounded-xl
                    transition
                    ${
                      active
                        ? "bg-blue-600 text-white"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }
                  `}
                >
                  <Icon size={20} />
                  {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
                </Link>
              );

              return collapsed ? (
                <Tooltip key={item.name} label={item.name} side="right">
                  {link}
                </Tooltip>
              ) : (
                <div key={item.name}>{link}</div>
              );
            })}
        </nav>
      </div>
      {/* FOOTER */}
      <div className="mt-auto">

        {/* USER */}
        {!collapsed && (
          <div className="mb-4 p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">Logged in as</p>
            <p className="text-sm text-slate-900 dark:text-white mt-1 truncate">{user?.email}</p>
            <span className="inline-block mt-3 px-3 py-1 rounded-full bg-blue-600 text-xs text-white capitalize">
              {user?.role}
            </span>
          </div>
        )}

        {/* ACTIONS */}
        <div className={`flex ${collapsed ? "flex-col" : "items-center"} gap-3`}>

          {collapsed ? (
            <Tooltip label={darkModeLabel} side="right">
              <ThemeToggle collapsed={collapsed} />
            </Tooltip>
          ) : (
            <ThemeToggle collapsed={collapsed} />
          )}

          {collapsed ? (
            <Tooltip label="Notifications" side="right">
              <NotificationPopover
                collapsed={collapsed}
                onOpenCenter={() => setShowNotifications(true)}
              />
            </Tooltip>
          ) : (
            <NotificationPopover
              collapsed={collapsed}
              onOpenCenter={() => setShowNotifications(true)}
            />
          )}

          <NotificationCenter
            open={showNotifications}
            onClose={() => setShowNotifications(false)}
          />

          {collapsed ? (
            <Tooltip label="Logout" side="right">
              <button
                onClick={logout}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white w-full"
              >
                <LogOut size={18} />
              </button>
            </Tooltip>
          ) : (
            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white flex-1"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          )}

        </div>
      </div>
    </aside>
  );
}