import { auth } from "../firebase-config";
import {
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";

// Autenticación anónima
export const loginAnonymously = async (displayName) => {
  try {
    const result = await signInAnonymously(auth);
    if (result.user) {
      await updateProfile(result.user, { displayName });
      return result.user;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Iniciar sesión con email y contraseña
export const loginWithEmailPassword = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Registro con email y contraseña
export const registerWithEmailPassword = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Cerrar sesión
export const logout = async () => {
  try {
    const result = await signOut(auth);
    return result;
  } catch (error) {
    console.error(error);
  }
};
