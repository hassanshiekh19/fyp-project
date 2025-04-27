'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner'; // Import your loading spinner

const PageTransition = ({ children }) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  // Simulate page load duration or use Next.js router events
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000); // Adjust the duration for loading spinner
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        {loading ? <LoadingSpinner /> : children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
