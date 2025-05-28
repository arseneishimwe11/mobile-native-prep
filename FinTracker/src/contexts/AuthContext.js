import React, { createContext, useState, useContext } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);
    const result = await authService.login(username);

    if (result.success) {
      // IMPORTANT: Client-side password check as required by mock API structure
      // This is insecure and should NOT be done in a real application.
      if (result.user.password === password) {
        setUser(result.user);
        setIsLoggedIn(true);
        setError(null);
      } else {
        setError("Invalid username or password.");
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setError(result.error || "Login failed. Please try again.");
      setIsLoggedIn(false);
      setUser(null);
    }
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setError(null);
    // In a real app, you might also clear tokens here
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, isLoading, error, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
