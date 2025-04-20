// pages/forgot-password.js

'use client';
import './forgot-password.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../../data/firebase'; // Firebase initialization
import { sendPasswordResetEmail } from 'firebase/auth';
import Navbar from '@/components/Navbar'; // Navbar component

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isResetEmailSent, setIsResetEmailSent] = useState(false);

  // Handle sending reset password email
  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setIsResetEmailSent(true);
      setError('');
    } catch (err) {
      console.error('Error sending reset email: ', err);
      setError('Failed to send password reset email. Please try again.');
    }
  };

  return (
    <div className="forgot-password-page">
      <Navbar />
      <div className="forgot-password-container">
        <div className="forgot-password-form">
          <h2 className="forgot-password-heading">Forgot Password</h2>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
          <button onClick={handleForgotPassword} className="submit-button">
            Reset Password
          </button>

          {/* Display success or error message */}
          {isResetEmailSent && <p className="success-message">Password reset email sent! Check your inbox.</p>}
          {error && <p className="error-message">{error}</p>}

          <button onClick={() => router.push('/login')} className="back-to-login-button">
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
