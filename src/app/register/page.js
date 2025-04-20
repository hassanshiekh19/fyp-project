'use client';

import { useState, useRef } from "react";
import Link from "next/link";
import { db, auth, createUserWithEmailAndPassword } from "@/data/firebase";
import { setDoc, doc } from "firebase/firestore";
import { Eye, EyeOff } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    contactNumber: "",
    dateOfBirth: "",
    gender: "",
    isAgreed: false,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // This controls the popup
  const errorRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = () => {
    setFormData(prev => ({
      ...prev,
      isAgreed: !prev.isAgreed,
    }));
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({
      ...prev,
      contactNumber: value,
    }));
  };

  const isFormIncomplete = () => {
    return (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.age ||
      !formData.contactNumber ||
      !formData.dateOfBirth ||
      !formData.gender
    );
  };

  const scrollToError = () => {
    errorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateFields = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      return "Invalid email format.";
    }

    if (formData.password.length < 6) {
      return "Password should be at least 6 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match!";
    }

    if (parseInt(formData.age) <= 0) {
      return "Age must be a positive number.";
    }

    if (!formData.isAgreed) {
      return "You must agree to the terms and conditions.";
    }

    const ageFromDob = calculateAge(formData.dateOfBirth);
    if (parseInt(formData.age) !== ageFromDob) {
      return `Your entered age (${formData.age}) does not match your date of birth. It should be ${ageFromDob}.`;
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    const validationError = validateFields();
    if (validationError) {
      setErrorMessage(validationError);
      setLoading(false);
      scrollToError();
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        age: formData.age,
        contactNumber: formData.contactNumber,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        createdAt: new Date(),
      });

      setSuccessMessage("User registered successfully!");
      setShowPopup(true); // Show the popup when registration is successful

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        age: "",
        contactNumber: "",
        dateOfBirth: "",
        gender: "",
        isAgreed: false,
      });
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage(error.message);
      scrollToError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-gradient-to-r from-blue-600 to-cyan-400 p-6 mt-16">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-xl p-8 flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create an Account
        </h2>

        {errorMessage && (
          <div
            ref={errorRef}
            className="text-red-500 text-sm mb-4 text-center w-full"
          >
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="text-green-600 text-sm mb-4 text-center w-full">
            {successMessage}
          </div>
        )}

        {/* Success Popup */}
      {/* Success Popup */}
{showPopup && (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
    {/* Background with enhanced blur and a colorful gradient */}
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black via-transparent to-transparent backdrop-blur-lg z-40"></div>

    {/* Popup Content */}
    <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md z-50">
      <h3 className="text-2xl font-semibold text-green-600 mb-4">
        Registration Successful!
      </h3>
      <p className="text-gray-700 mb-4">
        Your account has been successfully created. You can now log in to start.
      </p>
      <Link href="/login">
        <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300">
          Go to Login
        </button>
      </Link>
    </div>
  </div>
)}





        <form onSubmit={handleSubmit} className="w-full">
          <div className="space-y-4">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-10"
                required
              />
              <div
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-10"
                required
              />
              <div
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
              max={new Date().toISOString().split("T")[0]}
            />
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Age"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
              min="1"
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <PhoneInput
              country={'pk'}
              value={formData.contactNumber}
              onChange={handlePhoneChange}
              inputStyle={{ width: '100%' }}
              inputClass="!py-2 !border !border-gray-300 !rounded-lg"
              inputProps={{ required: true }}
              enableSearch={true}
            />

            <div className="flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                checked={formData.isAgreed}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              I agree to the&nbsp;
              <Link href="#" className="text-blue-500 underline">
                Terms & Conditions
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading || isFormIncomplete()}
              className={`w-full py-3 ${loading || isFormIncomplete()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                } text-white rounded-lg font-semibold transition duration-300`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already a user?{' '}
            <Link href="/login" className="text-blue-500 font-semibold">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
