import React, { createContext, useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  updateProfile,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import axios from "axios";
import { app } from "../firebase/firebase.config";

export const AuthContext = createContext(null);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Firebase user
  const [userInfo, setUserInfo] = useState(null); // Backend user data (role, coins)
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch user profile from your backend
  const fetchUserProfile = async (email) => {
    try {
      const response = await axios.get(
        `https://mini-hive-server.vercel.app/users/profile?email=${email}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      return null;
    }
  };

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser?.email) {
        setUser(currentUser);
        const profile = await fetchUserProfile(currentUser.email);
        setUserInfo(profile);
      } else {
        setUser(null);
        setUserInfo(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔐 Auth Functions
  const authInfo = {
    user,
    userInfo,
    loading,

    createUser: (email, password) => {
      setLoading(true);
      return createUserWithEmailAndPassword(auth, email, password);
    },

    signIn: async (email, password) => {
      setLoading(true);
      try {
        await setPersistence(auth, browserSessionPersistence); // 🔐 Session ends on browser close
        return await signInWithEmailAndPassword(auth, email, password);
      } finally {
        setLoading(false);
      }
    },

    googleSignIn: async () => {
      setLoading(true);
      try {
        await setPersistence(auth, browserSessionPersistence); // 🔐 Google login ends on browser close
        return await signInWithPopup(auth, googleProvider);
      } finally {
        setLoading(false);
      }
    },

    updateProfile: (profile) => {
      return updateProfile(auth.currentUser, profile);
    },

    logOut: () => {
      setLoading(true);
      return signOut(auth);
    },
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};
