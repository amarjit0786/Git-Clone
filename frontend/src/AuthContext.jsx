import React, {
  createContext,
  use,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUSer] = useState(null);
  useEffect(() => {
    // check if user is logged in
    const userId = localStorage.getItem("userId");
    if (userId) {
      setCurrentUSer(userId);
    }
  }, []);

  const value = {
    currentUser,
    setCurrentUSer,
  };
  return <AuthContext.Provider value={value} >{children}</AuthContext.Provider>
};
