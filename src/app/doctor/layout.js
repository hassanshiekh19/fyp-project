'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { auth } from '@/data/firebase';

import {
  LayoutDashboard,
  CalendarCheck2,
  MessageSquare,
  UserCircle2,
} from 'lucide-react';

const DoctorLayout = ({ children }) => {
  const pathname = usePathname();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      window.location.href = '/login';
    }
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', path: '/doctor/appointments', icon: CalendarCheck2 },
    { name: 'Chat', path: '/doctor/chat', icon: MessageSquare },
    { name: 'Profile', path: '/doctor/profile', icon: UserCircle2 },
  ];

  return (
    <div className="flex min-h-screen font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-700 text-white p-6 shadow-xl">
        <h2 className="text-3xl font-bold mb-10 text-center tracking-wide">Doctor Panel</h2>
        <nav>
          <ul className="space-y-4">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      pathname === item.path
                        ? 'bg-blue-600 shadow-md'
                        : 'hover:bg-blue-800'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main content area */}
      <main className="flex-1 bg-gray-100 p-8">
        {/* Top bar */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, Doctor</h1>
          <p className="text-gray-500">Here is your control panel</p>
        </header>

        {/* Clickable Dashboard Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/doctor/dashboard">
            <div className="cursor-pointer bg-white shadow rounded-lg p-6 border-l-4 border-blue-500 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-2">
                <LayoutDashboard size={22} className="text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-700">Dashboard</h2>
              </div>
              <p className="text-sm text-gray-500">Overview of your activity</p>
            </div>
          </Link>

          <Link href="/doctor/appointments">
            <div className="cursor-pointer bg-white shadow rounded-lg p-6 border-l-4 border-green-500 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-2">
                <CalendarCheck2 size={22} className="text-green-600" />
                <h2 className="text-xl font-semibold text-gray-700">Appointments</h2>
              </div>
              <p className="text-sm text-gray-500">View and manage bookings</p>
            </div>
          </Link>

          <Link href="/doctor/chat">
            <div className="cursor-pointer bg-white shadow rounded-lg p-6 border-l-4 border-yellow-500 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare size={22} className="text-yellow-600" />
                <h2 className="text-xl font-semibold text-gray-700">Chat</h2>
              </div>
              <p className="text-sm text-gray-500">Talk with your patients</p>
            </div>
          </Link>

          <Link href="/doctor/profile">
            <div className="cursor-pointer bg-white shadow rounded-lg p-6 border-l-4 border-purple-500 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-2">
                <UserCircle2 size={22} className="text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-700">Profile</h2>
              </div>
              <p className="text-sm text-gray-500">Edit your doctor profile</p>
            </div>
          </Link>
        </section>

        {/* Child content renders here */}
        <div className="bg-white p-6 rounded-lg shadow">{children}</div>
      </main>
    </div>
  );
};

export default DoctorLayout;
