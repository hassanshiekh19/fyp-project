// pages/services.js
'use client'
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

// Import icons (if you're using react-icons or similar)
// import { FaStethoscope, FaRobot, FaCalendarAlt, FaStar, FaCamera, FaMapMarkerAlt } from 'react-icons/fa';

export default function Services() {
  const [activeTab, setActiveTab] = useState('all');
  
  // Sample data for featured doctors - in a real app, fetch from API
  const doctors = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Dermatologist', city: 'New York', rating: 4.9, image: '/images/doctor-1.jpg' },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Dermatologist', city: 'Los Angeles', rating: 4.8, image: '/images/doctor-2.jpg' },
    { id: 3, name: 'Dr. Aisha Patel', specialty: 'Dermatologist', city: 'Chicago', rating: 4.7, image: '/images/doctor-3.jpg' },
  ];

  const filterDoctors = (city) => {
    if (city === 'all') return doctors;
    return doctors.filter(doctor => doctor.city.toLowerCase() === city.toLowerCase());
  };
  
  const cities = ['all', 'New York', 'Los Angeles', 'Chicago'];

  return (
    <>
      <Head>
        <title>Our Services | HealthScan</title>
        <meta name="description" content="Comprehensive healthcare services including skin disease detection, AI assistance, and doctor consultations" />
      </Head>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-400 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Healthcare Services</h1>
          <p className="text-xl md:max-w-2xl">
            Advanced technology meets personalized care. Discover our range of services designed to make healthcare accessible, efficient, and effective.
          </p>
        </div>
      </div>

      {/* Main Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Core Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Service 1: Skin Disease Detection */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:transform hover:scale-105">
              <div className="h-48 bg-blue-100 flex items-center justify-center">
                <div className="text-blue-500 text-5xl">
                  {/* <FaCamera /> */}
                  📷
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Skin Disease Detection</h3>
                <p className="text-gray-600 mb-4">
                  Upload photos of skin concerns and receive AI-powered analysis and preliminary diagnosis.
                </p>
                <Link href="/skin-detection" className="text-blue-500 font-semibold hover:text-blue-700">
                  Try Now &rarr;
                </Link>
              </div>
            </div>

            {/* Service 2: AI Chatbot */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:transform hover:scale-105">
              <div className="h-48 bg-purple-100 flex items-center justify-center">
                <div className="text-purple-500 text-5xl">
                  {/* <FaRobot /> */}
                  🤖
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Healthcare AI Assistant</h3>
                <p className="text-gray-600 mb-4">
                  Get immediate answers to your health questions from our advanced medical AI chatbot.
                </p>
                <Link href="/chatbot" className="text-purple-500 font-semibold hover:text-purple-700">
                  Chat Now &rarr;
                </Link>
              </div>
            </div>

            {/* Service 3: Doctor Booking */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:transform hover:scale-105">
              <div className="h-48 bg-green-100 flex items-center justify-center">
                <div className="text-green-500 text-5xl">
                  {/* <FaCalendarAlt /> */}
                  📅
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Doctor Appointments</h3>
                <p className="text-gray-600 mb-4">
                  Book virtual or in-person consultations with specialized dermatologists in your city.
                </p>
                <Link href="/book-appointment" className="text-green-500 font-semibold hover:text-green-700">
                  Book Now &rarr;
                </Link>
              </div>
            </div>

            {/* Service 4: Patient Feedback */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:transform hover:scale-105">
              <div className="h-48 bg-yellow-100 flex items-center justify-center">
                <div className="text-yellow-500 text-5xl">
                  {/* <FaStar /> */}
                  ⭐
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Feedback & Follow-up</h3>
                <p className="text-gray-600 mb-4">
                  Share your experience, rate diagnoses, and request follow-up consultations.
                </p>
                <Link href="/feedback" className="text-yellow-500 font-semibold hover:text-yellow-700">
                  Give Feedback &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctor Booking Section with City Filter */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Find Specialists Near You</h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Book appointments with top-rated dermatologists in your city for personalized care and treatment plans.
          </p>

          {/* City filter tabs */}
          <div className="flex flex-wrap justify-center mb-8">
            {cities.map(city => (
              <button
                key={city}
                onClick={() => setActiveTab(city)}
                className={`px-4 py-2 mx-2 mb-2 rounded-full ${
                  activeTab === city 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {city === 'all' ? 'All Cities' : city}
              </button>
            ))}
          </div>

          {/* Doctors grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filterDoctors(activeTab).map(doctor => (
              <div key={doctor.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-md">
                <div className="p-4 flex items-center">
                  <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden mr-4">
                    {/* In a real app, use actual images */}
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500">
                      DR
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{doctor.name}</h3>
                    <p className="text-gray-600">{doctor.specialty}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1">{doctor.rating}</span>
                      <span className="ml-3 text-gray-500 flex items-center">
                        <span className="mr-1">📍</span> {doctor.city}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <Link 
                    href={`/book-appointment/${doctor.id}`}
                    className="block text-center py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link 
              href="/doctors"
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              View All Doctors
            </Link>
          </div>
        </div>
      </section>

      {/* Skin Disease Detection Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h2 className="text-3xl font-bold mb-4">AI Skin Disease Detection</h2>
              <p className="text-gray-600 mb-6">
                Our advanced AI can analyze skin conditions through photos, providing preliminary diagnoses for common issues like:
              </p>
              <ul className="grid grid-cols-2 gap-2 mb-6">
                {['Acne', 'Eczema', 'Psoriasis', 'Rosacea', 'Melanoma', 'Dermatitis'].map(condition => (
                  <li key={condition} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span> {condition}
                  </li>
                ))}
              </ul>
              <p className="text-gray-600 mb-6">
                Upload a photo of your skin concern and receive an instant analysis with recommended next steps.
              </p>
              <Link 
                href="/skin-detection"
                className="inline-block px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Try Skin Analysis
              </Link>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center mb-4">
                  <div className="text-gray-500 text-center">
                    <div className="text-5xl mb-2">📷</div>
                    <p>Skin Analysis Preview</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="h-2 w-24 bg-blue-200 rounded-full mb-2"></div>
                    <div className="h-2 w-16 bg-blue-200 rounded-full"></div>
                  </div>
                  <button className="px-4 py-2 bg-blue-100 text-blue-500 rounded-md">
                    Upload Photo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chatbot Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col-reverse md:flex-row items-center">
            <div className="md:w-1/2">
              <div className="bg-gray-100 rounded-lg p-4 shadow-lg max-w-md mx-auto">
                <div className="flex flex-col space-y-4">
                  <div className="bg-white p-3 rounded-lg self-start max-w-xs shadow-sm">
                    <p className="text-sm font-medium">HealthBot</p>
                    <p className="text-gray-600">Hello! How can I help with your health concerns today?</p>
                  </div>
                  
                  <div className="bg-blue-500 text-white p-3 rounded-lg self-end max-w-xs shadow-sm">
                    <p>I have a red, itchy rash on my arm. What could it be?</p>
                  </div>
                  
                  <div className="bg-white p-3 rounded-lg self-start max-w-xs shadow-sm">
                    <p className="text-sm font-medium">HealthBot</p>
                    <p className="text-gray-600">Based on your description, this could be several conditions like contact dermatitis, eczema, or an allergic reaction. Can you share more details or upload a photo?</p>
                  </div>
                </div>
                
                <div className="mt-4 flex">
                  <input 
                    type="text" 
                    placeholder="Type your health question..."
                    className="flex-1 rounded-l-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-blue-500 text-white p-2 rounded-r-lg">
                    Send
                  </button>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 mb-8 md:mb-0 md:pl-8">
              <h2 className="text-3xl font-bold mb-4">AI Health Assistant</h2>
              <p className="text-gray-600 mb-6">
                Our intelligent chatbot provides immediate responses to your health questions, offering guidance on:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span> 
                  <span>Symptom assessment and possible causes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span> 
                  <span>Treatment recommendations for common conditions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span> 
                  <span>When to seek professional medical help</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span> 
                  <span>General health and skincare questions</span>
                </li>
              </ul>
              <Link 
                href="/chatbot"
                className="inline-block px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Chat with Health Assistant
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Patient Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Patients Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Jennifer L.",
                feedback: "The skin disease detection was incredibly accurate! It identified my eczema correctly and connected me with a specialist.",
                rating: 5
              },
              {
                name: "Robert M.",
                feedback: "Booking an appointment was seamless. I found a dermatologist in my city within minutes and got same-week care.",
                rating: 5
              },
              {
                name: "Priya K.",
                feedback: "The AI chatbot helped me understand my symptoms before my appointment. Made the doctor visit much more productive.",
                rating: 4
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <div className="flex text-yellow-500">
                      {Array(5).fill().map((_, i) => (
                        <span key={i}>
                          {i < testimonial.rating ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.feedback}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to take control of your skin health?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start with our AI skin analysis, chat with our health assistant, or book an appointment with a specialist today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/skin-detection"
              className="px-6 py-3 bg-white text-blue-600 rounded-md hover:bg-gray-100 transition-colors font-bold"
            >
              Analyze My Skin
            </Link>
            <Link 
              href="/book-appointment"
              className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-md hover:bg-blue-700 transition-colors font-bold"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}