'use client';

import { useEffect, useState } from 'react';
import { db, auth } from '@/data/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const user = auth.currentUser;
      if (!user || !user.email) return;

      const q = query(collection(db, 'appointments'), where('doctorEmail', '==', user.email));
      const snap = await getDocs(q);

      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAppointments(data);
    };

    fetchAppointments();
  }, []);

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">📅 My Booked Appointments</h2>

      {appointments.length === 0 ? (
        <p className="text-gray-500">No appointments found.</p>
      ) : (
        appointments.map(app => (
          <div key={app.id} className="p-4 bg-white dark:bg-gray-800 rounded shadow border border-gray-200 dark:border-gray-600">
            <p><strong>👤 Patient:</strong> {app.patientName}</p>
            <p><strong>📞 Contact:</strong> {app.patientContact}</p>
            <p><strong>🕒 Date:</strong> {new Date(app.date).toLocaleString()}</p>
            <p><strong>📋 Reason:</strong> {app.reasonForVisit}</p>
            <p>
              <strong>📌 Status:</strong>{' '}
              <span className={`font-semibold ${app.status === 'pending' ? 'text-yellow-500' : app.status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>
                {app.status}
              </span>
            </p>
          </div>
        ))
      )}
    </div>
  );
}
