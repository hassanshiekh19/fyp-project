// src/components/Profile.js
'use client';
import { useState, useEffect, useRef } from 'react';
import { auth, db } from '@/data/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const CLOUDINARY_PRESET = 'fyp_unsigned';
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dwfeemerx/image/upload';

const Profile = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    profilePicUrl: '',
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(true); // Loading state for user data
  const router = useRouter();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // User is signed in, fetch profile data
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Fetched data:", data); // Add this line to debug

          setUserData((prev) => ({
            ...prev,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            contactNumber: data.contactNumber || '',  // Explicitly set contact number
            profilePicUrl: data.profilePicUrl || '',
          }));
          setPreviewImage(data.profilePicUrl || '/default-avatar.png');
        } else {
          setErrorMessage('No user data found.');
        }
      } else {
        setErrorMessage('No user logged in.');
        router.push('/login');
      }
      setIsLoadingData(false); // Stop loading when data is fetched
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfilePic(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_PRESET);

    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.secure_url) {
      return data.secure_url;
    } else {
      console.error("❌ Cloudinary Upload Error: ", data);
      throw new Error(data.error?.message || 'Cloudinary upload failed');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let updatedProfilePic = userData.profilePicUrl;

      if (newProfilePic) {
        updatedProfilePic = await uploadToCloudinary(newProfilePic);
      }

      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        ...userData,
        profilePicUrl: updatedProfilePic,
      });

      alert('✅ Profile updated successfully.');
      setErrorMessage('');
    } catch (error) {
      console.error('Update error:', error);
      setErrorMessage('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      await auth.signOut();
      router.push('/login');
    }
  };

  // If data is still loading, show a loading state
  if (isLoadingData) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg text-gray-800">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 flex justify-center items-center bg-gray-100 px-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-8">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">👤 Your Profile</h2>

          {errorMessage && (
            <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
          )}

          <div className="flex flex-col items-center mb-6">
            <img
              src={previewImage || '/default-avatar.png'} // Ensure fallback image works
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Upload Image
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              ref={fileInputRef}
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <input
              type="text"
              name="firstName"
              value={userData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
              className="px-4 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="lastName"
              value={userData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              className="px-4 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="email"
              value={userData.email}
              disabled
              className="px-4 py-2 border border-gray-300 bg-gray-100 rounded-md"
            />
            <input
              type="text"
              name="contactNumber"
              value={userData.contactNumber}
              onChange={handleInputChange}
              placeholder="Contact Number"
              className="px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex gap-4 mt-6 w-full">
            <button
              onClick={handleSave}
              disabled={loading}
              className={`w-full py-3 rounded-md text-white font-semibold ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
