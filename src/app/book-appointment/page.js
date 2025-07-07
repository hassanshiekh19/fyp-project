'use client';
import AlertModal from '@/components/AlertModal';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/data/firebase';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function BookAppointment() {
  const router = useRouter();
  const [userChecked, setUserChecked] = useState(false);
  const [user, setUser] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const [patientName, setPatientName] = useState('');
  const [patientContact, setPatientContact] = useState('');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'success' });

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
    const fetchDoctors = async () => {
      const snapshot = await getDocs(query(collection(db, 'doctors'), where('available', '==', true)));
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDoctors(docs);
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (city) {
      const filtered = doctors.filter(doc => doc.city === city);
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors([]);
    }
  }, [city, doctors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedDoctor || !selectedTime || !patientName || !patientContact || !reasonForVisit) {
      setModal({ isOpen: true, title: 'Missing Fields', message: 'Please fill in all fields.', type: 'error' });
      return;
    }

    const selectedDoc = doctors.find(doc => doc.id === selectedDoctor);
    if (!selectedDoc) {
      setModal({ isOpen: true, title: 'Doctor Error', message: 'Selected doctor not found.', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const existing = await getDocs(
        query(collection(db, 'appointments'),
          where('doctorEmail', '==', selectedDoc.email),
          where('date', '==', selectedDate.toISOString()),
          where('time', '==', selectedTime))
      );

      if (!existing.empty) {
        setModal({
          isOpen: true,
          title: 'Time Slot Unavailable',
          message: 'This time slot is already booked. Please choose another.',
          type: 'error',
        });
        setLoading(false);
        return;
      }

      await addDoc(collection(db, 'appointments'), {
        doctor: selectedDoc.name,
        doctorEmail: selectedDoc.email,
        city: selectedDoc.city,
        date: selectedDate.toISOString(),
        time: selectedTime,
        patientName,
        patientContact,
        reasonForVisit,
        status: 'pending',
        createdAt: new Date(),
      });

      await fetch('/api/send-booking-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorEmail: selectedDoc.email,
          doctorName: selectedDoc.name,
          patientEmail: user.email,
          patientName: patientName,
          date: selectedDate.toISOString(),
          reason: reasonForVisit,
          time: selectedTime,
        }),
      });

      setModal({
        isOpen: true,
        title: 'Success!',
        message: 'Your appointment has been successfully booked. The Booking Information also sent to you via Email',
        type: 'success',
      });
      setLoading(false);
    } catch (err) {
      console.error('Booking error:', err);
      setModal({
        isOpen: true,
        title: 'Booking Failed',
        message: 'Failed to book appointment. Please try again.',
        type: 'error',
      });
      setLoading(false);
    }
  };

  if (!userChecked) return null;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-600 to-cyan-400 pt-28 px-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-xl mb-16 space-y-6">
        <h1 className="text-4xl font-semibold text-center text-blue-600 mb-8">Book an Appointment</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium text-gray-700">Patient Name:</label>
              <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} className="w-full p-4 mt-2 border rounded-lg focus:ring-blue-500" placeholder="Enter your full name" required />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">Patient Contact:</label>
              <input type="text" value={patientContact} onChange={(e) => setPatientContact(e.target.value)} className="w-full p-4 mt-2 border rounded-lg focus:ring-blue-500" placeholder="Enter your contact number" required />
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Reason for Visit:</label>
            <textarea value={reasonForVisit} onChange={(e) => setReasonForVisit(e.target.value)} className="w-full p-4 mt-2 border rounded-lg focus:ring-blue-500" placeholder="Describe your reason for visit" required />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Select City:</label>
            <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full p-4 mt-2 border rounded-lg focus:ring-blue-500" required>
              <option value="">-- Select City --</option>
              <option value="Lahore">Lahore</option>
              <option value="Karachi">Karachi</option>
              <option value="Multan">Multan</option>
              <option value="Islamabad">Islamabad</option>
              <option value="Rawalpindi">Rawalpindi</option>
            </select>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Select Doctor:</label>
            <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} className="w-full p-4 mt-2 border rounded-lg focus:ring-blue-500" required>
              <option value="">-- Select Doctor --</option>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map(doc => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} ({doc.specialty})
                  </option>
                ))
              ) : (
                <option value="" disabled>No doctors available in selected city</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Select Date:</label>
            <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} dateFormat="yyyy/MM/dd" minDate={new Date()} className="w-full p-4 mt-2 border rounded-lg focus:ring-blue-500" placeholderText="Pick a date" required />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Select Time:</label>
            <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="w-full p-4 mt-2 border rounded-lg focus:ring-blue-500" required>
              <option value="">-- Select Time --</option>
              {['5:00 PM','6:00 PM','7:00 PM','8:00 PM','9:00 PM','10:00 PM'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <AlertModal isOpen={modal.isOpen} title={modal.title} message={modal.message} type={modal.type} onClose={() => setModal({ ...modal, isOpen: false })} />

          <button type="submit" className="w-full p-4 mt-6 bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2" disabled={loading}>
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Booking...
              </>
            ) : (
              'Book Appointment'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
