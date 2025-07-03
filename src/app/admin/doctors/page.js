'use client';
import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '@/data/firebase';

const AdminDoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    city: '',
    gender: '',
    available: true,
    image: '',
  });

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

  const handleAddDoctor = async () => {
    try {
      await addDoc(collection(db, 'doctors'), {
        ...formData,
        available: formData.available === 'true' || formData.available === true,
      });
      setFormData({ name: '', specialty: '', city: '', gender: '', available: true, image: '' });
      fetchDoctors();
    } catch (err) {
      console.error('Error adding doctor:', err);
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'doctors', id));
    fetchDoctors();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🧑‍⚕️ Manage Doctors</h1>

      {/* Add Doctor Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-gray-800 p-6 rounded shadow mb-8">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInput} className="p-2 border rounded" />
        <input type="text" name="specialty" placeholder="Specialty" value={formData.specialty} onChange={handleInput} className="p-2 border rounded" />
        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleInput} className="p-2 border rounded" />
        <select name="gender" value={formData.gender} onChange={handleInput} className="p-2 border rounded">
          <option value="">Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select name="available" value={formData.available} onChange={handleInput} className="p-2 border rounded">
          <option value="true">Available</option>
          <option value="false">Not Available</option>
        </select>
        <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleInput} className="p-2 border rounded" />
        <button onClick={handleAddDoctor} className="col-span-1 md:col-span-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          ➕ Add Doctor
        </button>
      </div>

      {/* Doctor List Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse bg-white dark:bg-gray-800">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Specialty</th>
              <th className="p-3">City</th>
              <th className="p-3">Gender</th>
              <th className="p-3">Available</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.id} className="text-center border-t">
                <td className="p-2">
                  <img src={doctor.image} alt="doctor" className="w-12 h-12 rounded-full mx-auto object-cover" />
                </td>
                <td className="p-2">{doctor.name}</td>
                <td className="p-2">{doctor.specialty}</td>
                <td className="p-2">{doctor.city}</td>
                <td className="p-2 capitalize">{doctor.gender}</td>
                <td className="p-2">{doctor.available ? '✅' : '❌'}</td>
                <td className="p-2">
                  <button onClick={() => handleDelete(doctor.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {doctors.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No doctors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDoctorsPage;
