'use client';
import { getDoc, doc } from 'firebase/firestore';
import './login.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db, googleProvider } from '../../data/firebase';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import {
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const sendLoginEmail = async (user) => {
  // 🔍 Fetch full name from Firestore using UID
  const userDoc = await getDoc(doc(db, 'users', user.uid)); // or 'doctors' if needed
  const userData = userDoc.exists() ? userDoc.data() : {};
  const fullName = userData.name || user.displayName || user.email;

  await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: user.email,
      cc: 'admin@aiderma.com',
      name: fullName,
    }),
  });
};

  const detectRoleAndRedirect = async (user) => {
    try {
      const userEmail = user.email;

      // Set displayName from doctors collection if missing
      if (!user.displayName) {
        const doctorQuery = query(collection(db, 'doctors'), where('email', '==', userEmail));
        const doctorSnap = await getDocs(doctorQuery);
        if (!doctorSnap.empty) {
          const doctorData = doctorSnap.docs[0].data();
          if (doctorData?.name) {
            await updateProfile(user, { displayName: doctorData.name });
          }
        }
      }

      // Check admin
      const adminQuery = query(collection(db, 'admin'), where('email', '==', userEmail));
      const adminSnap = await getDocs(adminQuery);
      if (!adminSnap.empty) {
        router.push('/admin');
        return;
      }

      // Check doctor
      const doctorQuery = query(collection(db, 'doctors'), where('email', '==', userEmail));
      const doctorSnap = await getDocs(doctorQuery);
      if (!doctorSnap.empty) {
        router.push('/doctor/dashboard');
        return;
      }

      // Default user route
      router.push('/');
    } catch (err) {
      console.error('Role detection failed:', err);
      setError('Something went wrong while logging in.');
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = cred.user;

      await sendLoginEmail(user);           // ✅ send email
      await detectRoleAndRedirect(user);    // ✅ redirect
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const user = cred.user;

      await sendLoginEmail(user);          // ✅ send email
      await detectRoleAndRedirect(user);   // ✅ redirect
    } catch (err) {
      console.error(err);
      setError('Google login failed');
    }
  };

  return (
    <div className="login-page">
      <Navbar />
      <div className="login-container">
        <div className="login-form">
          <div className="logo-container" style={{ textAlign: 'center' }}>
            <Image src="/images/logo.png" alt="Logo" width={60} height={60} />
          </div>

          <h2 className="login-heading" style={{ textAlign: 'center' }}>
            Log in to your Account
          </h2>
          <p className="login-subheading" style={{ textAlign: 'center' }}>
            Welcome back, please enter your details.
          </p>

          <form onSubmit={handleEmailLogin}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />

            <div className="login-options" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                <input type="checkbox" style={{ marginRight: '5px' }} />
                Remember me
              </label>

              <Link href="/login/forgot-password" className="forgot-password-button">
                <b>Forgot Password?</b>
              </Link>
            </div>
            <br />
            <button type="submit" className="submit-button">
              Log in
            </button>
          </form>

          <div className="divider" style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
            <hr style={{ flex: 1 }} />
            <span style={{ padding: '0 10px', fontSize: '14px', color: '#999' }}>OR</span>
            <hr style={{ flex: 1 }} />
          </div>

          <button onClick={handleGoogleLogin} className="google-login-button">
            <img
              src="/images/google-logo.png"
              alt="Google"
              style={{ width: '20px', marginRight: '10px' }}
            />
            Continue with Google
          </button>

          <div className="signup-link" style={{ marginTop: '15px', textAlign: 'center' }}>
            Don’t have an account?{' '}
            <Link href="/register" className="signup-button">
              <b>Sign Up</b>
            </Link>
          </div>

          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
}
