'use client';

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../data/firebase';

export default function FeedbackForm() {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Start loader

    try {
      await addDoc(collection(db, 'feedbacks'), {
        email,
        feedback,
        rating,
        timestamp: new Date().toISOString(),
      });
      setSubmitted(true);
      setEmail('');
      setFeedback('');
      setRating(0);
      setTimeout(() => setSubmitted(false), 4000); // Hide message after 4 seconds
    } catch (err) {
      console.error('Error submitting feedback:', err);
    }

    setIsSubmitting(false); // Stop loader
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-blue-50 rounded-lg shadow-lg mt-10">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">We Value Your Feedback</h2>

      {submitted ? (
        <div className="text-center text-green-600 font-semibold text-lg">
          ⭐ Thank you for your feedback!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email input */}
          <div>
            <label className="block text-blue-600 font-semibold mb-2" htmlFor="email">
              Your Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full border border-blue-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Feedback input */}
          <div>
            <label className="block text-blue-600 font-semibold mb-2" htmlFor="feedback">
              Your Feedback
            </label>
            <textarea
              id="feedback"
              className="w-full border border-blue-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Share your experience..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            />
          </div>

          {/* Rating input */}
          <div>
            <label className="block text-blue-600 font-semibold mb-2">Rate the Diagnosis</label>
            <div className="flex space-x-1 items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className={`text-3xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} 
                    hover:text-yellow-500 transition-colors`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 text-white font-semibold rounded-lg transition duration-200
                ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
