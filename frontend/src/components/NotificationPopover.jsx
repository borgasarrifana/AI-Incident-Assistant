import { useState } from "react";
import { Bell, X, AlertTriangle, CheckCircle2, Info,} from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

export default function NotificationPopover({
  onOpenCenter,
}) {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAllAsRead,} = useNotifications();
  const latest = notifications.slice(0, 8);

  return (
    <div className="relative">
      {/* BELL */}
      <button onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-800
          hover:bg-slate-800 transition-all"
      >
        <Bell size={18} className="text-white"/>
        {unreadCount > 0 && (
          <div
            className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-xs
              flex items-center justify-center font-bold"
          >
            {unreadCount}
          </div>
        )}
      </button>
      {/* POPOVER */}
      {open && (
        <div className="absolute left-0 bottom-12 mt-3  w-[360px] bg-slate-950 border
            border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50"
        >
          {/* HEADER */}
          <div className=" flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <div>
              <div className="text-white font-semibold">Notifications</div>
              <div className=" text-xs text-slate-500">Latest operational events</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className=" p-1 rounded-lg hover:bg-slate-800">
              <X size={16} className="text-slate-400"/>
            </button>
          </div>
          {/* LIST */}
          <div className=" max-h-[420px] overflow-y-auto">
            {latest.length === 0 && (
              <div className="p-6 text-center text-slate-500 text-sm">No notifications yet</div>
            )}
            {latest.map((item) => (
              <button
                key={item.id}
                className="w-full text-left px-4 py-3 border-b border-slate-900 hover:bg-white dark:bg-slate-900 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {item.type ===
                    "error" ? ( <AlertTriangle size={16} className=" text-red-400"/>
                    ) : item.type ===
                      "success" ? (<CheckCircle2 size={16} className=" text-emerald-400"/>
                    ) : ( <Info size={16} className=" text-blue-400"/>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-white">
                      {item.message}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {item.time}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {/* FOOTER */}
          <div className="p-3 border-t border-slate-800 flex gap-2">
            <button onClick={() => {markAllAsRead();}}
              className=" flex-1 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-800 text-sm text-white"
            >
              Mark all read
            </button>
            <button
              onClick={() => {
                setOpen(false);
                onOpenCenter();
              }}
              className=" flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm text-white"
            >
              View All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}