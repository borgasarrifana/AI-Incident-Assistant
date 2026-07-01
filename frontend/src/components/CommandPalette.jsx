import {Command} from "cmdk";

import {useEffect, useState,} from "react";

export default function CommandPalette() {

  const [open, setOpen] =
    useState(false);

  useEffect(() => {

    const down = (e) => {

      if (
        (e.metaKey || e.ctrlKey) &&
        e.key === "k"
      ) {

        e.preventDefault();

        setOpen((open) => !open);
      }
    };

    document.addEventListener(
      "keydown",
      down
    );

    return () =>
      document.removeEventListener(
        "keydown",
        down
      );

  }, []);

  if (!open) return null;

  return (

    <div className="
      fixed inset-0 z-[999]
      bg-black/50
      backdrop-blur-sm
      flex items-start
      justify-center
      pt-32
    ">

      <Command
        className="
          w-full max-w-2xl
          rounded-2xl
          bg-white dark:bg-slate-900
          border border-slate-700
          overflow-hidden
          shadow-2xl
        "
      >

        <Command.Input
          placeholder="
            Search incidents,
            dashboards,
            users...
          "
          className="
            w-full px-5 py-4
            bg-transparent
            outline-none
            text-white
          "
        />

        <Command.List
          className="
            max-h-[400px]
            overflow-y-auto
          "
        >

          <Command.Item
            className="
              px-5 py-3
              hover:bg-slate-800
              cursor-pointer
              text-white
            "
          >
            Go to Dashboard
          </Command.Item>

          <Command.Item
            className="
              px-5 py-3
              hover:bg-slate-800
              cursor-pointer
              text-white
            "
          >
            Open Incidents
          </Command.Item>

        </Command.List>

      </Command>

    </div>
  );
}