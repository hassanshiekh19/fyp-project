'use client';

import './login.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, googleProvider } from '../../data/firebase';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link'; // ✅ Import Link

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isResetFlow, setIsResetFlow] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get('redirectTo') || '/';
      router.push(redirectTo);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get('redirectTo') || '/';
      router.push(redirectTo);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <Navbar />

      <div className="login-container">
        <div className="login-form">
          {/* Logo */}
          <div className="logo-container" style={{ textAlign: 'center' }}>
            <Image src="/images/logo.png" alt="Logo" width={60} height={60} />
          </div>

          {/* Heading */}
          <h2 className="login-heading" style={{ textAlign: 'center' }}>Log in to your Account</h2>
          <p className="login-subheading" style={{ textAlign: 'center' }}>
            Welcome back, please enter your details.
          </p>

          {/* Form */}
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

            {/* Remember Me & Forgot Password */}
            <div className="login-options" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                <input type="checkbox" style={{ marginRight: '5px' }} />
                Remember me
              </label>

              {/* ✅ Link instead of button */}
              <Link href="/login/forgot-password" className="forgot-password-button">
                <b>Forgot Password?</b>
              </Link>
            </div>
              <br></br>
            {/* CTA */}
            <button type="submit" className="submit-button">
              Log in
            </button>
          </form>

          {/* Divider */}
          <div className="divider" style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
            <hr style={{ flex: 1 }} />
            <span style={{ padding: '0 10px', fontSize: '14px', color: '#999' }}>OR</span>
            <hr style={{ flex: 1 }} />
          </div>

          {/* Google Login */}
          <button onClick={handleGoogleLogin} className="google-login-button">
            <img
              src="/images/google-logo.png"
              alt="Google"
              style={{ width: '20px', marginRight: '10px' }}
            />
            Continue with Google
          </button>

          {/* Sign Up */}
          <div className="signup-link" style={{ marginTop: '15px', textAlign: 'center' }}>
            Don’t have an account?{' '}
            {/* ✅ Link instead of button */}
            <Link href="/register" className="signup-button">
              <b>Sign Up</b>
            </Link>
          </div>

          {/* Error */}
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
}
