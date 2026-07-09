import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext();

const TOAST_STYLES = {
  success: {
    icon: CheckCircle2,
    classes:
      "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200",
    iconColor: "text-emerald-500",
  },
  error: {
    icon: XCircle,
    classes:
      "bg-red-50 dark:bg-red-950/80 border-red-300 dark:border-red-800 text-red-800 dark:text-red-200",
    iconColor: "text-red-500",
  },
  info: {
    icon: Info,
    classes:
      "bg-slate-50 dark:bg-slate-900/90 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200",
    iconColor: "text-blue-500",
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "info", duration = 4000) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration > 0) {
        setTimeout(() => dismissToast(id), duration);
      }
      return id;
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}

      {/* TOAST STACK — bottom right */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
        <AnimatePresence>
          {toasts.map((toast) => {
            const meta = TOAST_STYLES[toast.type] ?? TOAST_STYLES.info;
            const Icon = meta.icon;
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.95 }}
                className={`flex items-start gap-2.5 px-4 py-3 rounded-xl border shadow-lg backdrop-blur text-sm ${meta.classes}`}
              >
                <Icon size={17} className={`${meta.iconColor} flex-shrink-0 mt-0.5`} />
                <p className="flex-1 leading-snug">{toast.message}</p>
                <button
                  onClick={() => dismissToast(toast.id)}
                  className="opacity-50 hover:opacity-100 transition flex-shrink-0"
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}