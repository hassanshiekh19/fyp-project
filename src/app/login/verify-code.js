// pages/verify-code.js
'use client';

import './login.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../data/firebase'; 
import { confirmPasswordReset } from 'firebase/auth';
import Navbar from '@/components/Navbar';

export default function VerifyCodePage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle code verification and password reset
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use the verification code to confirm the reset and change the password
      await confirmPasswordReset(auth, verificationCode, newPassword);
      setSuccess('Your password has been successfully reset!');
      setError('');
      setTimeout(() => {
        router.push('/login'); // Redirect to login page after password reset
      }, 3000);
    } catch (err) {
      setError('Failed to reset password. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="verify-code-page">
      <Navbar />
      <div className="verify-code-container">
        <h2>Enter Verification Code</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter the verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
            className="input-field"
          />
          <input
            type="password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="input-field"
          />
          <button type="submit" className="submit-button">
            Reset Password
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>
    </div>
  );
}
