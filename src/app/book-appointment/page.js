"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/data/firebase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import doctors from "../../data/doctors";

export default function BookAppointment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userChecked, setUserChecked] = useState(false);
  const [user, setUser] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setUserChecked(true);
      if (!currentUser) {
        // Redirect to login and include return path
        router.push(`/login?redirect=${encodeURIComponent("/book-appointment")}`);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedDoctor) {
      alert("Please fill in all fields");
      return;
    }

    console.log("Appointment booked:", {
      doctor: selectedDoctor,
      date: selectedDate.toISOString(),
    });

    setSubmitted(true);
  };

  // Wait until auth is checked before showing form
  if (!userChecked) return null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-blue-600 to-cyan-400 pt-28 px-4 flex justify-center items-center">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Book an Appointment
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Select Date:</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy/MM/dd"
              minDate={new Date()}
              className="w-full p-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholderText="Pick a date"
            />
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700">Select Doctor:</label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full p-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select --</option>
              {doctors
                .filter((doc) => doc.available)
                .map((doc) => (
                  <option key={doc.id} value={doc.name}>
                    {doc.name} ({doc.specialty})
                  </option>
                ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          >
            Book Appointment
          </button>
        </form>

        {submitted && (
          <p className="mt-4 text-green-600 text-center">
            ✅ Appointment booked successfully!
          </p>
        )}
      </div>
    </div>
  );
}
