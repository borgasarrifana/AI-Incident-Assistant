import { useState } from "react";
import { Bell, X, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

export default function NotificationPopover({ collapsed, onOpenCenter }) {
  const [open, setOpen] = useState(false);
  const { notifications, markAllAsRead } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const latest = notifications.slice(0, 8);

  return (
    <div className={`relative ${collapsed ? "w-full" : "flex-1"}`}>
      {/* BELL */}
      <button
        onClick={() => setOpen(!open)}
        className={`
          relative flex items-center justify-center
          p-3 rounded-xl
          border transition
          bg-slate-100 dark:bg-slate-900
          border-slate-300 dark:border-slate-700
          hover:bg-slate-200 dark:hover:bg-slate-800
          ${collapsed ? "w-full" : "w-full"}
        `}
      >
        <Bell size={18} className="text-slate-700 dark:text-white" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
            {unreadCount}
          </div>
        )}
      </button>

      {/* POPOVER */}
      {open && (
        <div className="absolute left-0 bottom-14 w-[360px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50">

          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-slate-900 dark:text-white font-semibold">Notifications</div>
              <div className="text-xs text-slate-500">Latest operational events</div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              <X size={16} className="text-slate-400" />
            </button>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {latest.length === 0 && (
              <div className="p-6 text-center text-slate-500 text-sm">No notifications yet</div>
            )}
            {latest.map((item) => (
              <button
                key={item.id}
                className="w-full text-left px-4 py-3 border-b border-slate-100 dark:border-slate-900 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {item.type === "error" ? (
                      <AlertTriangle size={16} className="text-red-400" />
                    ) : item.type === "success" ? (
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    ) : (
                      <Info size={16} className="text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-slate-900 dark:text-white">{item.message}</div>
                    <div className="text-xs text-slate-500 mt-1">{item.time}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
            <button
              onClick={() => markAllAsRead()}
              className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-sm text-slate-900 dark:text-white"
            >
              Mark all read
            </button>
            <button
              onClick={() => {
                setOpen(false);
                onOpenCenter();
              }}
              className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm text-white"
            >
              View All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}