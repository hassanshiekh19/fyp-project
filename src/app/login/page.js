'use client';

import './login.css'; // Adjust the path based on where the file is
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, googleProvider } from '../../data/firebase';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import Navbar from '@/components/Navbar'; // Import the Navbar component

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isResetEmailSent, setIsResetEmailSent] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isResetFlow, setIsResetFlow] = useState(false);

  // Email/password login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/'); // Redirect to home
    } catch (err) {
      setError(err.message);
    }
  };

  // Google login
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/');
    } catch (err) {
      setError(err.message);
    }
  };

  // Optional password reset logic in this file
  const handleResetPassword = async (resetCode, newPassword) => {
    try {
      await auth.confirmPasswordReset(resetCode, newPassword);
      setIsResetFlow(false);
      setError('');
      router.push('/login');
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <Navbar />

      <div className="login-container">
        <div className="login-form">
          <h2 className="login-heading">{isResetFlow ? 'Reset Your Password' : 'Login'}</h2>

          {!isResetFlow ? (
            <form onSubmit={handleEmailLogin}>
              <input
                type="email"
                placeholder="Email"
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
              <button type="submit" className="submit-button">
                Login
              </button>
            </form>
          ) : (
            // Password reset flow UI
            <div>
              <input
                type="text"
                placeholder="Enter Verification Code"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
              <button
                type="button"
                onClick={() => handleResetPassword(email, password)}
                className="submit-button"
              >
                Set New Password
              </button>
            </div>
          )}

          {/* ✅ Forgot Password Button FIXED */}
          <div className="forgot-password">
            <button
              type="button"
              onClick={() => router.push('/login/forgot-password')} // ✅ Corrected path
              className="forgot-password-button"
            >
              Forgot Password?
            </button>
          </div>

          {isResetEmailSent && !isEmailSent && (
            <p className="success-message">Password reset email sent! Check your inbox.</p>
          )}
          {error && <p className="error-message">{error}</p>}

          <button onClick={handleGoogleLogin} className="google-login-button">
            <img
              src="./images/google-logo.png"
              alt="Google Logo"
              style={{ width: '20px', marginRight: '8px' }}
            />
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
}
