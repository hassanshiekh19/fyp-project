'use client';

import { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import AuthNavbarWrapper from "@/components/AuthNavbarWrapper";
import PageTransition from "@/components/PageTransition"; // ✅ Import transition wrapper

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    // This will run when the component is mounted, ensuring page transition happens smoothly
    const timer = setTimeout(() => {
      setPageLoaded(true); // Allow footer to be shown after the page has loaded
    }, 600); // Adjust the time (600ms) to match the duration of your page transition

    return () => clearTimeout(timer); // Clear the timeout on component unmount
  }, []);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthNavbarWrapper />

        {/* Smooth transition wrapper */}
        <PageTransition>
          <main>{children}</main>
        </PageTransition>

        {/* Footer will be shown only after the page has finished loading */}
        {pageLoaded && <Footer />}
      </body>
    </html>
  );
}
