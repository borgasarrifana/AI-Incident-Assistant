import {
  X,
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";

import { useNotifications } from "../context/NotificationContext";
import { useIncident } from "../context/IncidentContext";

export default function NotificationCenter({ open, onClose }) {
  const { notifications, markAsRead } = useNotifications();
  const { incidents, setSelectedIncident } = useIncident();

  if (!open) return null;

  const handleNotificationClick = (item) => {
    markAsRead(item.id);
    if (item.incidentId) {
      const match = incidents.find((i) => i.id === item.incidentId);
      if (match) {
        setSelectedIncident(match);
        onClose(); // close the center so the modal is clearly visible
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
      <div className="w-[420px] h-full bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              Notification Center
            </div>
            <div className="text-sm text-slate-500">
              Operational events and alerts
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        {/* LIST */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-sm">
              No notifications yet
            </div>
          )}

          {notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-4 border-b border-slate-100 dark:border-slate-900 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/60 transition ${
                !item.read ? "bg-blue-50 dark:bg-blue-500/5" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {item.type === "error" ? (
                    <AlertTriangle size={18} className="text-red-400" />
                  ) : item.type === "success" ? (
                    <CheckCircle2 size={18} className="text-emerald-400" />
                  ) : (
                    <Info size={18} className="text-blue-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-slate-900 dark:text-white">
                    {item.message}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {item.createdAt}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}