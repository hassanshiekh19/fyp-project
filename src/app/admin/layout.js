'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import {
  Menu,
  MessageSquare,
  Settings,
  LogOut,
  LayoutDashboard,
  X,
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = getAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Check admin access
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (!u) return router.push('/login');
      if (u.email !== 'admin@aiderma.com') {
        alert('Access denied');
        return router.push('/');
      }
      setUser(u);
    });
    return () => unsub();
  }, []);

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const navLinks = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, href: '/admin' },
    { label: 'Messages', icon: <MessageSquare size={18} />, href: '/admin/messages' },
    { label: 'Theme Settings', icon: <Settings size={18} />, href: '/admin/settings' },
  ];

  if (!user) return <div className="p-4">Checking admin access...</div>;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* 🔹 Top Navbar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl font-bold text-blue-600">AiDerma Admin</h1>
        </div>

        <button
          onClick={logout}
          className="text-sm text-red-600 border border-red-500 px-3 py-1 rounded hover:bg-red-50"
        >
          Logout
        </button>
      </header>

      {/* 🔹 Sidebar (Responsive) */}
      <aside
        className={`fixed top-16 left-0 h-full w-64 bg-white shadow-md z-40 transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <nav className="flex flex-col p-6 space-y-4">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded transition ${
                pathname === item.href
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-200 text-gray-700'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* 🔹 Main Content Area */}
      <main className="pt-20 md:ml-64 p-6 transition-all duration-200">{children}</main>
    </div>
  );
}
