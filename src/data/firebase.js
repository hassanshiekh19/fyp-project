// src/firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBoNDoS_aqasG56cIiq6cLDcAC5OQ4jGuA",
  authDomain: "ai-derma-b70ec.firebaseapp.com",
  projectId: "ai-derma-b70ec",
  storageBucket: "ai-derma-b70ec.appspot.com", 
  messagingSenderId: "333164248891",
  appId: "1:333164248891:web:d51d9912e24a3b8d07c11e",
  measurementId: "G-S4EJDPMQSL"
};

// Initialize app only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

if (typeof window !== 'undefined') {
  getAnalytics(app);
}

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, db, createUserWithEmailAndPassword };
