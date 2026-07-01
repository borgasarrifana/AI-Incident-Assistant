import logo from "../assets/aiops-logo.png";

import { useAuth } from "../context/AuthContext";

import NotificationCenter from "./NotificationCenter";

export default function Header() {

  const { user, logout } = useAuth();

  return (

    <header className="
      h-20 border-b border-slate-800
      bg-slate-950
      flex items-center justify-between
      px-6
    ">

      <div className="flex items-center gap-4">

        <img
          src={logo}
          alt="AI Ops Logo"
          className="w-12 h-12 rounded-xl"
        />

        <div>

          <h1 className="
            text-2xl font-bold text-white
          ">
            AI Incident Assistant
          </h1>

          <p className="
            text-slate-400 text-sm
          ">
            AI-powered operational intelligence
          </p>

        </div>

      </div>

      <div className="flex items-center gap-3">

        <span className="
          px-3 py-1 rounded-full
          bg-blue-600 text-white
          text-sm capitalize
        ">
          {user?.role}
        </span>

        <NotificationCenter />

        <button
          onClick={logout}
          className="
            px-4 py-2 rounded-xl
            bg-red-600 hover:bg-red-700
            text-white text-sm
          "
        >
          Logout
        </button>

      </div>

    </header>
  );
}