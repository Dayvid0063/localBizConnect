import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check for stored authentication state on initial load
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [user, setUser] = useState(null);

  const login = (userData) => {
    // Set isLoggedIn to true and store in browser storage
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    // Set user data
    setUser(userData);
  };

  const logout = () => {
    // Set isLoggedIn to false and remove from browser storage
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    // Clear user data
    setUser(null);
    window.location.reload(true);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
