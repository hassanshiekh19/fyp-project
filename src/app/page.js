// src/app/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HeroSection from '../components/HeroSection'; // Adjust path as needed
import AiDermatologistCards from '../components/AiDermatologistCards';
import SkinAnalysisUpload from '../components/SkinAnalysisUpload';
import FAQSection from '../components/FAQ';
import FeedbackForm from '../components/FeedbackForm';
import ShopifyStoreSection from '../components/ShopifyStoreSection'; // Adjust path as needed

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg text-gray-800">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <HeroSection />
      <SkinAnalysisUpload />
      <ShopifyStoreSection />
      <AiDermatologistCards />
      <FeedbackForm />
      <FAQSection />
    </div>
  );
}