// src/app/page.js

'use client';  // Client-side only code

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Next.js router for navigation

import AiDermatologistCards from '../components/AiDermatologistCards';
import HeroSection from '../components/HeroSection';
import SkinAnalysisUpload from '../components/SkinAnalysisUpload';
import FAQSection from '../components/FAQ';
import FeedbackForm from '../components/FeedbackForm';
import Footer from '../components/Footer';
import DialogflowMessenger from '../components/DialogflowMessenger';

export default function Page() {
  const [loading, setLoading] = useState(true);  // Loading state for initial render
  const [mounted, setMounted] = useState(false);  // Track if component is mounted
  const router = useRouter();  // Next.js router

  // Set the mounted flag to true after component mounts
  useEffect(() => {
    setMounted(true);
    setLoading(false);  // Set loading to false after initial render
  }, []); 

  // Loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg text-gray-800">Loading...</div>
      </div>
    );
  }

  // Main content will be rendered directly
  return (
    <div>
      <HeroSection />
      <SkinAnalysisUpload />
      <AiDermatologistCards />
      <FeedbackForm />
      <FAQSection />
      <DialogflowMessenger />
    </div>
  );
}
