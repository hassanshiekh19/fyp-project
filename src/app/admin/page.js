'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import {
  Users,
  Mail,
  Calendar,
  BrainCircuit,
  Stethoscope,
  FileText,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { db } from '@/data/firebase';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    messages: 0,
    appointments: 0,
    doctors: 0,
    aiUsage: 0,
  });

  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const messagesSnap = await getDocs(collection(db, 'conversations'));
        const appointmentsSnap = await getDocs(collection(db, 'appointments'));
        const doctorsSnap = await getDocs(collection(db, 'doctors')); // 🔁 Firestore doctor collection

        setStats({
          users: usersSnap.size,
          messages: messagesSnap.size,
          appointments: appointmentsSnap.size,
          doctors: doctorsSnap.size || 0,
          aiUsage: messagesSnap.size * 1.25, // fake metric
        });
      } catch (err) {
        console.error('Error fetching admin stats:', err);
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
      route: '/admin/users',
    },
    {
      label: 'Messages',
      value: stats.messages,
      icon: <Mail size={28} />,
      color: 'bg-green-100 text-green-800',
      route: '/admin/chats',
    },
    {
      label: 'Appointments',
      value: stats.appointments,
      icon: <Calendar size={28} />,
      color: 'bg-yellow-100 text-yellow-800',
      route: '/admin/appointments',
    },
    {
      label: 'AI Usage',
      value: stats.aiUsage,
      icon: <BrainCircuit size={28} />,
      color: 'bg-purple-100 text-purple-800',
      route: '/admin/ai-insights',
    },
    {
      label: 'Doctors',
      value: stats.doctors,
      icon: <Stethoscope size={28} />,
      color: 'bg-pink-100 text-pink-800',
      route: '/admin/doctors',
    },
    {
      label: 'Theme Settings',
      value: 'Live Preview',
      icon: <Settings size={28} />,
      color: 'bg-orange-100 text-orange-800',
      route: '/admin/settings/theme',
    },
    {
      label: 'Reports',
      value: 'Export CSV',
      icon: <FileText size={28} />,
      color: 'bg-gray-100 text-gray-800',
      route: '/admin/reports',
    },
    {
      label: 'Admin Settings',
      value: 'Super Access',
      icon: <ShieldCheck size={28} />,
      color: 'bg-red-100 text-red-800',
      route: '/admin/settings',
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold mb-8">🧠 Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => router.push(card.route)}
            className={`p-6 rounded-lg shadow bg-white hover:shadow-xl transition border-l-4 ${card.color} cursor-pointer`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase">{card.label}</p>
                <h2 className="text-xl font-bold">{card.value}</h2>
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
