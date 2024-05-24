import React, { createContext, useContext, useEffect, useState } from "react";
import { loginAnonymously, logout } from "../services/authFirebaseService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setUserName(currentUser.displayName);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setUserName(null);
  };

  const handleLoginAnonymously = async (displayName) => {
    const result = await loginAnonymously(displayName);
    setUser(result);
    setUserName(displayName);
    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userName,
        setUser,
        auth,
        handleLogout,
        handleLoginAnonymously,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
