// 🔐 REGISTER COMPONENT
'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { db, auth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "@/data/firebase";
import { setDoc, doc } from "firebase/firestore";
import { updateProfile } from "firebase/auth"; // ✅ added here
import { Eye, EyeOff } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import Image from 'next/image';

const Register = () => {
  const router = useRouter();

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
  const [showPopup, setShowPopup] = useState(false);
  const errorRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = () => {
    setFormData(prev => ({ ...prev, isAgreed: !prev.isAgreed }));
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({ ...prev, contactNumber: value }));
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
      !formData.gender ||
      !formData.isAgreed
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
    if (!emailRegex.test(formData.email)) return "Invalid email format.";
    if (formData.password.length < 6) return "Password should be at least 6 characters.";
    if (formData.password !== formData.confirmPassword) return "Passwords do not match!";
    if (parseInt(formData.age) <= 0) return "Age must be a positive number.";
    if (!formData.isAgreed) return "You must agree to the terms and conditions.";

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

      // ✅ SET displayName FOR CURRENT USER
      await updateProfile(user, {
        displayName: `${formData.firstName.trim()} ${formData.lastName.trim()}`
      });

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
      setShowPopup(true);

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
      setErrorMessage(error.message);
      scrollToError();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        firstName: user.displayName?.split(" ")[0] || "Unknown",
        lastName: user.displayName?.split(" ")[1] || "User",
        email: user.email,
        createdAt: new Date(),
      });

      router.push("/");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        router.push("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup, router]);


    return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-400 p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-10 space-y-8">
        <div className="flex justify-center mb-6">
          <Image src="/images/logo.png" alt="Logo" width={120} height={120} />
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800">Create your account</h2>

        {errorMessage && (
          <div ref={errorRef} className="text-red-500 text-sm mb-4 text-center w-full">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="text-green-600 text-sm mb-4 text-center w-full">
            {successMessage}
          </div>
        )}

        {showPopup && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black via-transparent to-transparent backdrop-blur-lg z-40"></div>
            <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md z-50">
              <h3 className="text-2xl font-semibold text-green-600 mb-4">Registration Successful!</h3>
              <p className="text-gray-700 mb-4">
                Your account has been successfully created. Redirecting to login...
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
          <div className="space-y-6">
            <div className="flex space-x-4">
              <div className="w-full">
                <label htmlFor="firstName" className="sr-only">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="w-full">
                <label htmlFor="lastName" className="sr-only">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="sr-only">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
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
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <input
                id="confirmPassword"
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

            <div>
              <label htmlFor="age" className="sr-only">Age</label>
              <input
                id="age"
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="sr-only">Date of Birth</label>
              <input
                id="dateOfBirth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label htmlFor="gender" className="sr-only">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="" disabled>Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="contactNumber" className="sr-only">Contact Number</label>
              <PhoneInput
                country={"us"}
                value={formData.contactNumber}
                onChange={handlePhoneChange}
                className="w-full"
                inputClass="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isAgreed"
                checked={formData.isAgreed}
                onChange={handleCheckboxChange}
                className="h-4 w-4"
              />
              <label htmlFor="isAgreed" className="text-gray-600 text-sm">
                I agree to the terms and conditions
              </label>
            </div>

            <button
              type="submit"
              className={`w-full py-3 bg-blue-600 text-white rounded-lg ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"} transition-all duration-300`}
              disabled={loading || isFormIncomplete()}
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm">Already have an account?</p>
          <Link href="/login">
            <button className="text-blue-600 hover:underline">Login here</button>
          </Link>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleGoogleRegister}
            className={`w-full py-3 bg-red-600 text-white rounded-lg flex items-center justify-center space-x-3 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"} transition-all duration-300`}
            disabled={loading}
          >
            <span className="text-lg">Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};



export default Register;
