import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Search, Eye } from "lucide-react";

const ROLES = [
  {
    id: "admin",
    label: "Admin",
    description: "Full access to all features",
    icon: ShieldCheck,
  },
  {
    id: "analyst",
    label: "Analyst",
    description: "Analyze incidents and logs",
    icon: Search,
  },
  {
    id: "viewer",
    label: "Viewer",
    description: "Read-only dashboard access",
    icon: Eye,
  },
];

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();

    // MOCK AUTH — role now comes directly from the selector, not the email
    const mockUser = {
      email,
      role,
    };

    login(mockUser);

    navigate("/");
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Ops Platform</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Sign in to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full p-3 rounded-xl
                bg-slate-50 dark:bg-slate-950
                border border-slate-300 dark:border-slate-700
                text-slate-900 dark:text-white
                placeholder-slate-400 dark:placeholder-slate-500
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full p-3 rounded-xl
                bg-slate-50 dark:bg-slate-950
                border border-slate-300 dark:border-slate-700
                text-slate-900 dark:text-white
                placeholder-slate-400 dark:placeholder-slate-500
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
              placeholder="••••••••"
              required
            />
          </div>

          {/* ROLE SELECTOR */}
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-300 mb-2">
              Sign in as
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => {
                const Icon = r.icon;
                const active = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`
                      flex flex-col items-center gap-1.5
                      p-3 rounded-xl border transition
                      ${
                        active
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500"
                      }
                    `}
                  >
                    <Icon size={18} />
                    <span className="text-xs font-medium">{r.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {ROLES.find((r) => r.id === role)?.description}
            </p>
          </div>

          <button
            type="submit"
            className="
              w-full py-3 rounded-xl
              bg-blue-600 hover:bg-blue-700
              text-white font-medium
              transition
            "
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}