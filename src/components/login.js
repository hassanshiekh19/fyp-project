// pages/login.js
"use client";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session) {
      router.push("/results"); // Redirect when logged in
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email: e.target.email.value,
      password: e.target.password.value,
    });

    if (res.error) {
      setError("Invalid credentials.");
    } else {
      router.push("/results");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div>
            <label>Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Log in with Email
          </button>
        </form>

        <div className="my-6 text-center text-gray-500">OR</div>

        <button
          onClick={() => signIn("google")}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 flex justify-center items-center space-x-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.5h-1.9V20H24v8h11.3C33.4 32.4 29.1 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1.1 7.2 2.8l6-6C33.1 6.7 28.8 5 24 5 12.4 5 3 14.4 3 26s9.4 21 21 21c10.5 0 19.3-7.5 20.8-17.5.1-.7.2-1.5.2-2.3 0-2.3-.2-4.2-.4-6.2z"/>
            <path fill="#FF3D00" d="M6.3 14.2l6.6 4.8C14.4 15.4 18.8 13 24 13c2.8 0 5.3 1.1 7.2 2.8l6-6C33.1 6.7 28.8 5 24 5c-7.7 0-14.3 4.4-17.7 10.8z"/>
            <path fill="#4CAF50" d="M24 47c5.1 0 9.7-1.8 13.3-4.9l-6.3-5.1C29.3 38.4 26.8 39 24 39c-5.1 0-9.4-2.9-11.3-7H6.2l-6 4.6C5.8 43.5 14.2 47 24 47z"/>
            <path fill="#1976D2" d="M43.6 20.5H24v8h11.3c-1.1 3.2-3.5 5.8-6.6 7.4l6.3 5.1c3.7-3.3 6.3-8.1 6.3-14 0-1.5-.1-2.9-.3-4.3z"/>
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
}
