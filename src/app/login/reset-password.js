'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../../../data/firebase'; // your firebase config

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const oobCode = searchParams.get('oobCode'); // the Firebase code from URL

  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordReset = async () => {
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage('Password has been reset successfully!');
      setTimeout(() => {
        router.push('/'); // or /login
      }, 3000);
    } catch (err) {
      console.error('Reset error:', err);
      setError('Reset failed. The code might be invalid or expired.');
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <h2 className="forgot-password-heading">Set New Password</h2>

        <input
          type="password"
          placeholder="Enter new password"
          className="input-field"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button onClick={handlePasswordReset} className="submit-button">
          Confirm Reset
        </button>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}
