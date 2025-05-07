'use client';

import { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import AuthNavbarWrapper from "@/components/AuthNavbarWrapper";
import PageTransition from "@/components/PageTransition";
import DialogflowMessenger from "@/components/DialogflowMessenger"; // ✅ Add this import

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
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthNavbarWrapper />

        <PageTransition>
          <main>{children}</main>
        </PageTransition>

        {pageLoaded && <Footer />}
        
        {/* Add DialogflowMessenger here - it will appear on all pages */}
        <DialogflowMessenger />
      </body>
    </html>
  );
}