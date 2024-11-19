import React, { createContext, useContext, useEffect, useState } from "react";
import { loginAnonymously, logout, loginWithEmailPassword, registerWithEmailPassword } from "../services/authFirebaseService";
import { onAuthStateChanged, EmailAuthProvider, linkWithCredential } from "firebase/auth";
import { auth } from "../firebase-config";

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

  const handleRegisterWithEmail = async (email, password) => {
    const result = await registerWithEmailPassword(email, password);
    setUser(result.user);
    setUserName(result.user.displayName);
    return result.user;
  };

  const handleLoginWithEmail = async (email, password) => {
    const result = await loginWithEmailPassword(email, password);
    setUser(result.user);
    setUserName(result.user.displayName);
    return result.user;
  };

  const handleLinkAnonymousAccount = async (email, password) => {
    const credential = EmailAuthProvider.credential(email, password);
    if (user.isAnonymous) {
      const result = await linkWithCredential(user, credential);
      setUser(result.user);
      setUserName(result.user.displayName);
      return result.user;
    } else {
      throw new Error("User is not anonymous");
    }
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
        handleRegisterWithEmail,
        handleLoginWithEmail,
        handleLinkAnonymousAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
