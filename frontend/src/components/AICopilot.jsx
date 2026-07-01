import { Bot } from "lucide-react";
import { useState } from "react";

export default function AICopilot() {

  const [open, setOpen] =
    useState(false);

  return (

    <>

      <button
        onClick={() => setOpen(!open)}
        className="
          fixed bottom-8 right-8
          w-16 h-16
          rounded-full
          bg-blue-600
          text-white
          shadow-2xl
          z-50
        "
      >

        <Bot />

      </button>

      {open && (

        <div className="
          fixed bottom-28 right-8
          w-[400px]
          h-[500px]
          bg-slate-900
          border border-slate-800
          rounded-3xl
          shadow-2xl
          p-6
          z-50
        ">

          <div className="
            text-xl text-white
            font-bold
          ">
            AI Copilot
          </div>

        </div>

      )}

    </>

  );

}