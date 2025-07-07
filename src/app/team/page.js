'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  onSnapshot
} from "firebase/firestore";
import { db } from "../../data/firebase";
import { getAuth } from "firebase/auth";

const Team = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [filters, setFilters] = useState({
    gender: "",
    city: "",
    availability: "",
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'doctors'), snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDoctors(data);
      setFilteredDoctors(data);
    });

    return () => unsubscribe(); // unsubscribe on unmount
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  useEffect(() => {
    let filtered = [...doctors];

    if (filters.gender) {
      filtered = filtered.filter((doctor) => doctor.gender === filters.gender);
    }
    if (filters.city) {
      filtered = filtered.filter((doctor) => doctor.city === filters.city);
    }
    if (filters.availability !== "") {
      const isAvailable = filters.availability === "true";
      filtered = filtered.filter((doctor) => doctor.available === isAvailable);
    }

    setFilteredDoctors(filtered);
  }, [filters, doctors]);

  const router = useRouter();
  const auth = getAuth();

  const handleStartChat = async (doctor) => {
  const user = auth.currentUser;

  if (!user) {
    alert("Please login to start chatting.");
    return;
  }

  const patientId = user.uid;
  const doctorId = doctor.id;
  const conversationId = [patientId, doctorId].sort().join("_");

  try {
    const convoRef = doc(db, "conversations", conversationId);
    const convoSnap = await getDoc(convoRef);

    if (!convoSnap.exists()) {
      await setDoc(convoRef, {
        user1: patientId,
        user2: doctorId,
        doctorName: doctor.name,
        doctorEmail: doctor.email, // ✅ Added for notification
        patientName: user.displayName || "Patient",
        patientEmail: user.email,   // ✅ Added for notification
        createdAt: new Date(),
      });
    }

    router.push(`/chat/${conversationId}`);
  } catch (error) {
    console.error("Error starting chat:", error);
    alert("Something went wrong while starting the chat.");
  }
};


  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-extrabold text-center mb-8">Meet Our Doctors</h1>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {['gender', 'city', 'availability'].map(filterKey => (
          <select
            key={filterKey}
            name={filterKey}
            value={filters[filterKey]}
            onChange={handleFilterChange}
            className="p-3 border border-gray-300 rounded-md w-48 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              {filterKey === "gender"
                ? "Select Gender"
                : filterKey === "city"
                ? "Select City"
                : "Select Availability"}
            </option>
            {filterKey === "gender" && <>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </>}
            {filterKey === "city" && <>
              <option value="Lahore">Lahore</option>
              <option value="Karachi">Karachi</option>
              <option value="Islamabad">Islamabad</option>
              <option value="Rawalpindi">Rawalpindi</option>
              <option value="Multan">Multan</option>
            </>}
            {filterKey === "availability" && <>
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </>}
          </select>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white border border-gray-200 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl"
          >
            <img
  src={doctor.image?.startsWith('/') ? doctor.image : `/images/${doctor.image}`}
  alt={doctor.name}
  className="w-full h-56 object-contain rounded-t-lg bg-white"
/>
            <div className="p-4">
              <h2 className="text-2xl font-semibold text-gray-800 mb-1">{doctor.name}</h2>
              <p className="text-md text-gray-500 mb-1">{doctor.specialty}</p>
              <p className="text-sm text-gray-600 mb-1">{doctor.city}</p>
              <p className="text-sm italic text-gray-600 mb-2">{doctor.about || "No bio provided."}</p>

              <div
                className={`text-sm font-semibold ${
                  doctor.available ? "text-green-500" : "text-red-500"
                }`}
              >
                {doctor.available ? "Available" : "Not Available"}
              </div>

              <button
                onClick={() => handleStartChat(doctor)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
