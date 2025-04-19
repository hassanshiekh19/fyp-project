// components/Navbar.js
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className={`font-bold text-2xl ${scrolled ? 'text-blue-600' : 'text-white'}`}>MediCare</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className={`${scrolled ? 'text-gray-800' : 'text-white'} hover:text-blue-500 font-medium`}>
              Home
            </Link>
            <Link href="/services" className={`${scrolled ? 'text-gray-800' : 'text-white'} hover:text-blue-500 font-medium`}>
              Services
            </Link>
            <Link href="/doctors" className={`${scrolled ? 'text-gray-800' : 'text-white'} hover:text-blue-500 font-medium`}>
              Doctors
            </Link>
            <Link href="/about" className={`${scrolled ? 'text-gray-800' : 'text-white'} hover:text-blue-500 font-medium`}>
              About Us
            </Link>
            <Link href="/contact" className={`${scrolled ? 'text-gray-800' : 'text-white'} hover:text-blue-500 font-medium`}>
              Contact
            </Link>
            <Link href="/register" className={`${scrolled ? 'text-gray-800' : 'text-white'} hover:text-blue-500 font-medium`}>
              Register
            </Link>
            <Link href="src\components\login.js" className={`${scrolled ? 'text-gray-800' : 'text-white'} hover:text-blue-500 font-medium`}>
              Login
            </Link>
            <Link href="/appointment" className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition duration-300 font-medium">
              Appointment
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${scrolled ? 'text-gray-800' : 'text-white'} focus:outline-none`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-white shadow-lg`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/" className="block px-3 py-2 rounded-md text-gray-800 hover:bg-blue-50 hover:text-blue-600">
            Home
          </Link>
          <Link href="/services" className="block px-3 py-2 rounded-md text-gray-800 hover:bg-blue-50 hover:text-blue-600">
            Services
          </Link>
          <Link href="/doctors" className="block px-3 py-2 rounded-md text-gray-800 hover:bg-blue-50 hover:text-blue-600">
            Doctors
          </Link>
          <Link href="/about" className="block px-3 py-2 rounded-md text-gray-800 hover:bg-blue-50 hover:text-blue-600">
            About Us
          </Link>
          <Link href="/contact" className="block px-3 py-2 rounded-md text-gray-800 hover:bg-blue-50 hover:text-blue-600">
            Contact
          </Link>
          <Link href="/register" className="block px-3 py-2 rounded-md text-gray-800 hover:bg-blue-50 hover:text-blue-600">
            Register
          </Link>
          <Link href="/login" className="block px-3 py-2 rounded-md text-gray-800 hover:bg-blue-50 hover:text-blue-600">
            Login
          </Link>
          <Link href="/appointment" className="block px-3 py-2 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Appointment
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
