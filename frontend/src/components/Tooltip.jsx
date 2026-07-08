import { useState } from "react";

export default function Tooltip({ children, label, side = "right" }) {
  const [show, setShow] = useState(false);

  const sideCls = {
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
    top:   "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  }[side];

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className={`
            absolute ${sideCls}
            px-2.5 py-1.5 rounded-lg
            bg-white dark:bg-slate-800
            text-slate-900 dark:text-white
            border border-slate-200 dark:border-slate-700
            text-xs whitespace-nowrap
            shadow-xl z-50
            pointer-events-none
          `}
        >
          {label}
        </div>
      )}
    </div>
  );
}