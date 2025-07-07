'use client';
import { useEffect, useState } from 'react';
import { db, auth } from '@/data/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

import {
  CalendarCheck2,
  MessageSquare,
} from 'lucide-react'; // ✅ Add icons

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const appointmentsQuery = query(
        collection(db, 'appointments'),
        where('doctor', '==', user.displayName)
      );
      const appointmentSnap = await getDocs(appointmentsQuery);
      setAppointments(appointmentSnap.docs);

      const chatQuery = query(
        collection(db, 'conversations'),
        where('doctorName', '==', user.displayName)
      );
      const chatSnap = await getDocs(chatQuery);
      setChats(chatSnap.docs);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow p-6 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-center gap-2 mb-2">
            <CalendarCheck2 size={22} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Appointments</h2>
          </div>
          <p className="text-3xl text-blue-600">{appointments.length}</p>
        </div>

        <div className="bg-white shadow p-6 rounded-lg border-l-4 border-yellow-500">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={22} className="text-yellow-600" />
            <h2 className="text-lg font-semibold text-gray-800">Chats</h2>
          </div>
          <p className="text-3xl text-yellow-600">{chats.length}</p>
        </div>
      </div>
    </div>
  );
}
