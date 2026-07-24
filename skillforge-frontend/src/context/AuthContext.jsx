import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import authService from "../services/authServices";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    authService.getCurrentUser()
  );

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    setUser(response.user);

    return response.user;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const contextValue = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}