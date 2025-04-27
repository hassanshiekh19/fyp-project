// components/LoadingSpinner.js

import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-r from-blue-100 to-white z-50">
      {/* Add a fade-in/fade-out effect to the logo */}
      <motion.div
        className="relative flex justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }} // Opacity animates between 0 and 1
        transition={{
          duration: 1.5,
          ease: 'easeInOut',
          loop: Infinity, // Infinite loop for the fading effect
        }}
      >
        <img
          src="/images/logo.png" // Replace with the correct path to your logo
          alt="Loading Logo"
          className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64" // Adjust size as needed
        />
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
