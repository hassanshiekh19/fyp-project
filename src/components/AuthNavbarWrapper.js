"use client";

import { useState, useEffect } from "react";
import { auth } from "@/data/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "./Navbar";

const AuthNavbarWrapper = () => {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  if (!authChecked) return null;

  return <Navbar user={user} />;
};

export default AuthNavbarWrapper;
