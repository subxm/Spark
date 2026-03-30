import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const getInitialUser = () => {
    try {
      const item = localStorage.getItem("user");
      return item && item !== "undefined" && item !== "null"
        ? JSON.parse(item)
        : null;
    } catch {
      return null;
    }
  };

  const getInitialToken = () => {
    const item = localStorage.getItem("token");
    return item && item !== "undefined" && item !== "null" ? item : null;
  };

  const [user, setUser] = useState(getInitialUser());
  const [token, setToken] = useState(getInitialToken());

  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
