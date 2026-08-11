import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import { authApi } from "../api/skillforgeApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("skillforge_user");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(() =>
    Boolean(localStorage.getItem("skillforge_token"))
  );

  useEffect(() => {
    const token = localStorage.getItem("skillforge_token");

    if (!token) {
      return;
    }

    authApi
      .me()
      .then((response) => {
        setUser(response.data);
        localStorage.setItem(
          "skillforge_user",
          JSON.stringify(response.data)
        );
      })
      .catch(() => {
        localStorage.removeItem("skillforge_token");
        localStorage.removeItem("skillforge_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(credentials) {
    const response = await authApi.login(credentials);

    localStorage.setItem(
      "skillforge_token",
      response.data.token
    );

    localStorage.setItem(
      "skillforge_user",
      JSON.stringify(response.data.user)
    );

    setUser(response.data.user);
    return response.data.user;
  }

  async function register(data) {
    const response = await authApi.register(data);
    return response.data;
  }

  function logout() {
    localStorage.removeItem("skillforge_token");
    localStorage.removeItem("skillforge_user");
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}