import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || null);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("adminToken", newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("adminToken");
  };

  return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
