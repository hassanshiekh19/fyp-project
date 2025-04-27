'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/data/firebase';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDoc, collection } from 'firebase/firestore';
import doctors from '../../data/doctors';

export default function BookAppointment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userChecked, setUserChecked] = useState(false);
  const [user, setUser] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientContact, setPatientContact] = useState('');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [city, setCity] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setUserChecked(true);
      if (!currentUser) {
        router.push(`/login?redirect=${encodeURIComponent('/book-appointment')}`);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (city) {
      const doctorsInCity = doctors.filter((doctor) => doctor.city === city && doctor.available);
      setFilteredDoctors(doctorsInCity);
    } else {
      setFilteredDoctors([]);
    }
  }, [city]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedDoctor || !patientName || !patientContact || !reasonForVisit) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'appointments'), {
        doctor: selectedDoctor,
        date: selectedDate.toISOString(),
        patientName,
        patientContact,
        reasonForVisit,
        createdAt: new Date(),
      });

      sendEmailConfirmation();

      setSubmitted(true);
      setLoading(false);
    } catch (error) {
      console.error('Error booking appointment:', error);
      setLoading(false);
      alert('There was an error booking your appointment. Please try again.');
    }
  };

  const sendEmailConfirmation = () => {
    setTimeout(() => {
      setEmailSent(true);
    }, 2000);
  };

  if (!userChecked) return null;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-600 to-cyan-400 pt-28 px-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-xl mb-16 space-y-6">
        <h1 className="text-4xl font-semibold text-center text-blue-600 mb-8">Book an Appointment</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Patient Name */}
            <div>
              <label className="block text-lg font-medium text-gray-700">Patient Name:</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full p-4 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Patient Contact */}
            <div>
              <label className="block text-lg font-medium text-gray-700">Patient Contact:</label>
              <input
                type="text"
                value={patientContact}
                onChange={(e) => setPatientContact(e.target.value)}
                className="w-full p-4 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your contact number"
                required
              />
            </div>
          </div>

          {/* Reason for Visit */}
          <div>
            <label className="block text-lg font-medium text-gray-700">Reason for Visit:</label>
            <textarea
              value={reasonForVisit}
              onChange={(e) => setReasonForVisit(e.target.value)}
              className="w-full p-4 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your reason for visit"
              required
            />
          </div>

          {/* City Selection */}
          <div>
            <label className="block text-lg font-medium text-gray-700">Select City:</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-4 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Select City --</option>
              <option value="Lahore">Lahore</option>
              <option value="Karachi">Karachi</option>
              <option value="Multan">Multan</option>
              <option value="Islamabad">Islamabad</option>
              <option value="Rawalpindi">Rawalpindi</option>
            </select>
          </div>

          {/* Doctor Selection */}
          <div>
            <label className="block text-lg font-medium text-gray-700">Select Doctor:</label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full p-4 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Select Doctor --</option>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.name}>
                    {doctor.name} ({doctor.specialty})
                  </option>
                ))
              ) : (
                <option value="" disabled>No doctors available in selected city</option>
              )}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-lg font-medium text-gray-700">Select Date:</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy/MM/dd"
              minDate={new Date()}
              className="w-full p-4 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholderText="Pick a date"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full p-4 mt-6 bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none transition-all`}
            disabled={loading}
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>

        {/* Success/Error Feedback */}
        {submitted && !emailSent && (
          <p className="mt-6 text-green-600 text-center text-lg">✅ Appointment booked successfully!</p>
        )}
        {emailSent && (
          <p className="mt-6 text-blue-600 text-center text-lg">✅ A confirmation email has been sent to your email address.</p>
        )}
      </div>
    </div>
  );
}
