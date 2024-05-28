import React, { createContext, useContext, useEffect, useState } from "react";
import { loginAnonymously, logout } from "../services/authFirebaseService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { useLoading } from "./LoadingContext";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setUserName(currentUser ? currentUser.displayName : null);
      setLoading(false);
    });
    return () => {
      unsubscribe();
      setLoading(true);
    };
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
        loading,
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
