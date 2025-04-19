/*"use client"; 
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function FeedbackForm() {
  const router = useRouter();
  const { diagnosisId } = router.query;
  
  const [formData, setFormData] = useState({
    accuracyRating: 3,
    experienceRating: 3,
    comments: '',
    followUpNeeded: false,
    name: '',
    email: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Add the diagnosis ID to the submission
      const submissionData = {
        ...formData,
        diagnosisId,
        submittedAt: new Date().toISOString(),
      };
      
      // In a real app, you would send this to your API
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
      
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = (name, value, label) => {
    return (
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {label}
        </label>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData({ ...formData, [name]: star })}
              className="text-3xl focus:outline-none mr-1"
            >
              {star <= formData[name] ? "★" : "☆"}
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {value === 1 ? 'Poor' : value === 2 ? 'Fair' : value === 3 ? 'Good' : value === 4 ? 'Very Good' : 'Excellent'}
          </span>
        </div>
      </div>
    );
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-green-600">Thank You!</h2>
        <p className="mb-4">Your feedback has been submitted successfully.</p>
        <button
          onClick={() => router.push('/')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Diagnosis Feedback</title>
      </Head>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Diagnosis Feedback</h1>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {renderStarRating('accuracyRating', formData.accuracyRating, 'How accurate was your diagnosis?')}
          {renderStarRating('experienceRating', formData.experienceRating, 'How was your overall experience?')}
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comments">
              Additional Comments
            </label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="4"
              placeholder="Please share any additional feedback about your diagnosis or experience..."
            />
          </div>
          
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="followUpNeeded"
                checked={formData.followUpNeeded}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-gray-700 text-sm">I would like to be contacted for follow-up</span>
            </label>
          </div>
          
          {formData.followUpNeeded && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required={formData.followUpNeeded}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required={formData.followUpNeeded}
                />
              </div>
            </>
          )}
          
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}*/