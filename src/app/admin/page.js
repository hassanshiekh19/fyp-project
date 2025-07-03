'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/data/firebase'; // Adjust path if needed
import {
  Users,
  Mail,
  Calendar,
  BrainCircuit,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    messages: 0,
    appointments: 0,
    aiUsage: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const messagesSnap = await getDocs(collection(db, 'messages'));
        const appointmentsSnap = await getDocs(collection(db, 'appointments'));

        setStats({
          users: usersSnap.size,
          messages: messagesSnap.size,
          appointments: appointmentsSnap.size,
          aiUsage: messagesSnap.size * 1.25, // fake metric for fun
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      label: 'Total Users',
      value: stats.users,
      icon: <Users size={28} />,
      color: 'bg-blue-100 text-blue-800',
    },
    {
      label: 'Messages',
      value: stats.messages,
      icon: <Mail size={28} />,
      color: 'bg-green-100 text-green-800',
    },
    {
      label: 'Appointments',
      value: stats.appointments,
      icon: <Calendar size={28} />,
      color: 'bg-yellow-100 text-yellow-800',
    },
    {
      label: 'AI Usage',
      value: stats.aiUsage,
      icon: <BrainCircuit size={28} />,
      color: 'bg-purple-100 text-purple-800',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">📊 Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-lg shadow bg-white hover:shadow-lg transition border-t-4 ${card.color}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase">{card.label}</p>
                <h2 className="text-2xl font-bold">{card.value}</h2>
              </div>
              {card.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
