'use client';
import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/data/firebase';
import toast from 'react-hot-toast';

const AdminAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setAppointments(data);
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'appointments', id), { status: newStatus });
      toast.success(`✅ Appointment ${newStatus}`);
      fetchAppointments();
    } catch (error) {
      console.error(error);
      toast.error('❌ Failed to update status');
    }
  };

  const deleteAppointment = async (id) => {
    const confirmDelete = confirm('Are you sure you want to delete this appointment?');
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'appointments', id));
      toast.success('🗑️ Appointment deleted');
      fetchAppointments();
    } catch (error) {
      console.error(error);
      toast.error('❌ Failed to delete appointment');
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📅 Manage Appointments</h1>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse bg-white dark:bg-gray-800">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-left">
              <th className="p-3">Patient</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Doctor</th>
              <th className="p-3">Date</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id} className="border-t">
                <td className="p-3">{appt.patientName}</td>
                <td className="p-3">{appt.patientContact}</td>
                <td className="p-3">{appt.doctor}</td>
                <td className="p-3">
                  {new Date(appt.date).toLocaleString('en-GB')}
                </td>
                <td className="p-3">{appt.reasonForVisit}</td>
                <td className="p-3 capitalize">
                  {appt.status || 'pending'}
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => updateStatus(appt.id, 'approved')}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(appt.id, 'rejected')}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => deleteAppointment(appt.id)}
                    className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-4">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAppointmentsPage;
