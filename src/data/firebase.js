// src/data/firebase.js

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBoNDoS_aqasG56cIiq6cLDcAC5OQ4jGuA",
  authDomain: "ai-derma-b70ec.firebaseapp.com",
  projectId: "ai-derma-b70ec",
  storageBucket: "ai-derma-b70ec.appspot.com",
  messagingSenderId: "333164248891",
  appId: "1:333164248891:web:d51d9912e24a3b8d07c11e",
  measurementId: "G-S4EJDPMQSL"
};

// Initialize Firebase app only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Ensuring Firebase Analytics is initialized only on the client side
if (typeof window !== 'undefined') {
  getAnalytics(app); // Firebase Analytics initialization
}

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

// Set Firebase Authentication Persistence to LOCAL (so the user stays logged in after refresh)
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence)
    .catch((error) => {
      console.error('Error setting persistence:', error);
    });
}

// Export the necessary Firebase utilities for use in your components
export { auth, googleProvider, db, onAuthStateChanged };
