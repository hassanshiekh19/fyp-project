'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/data/firebase'; // Firebase import for user data
import { onAuthStateChanged } from 'firebase/auth'; // Firebase method to track auth state

const HeroSection = () => {
  const router = useRouter();
  const [user, setUser] = useState(null); // State to store user info

  // Check the user's authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Set user if logged in
      } else {
        setUser(null); // Set to null if logged out
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // Redirect to login if the user is not logged in
  const handleBookAppointment = () => {
    if (!user) {
      // Redirect to login page with a "redirectTo" query parameter
      router.push('/login?redirectTo=/book-appointment');
    } else {
      // Redirect to appointment page if user is logged in
      router.push('/book-appointment');
    }
  };

  return (
    <div className="relative w-full h-screen max-h-[600px] bg-gradient-to-r from-blue-600 to-cyan-400 overflow-hidden pt-48">
      {/* Background Elements */}
      <div className="absolute right-0 top-0 w-1/3 h-full">
        <div className="grid grid-cols-5 gap-4 opacity-20">
          {Array(50).fill().map((_, i) => (
            <div key={i} className="w-2 h-2 bg-white rounded-full"></div>
          ))}
        </div>
      </div>
      
      {/* Content Container */}
      <div className="container mx-auto px-4 h-full flex items-center">
        <div className="flex flex-col md:flex-row items-center justify-between w-full">
          {/* Left Side - Text Content */}
          <div className="w-full md:w-1/2 text-white z-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-2">
              YOUR HEALTH
            </h1>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white" style={{ WebkitTextStroke: '2px white', color: 'transparent' }}>
              IS OUR PRIORITY
            </h2>
            <p className="text-xl md:text-2xl mb-8 max-w-lg">
              Experience the best medical services that prioritize your health and well-being.
            </p>
            <button
              onClick={handleBookAppointment}
              className="inline-flex items-center bg-gray-800 text-white py-3 px-6 text-lg font-medium rounded hover:bg-gray-700 transition duration-300"
            >
              Book an Appointment
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
          
          {/* Right Side - Image */}
          <div className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center md:justify-end">
            <div className="relative w-full max-w-md h-80">
              <Image 
                src="/images/pic1.jpg"  // Image path from the public/images folder
                alt="Healthcare"
                width={400}  // Explicit width
                height={1020}  // Explicit height
                className="object-cover rounded z-10"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
