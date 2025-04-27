'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from '@/data/firebase'; // Firebase import for user data
import { onAuthStateChanged } from 'firebase/auth'; // Firebase method to track auth state

const Navbar = () => {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null); // Store the user data

  useEffect(() => {
    // 1. Firebase listener for auth state change
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Set the user info if logged in
      } else {
        setUser(null); // Set to null if not logged in
      }
    });

    // 2. Initial auth state check on page load
    const initialUser = auth.currentUser; // Check if user is already authenticated
    if (initialUser) {
      setUser(initialUser); // If logged in, set the user
    }

    // 3. Cleanup the listener on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array means this effect runs once on component mount

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    if (isHome) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setIsScrolled(true); // for non-home pages
    }
  }, [isHome]);

  const navBg = isHome && !isScrolled ? 'bg-transparent' : 'bg-white shadow';
  const linkColor = isHome && !isScrolled ? 'text-white' : 'text-gray-800';
  const logoColor = isHome && !isScrolled ? 'text-white' : 'text-blue-600';

  // Add scroll-to-top behavior
  const handleScrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <nav className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Only (No Name/Text) */}
          <Link href="/" className={`flex items-center ${logoColor}`} onClick={handleScrollToTop}>
            <img
              src="/images/logo.png" // Ensure the path is correct
              alt="AI Derma Logo"
              className="h-40 w-40 sm:h-48 sm:w-48 md:h-48 md:w-48 xl:h-56 xl:w-56"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            {[ 
              { href: '/', label: 'Home' },
              { href: '/services', label: 'Our Services' },
              { href: '/team', label: 'Our Team' },
              { href: '/careers', label: 'Careers' },
              { href: '/blog', label: 'Blog' },
              { href: '/contact', label: 'Contact Us' },
              user ? { href: '/profile', label: user.displayName || 'Profile' } : null, // Show profile if user is logged in
            ]
              .filter(Boolean)
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-medium hover:text-blue-600 ${linkColor} ${pathname === link.href ? 'text-blue-600' : ''}`}
                  onClick={handleScrollToTop}
                >
                  {link.label}
                </Link>
              ))}

            {/* Show Book Appointment link only once */}
            {user ? (
              <Link
                href="/book-appointment"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                onClick={handleScrollToTop}
              >
                Book an Appointment
              </Link>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                onClick={handleScrollToTop}
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`focus:outline-none ${linkColor}`}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor">
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className={`md:hidden bg-white shadow-lg px-4 py-3 space-y-2 transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'
          }`}
        >
          {[ 
            { href: '/', label: 'Home' },
            { href: '/services', label: 'Our Services' },
            { href: '/team', label: 'Our Team' },
            { href: '/careers', label: 'Careers' },
            { href: '/blog', label: 'Blog' },
            { href: '/contact', label: 'Contact Us' },
            user ? { href: '/profile', label: user.displayName || 'Profile' } : null, // Show profile if user is logged in
          ]
            .filter(Boolean)
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-gray-800 hover:text-blue-600"
                onClick={handleScrollToTop}
              >
                {link.label}
              </Link>
            ))}

          {/* Show Book Appointment link only once in mobile */}
          {user ? (
            <Link
              href="/book-appointment"
              className="block bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700"
              onClick={handleScrollToTop}
            >
              Book an Appointment
            </Link>
          ) : (
            <Link
              href="/login"
              className="block bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700"
              onClick={handleScrollToTop}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
