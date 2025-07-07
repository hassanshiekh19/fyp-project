'use client';

import { useEffect, useState } from 'react';
import { db, auth } from '@/data/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from 'firebase/firestore';
import {
  signOut,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from 'firebase/auth';

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState({
    name: '',
    city: '',
    specialty: '',
    about: '',
    available: true,
    image: '',
  });

  const [docId, setDocId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      let q = query(collection(db, 'doctors'), where('uid', '==', user.uid));
      let snap = await getDocs(q);

      if (snap.empty) {
        q = query(collection(db, 'doctors'), where('email', '==', user.email));
        snap = await getDocs(q);
      }

      if (!snap.empty) {
        const ref = snap.docs[0];
        setDocId(ref.id);
        setProfile(ref.data());
      } else {
        console.warn('No doctor profile found for this user.');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePasswordInput = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setUploading(false);

      if (res.ok) {
        setProfile((prev) => ({
          ...prev,
          image: data.path,
        }));
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      setUploading(false);
      console.error(err);
      alert('Image upload error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!docId) return alert('Profile document not found.');

    await updateDoc(doc(db, 'doctors', docId), {
      ...profile,
      uid: user.uid,
      email: user.email,
    });

    setMessage('✅ Profile updated successfully!');
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/login'; // Redirect to login
  };

  const handlePasswordChange = async () => {
    const { current, new: newPass, confirm } = passwordForm;
    if (!current || !newPass || !confirm) {
      return alert('All password fields are required.');
    }
    if (newPass !== confirm) {
      return alert('New passwords do not match.');
    }

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, current);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPass);
      setPasswordForm({ current: '', new: '', confirm: '' });
      alert('✅ Password updated successfully.');
    } catch (err) {
      console.error(err);
      alert('❌ Incorrect current password or error updating.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-blue-700">👨‍⚕️ Doctor Profile</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            🔒 Logout
          </button>
        </div>

        {message && (
          <p className="bg-green-100 text-green-800 p-3 mb-4 rounded text-sm">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-semibold">Full Name</label>
            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Dr. Hassan"
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">City</label>
              <input
                name="city"
                value={profile.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Specialty</label>
              <input
                name="specialty"
                value={profile.specialty}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold">About You</label>
            <textarea
              name="about"
              value={profile.about}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md resize-none h-24"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Profile Picture</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {uploading && <p className="text-blue-500 mt-1">Uploading...</p>}
            {profile.image && (
              <img
                src={profile.image}
                alt="Preview"
                className="mt-4 w-32 h-32 object-cover rounded-full border"
              />
            )}
          </div>

          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              name="available"
              checked={profile.available}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <span className="text-sm">Available for Appointments</span>
          </label>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            💾 Save Changes
          </button>
        </form>

        {/* Change Password Section */}
        <div className="mt-10 border-t pt-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">🔐 Change Password</h3>
          <div className="space-y-4">
            <input
              type="password"
              name="current"
              value={passwordForm.current}
              onChange={handlePasswordInput}
              placeholder="Current Password"
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="password"
              name="new"
              value={passwordForm.new}
              onChange={handlePasswordInput}
              placeholder="New Password"
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="password"
              name="confirm"
              value={passwordForm.confirm}
              onChange={handlePasswordInput}
              placeholder="Confirm New Password"
              className="w-full px-4 py-2 border rounded-md"
            />
            <button
              onClick={handlePasswordChange}
              className="w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition"
            >
              🔁 Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
