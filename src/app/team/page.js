'use client';
import React, { useState } from "react";
import doctors from "../../data/doctors"; // Adjusted import path

const Team = () => {
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);
  const [filters, setFilters] = useState({
    gender: "",
    city: "",
    availability: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filterDoctors = () => {
    let filtered = doctors;

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
  };

  React.useEffect(() => {
    filterDoctors();
  }, [filters]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-extrabold text-center mb-8">Meet Our Doctors</h1>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <select
          name="gender"
          value={filters.gender}
          onChange={handleFilterChange}
          className="p-3 border border-gray-300 rounded-md w-48 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <select
          name="city"
          value={filters.city}
          onChange={handleFilterChange}
          className="p-3 border border-gray-300 rounded-md w-48 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select City</option>
          <option value="Lahore">Lahore</option>
          <option value="Karachi">Karachi</option>
          <option value="Islamabad">Islamabad</option>
          <option value="Rawalpindi">Rawalpindi</option>
          <option value="Multan">Multan</option>
        </select>

        <select
          name="availability"
          value={filters.availability}
          onChange={handleFilterChange}
          className="p-3 border border-gray-300 rounded-md w-48 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Availability</option>
          <option value="true">Available</option>
          <option value="false">Not Available</option>
        </select>
      </div>

      {/* Doctors Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white border border-gray-200 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl"
          >
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-full h-56 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{doctor.name}</h2>
              <p className="text-lg text-gray-500 mb-4">{doctor.specialty}</p>
              <p className="text-sm text-gray-600 mb-4">{doctor.city}</p>
              <div
                className={`text-sm font-semibold ${
                  doctor.available ? "text-green-500" : "text-red-500"
                }`}
              >
                {doctor.available ? "Available" : "Not Available"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
