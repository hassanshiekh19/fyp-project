'use client';
import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
} from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { db } from '@/data/firebase';

const AdminDoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialty: '',
    city: '',
    gender: '',
    available: true,
    image: '',
  });

  const [editingDoctor, setEditingDoctor] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchDoctors = async () => {
    const snapshot = await getDocs(collection(db, 'doctors'));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setDoctors(data);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInput = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (doctor) => {
    setEditingDoctor(doctor);
    setEditData({ ...doctor });
  };

  const handleUpdateDoctor = async () => {
    if (!editingDoctor?.id) return;

    try {
      await setDoc(doc(db, 'doctors', editingDoctor.id), {
        ...editData,
        available: editData.available === 'true' || editData.available === true,
      });
      alert('✅ Doctor updated successfully!');
      setEditingDoctor(null);
      fetchDoctors();
    } catch (err) {
      console.error('Update error:', err);
      alert('❌ Failed to update doctor.');
    }
  };

  const handleAddDoctor = async () => {
    const auth = getAuth();
    const adminUser = auth.currentUser;

    if (!formData.email || !formData.password) {
      alert("Email and password are required.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const newUser = userCredential.user;

      await setDoc(doc(db, 'doctors', newUser.uid), {
        uid: newUser.uid,
        name: formData.name,
        email: formData.email,
        specialty: formData.specialty,
        city: formData.city,
        gender: formData.gender,
        available:
          formData.available === 'true' || formData.available === true,
        image: formData.image,
      });

      await signOut(auth);

      const adminPassword = prompt('Re-enter admin password to continue:');
      if (adminUser?.email && adminPassword) {
        await signInWithEmailAndPassword(auth, adminUser.email, adminPassword);
      }

      alert('✅ Doctor added successfully!');
      setFormData({
        name: '',
        email: '',
        password: '',
        specialty: '',
        city: '',
        gender: '',
        available: true,
        image: '',
      });
      fetchDoctors();
    } catch (err) {
      console.error('Error adding doctor:', err.message);
      alert(`❌ Error: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      await deleteDoc(doc(db, 'doctors', id));
      fetchDoctors();
    } catch (err) {
      console.error('Error deleting doctor:', err);
    }
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">👨‍⚕️ Doctor Management Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-gray-800 p-6 rounded shadow mb-10 border">
        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInput} className="p-3 border rounded" />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInput} className="p-3 border rounded" />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInput} className="p-3 border rounded" />
        <input type="text" name="specialty" placeholder="Specialty" value={formData.specialty} onChange={handleInput} className="p-3 border rounded" />
        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleInput} className="p-3 border rounded" />
        <select name="gender" value={formData.gender} onChange={handleInput} className="p-3 border rounded">
          <option value="">Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select name="available" value={formData.available} onChange={handleInput} className="p-3 border rounded">
          <option value="true">Available</option>
          <option value="false">Not Available</option>
        </select>
        <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleInput} className="p-3 border rounded" />
        <button onClick={handleAddDoctor} className="col-span-1 md:col-span-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded hover:bg-blue-700 transition">➕ Add Doctor</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse bg-white dark:bg-gray-800 shadow rounded">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-sm uppercase text-gray-700 dark:text-gray-200">
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Specialty</th>
              <th className="p-3">City</th>
              <th className="p-3">Gender</th>
              <th className="p-3">Available</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.id} className="text-center border-t hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-2">
                  <img src={doctor.image} alt={doctor.name} className="w-12 h-12 rounded-full mx-auto object-cover border" />
                </td>
                <td className="p-2 font-medium">{doctor.name}</td>
                <td className="p-2">{doctor.email}</td>
                <td className="p-2">{doctor.specialty}</td>
                <td className="p-2">{doctor.city}</td>
                <td className="p-2 capitalize">{doctor.gender}</td>
                <td className="p-2">{doctor.available ? '✅' : '❌'}</td>
                <td className="p-2 space-x-2">
                  <button onClick={() => handleEditClick(doctor)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition">Edit</button>
                  <button onClick={() => handleDelete(doctor.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Delete</button>
                </td>
              </tr>
            ))}
            {doctors.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">No doctors found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-xl space-y-4">
            <h2 className="text-xl font-bold mb-4 text-center">✏️ Edit Doctor</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="name" value={editData.name} onChange={handleEditInput} className="p-2 border rounded" />
              <input name="email" value={editData.email} onChange={handleEditInput} className="p-2 border rounded" />
              <input name="specialty" value={editData.specialty} onChange={handleEditInput} className="p-2 border rounded" />
              <input name="city" value={editData.city} onChange={handleEditInput} className="p-2 border rounded" />
              <select name="gender" value={editData.gender} onChange={handleEditInput} className="p-2 border rounded">
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <select name="available" value={editData.available} onChange={handleEditInput} className="p-2 border rounded">
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
              <input name="image" value={editData.image} onChange={handleEditInput} className="p-2 border rounded col-span-2" />
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button onClick={() => setEditingDoctor(null)} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
              <button onClick={handleUpdateDoctor} className="px-4 py-2 bg-blue-600 text-white rounded">Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctorsPage;
