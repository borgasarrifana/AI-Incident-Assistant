import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
  const stored = localStorage.getItem("user"); // use your actual key
  return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false); // NEW — mark hydration complete

  }, []);

  const login = (userData) => {

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setUser(userData);
  };

  const logout = () => {

    localStorage.removeItem("user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading, // NEW — expose to consumers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}