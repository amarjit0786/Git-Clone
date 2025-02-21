import React, { useState, useEffect, createContext, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    //check if user is logged in
    const userId = localStorage.getItem("userId");
    if (userId) {
      setCurrentUser(userId);
    }
  }, []);
  const value = { currentUser, setCurrentUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
