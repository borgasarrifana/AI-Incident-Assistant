import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleLogin = (e) => {

    e.preventDefault();

    // MOCK AUTH
    const mockUser = {
      email,
      role:
        email === "admin@example.com"
          ? "admin"
          : email === "analyst@example.com"
          ? "analyst"
          : "viewer",
    };

    login(mockUser);

    navigate("/");
  };

  return (

    <div className=" min-h-screen flex items-center justify-center bg-slate-950 p-6 ">
      <div className=" w-full max-w-md bg-white dark:bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className=" text-3xl font-bold text-white">AI Ops Platform</h1>
          <p className=" text-slate-400 mt-2">Sign in to continue</p>
        </div>
        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <div>
            <label className=" block text-sm text-slate-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="
                w-full p-3 rounded-xl
                bg-slate-950
                border border-slate-700
                text-white
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
              placeholder="admin@example.com"
              required
            />

          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="
                w-full p-3 rounded-xl
                bg-slate-950
                border border-slate-700
                text-white
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
              placeholder="••••••••"
              required
            />
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