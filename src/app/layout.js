'use client';

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isDoctorRoute = pathname.startsWith('/doctor');

  const shouldHideLayout = isAdminRoute || isDoctorRoute; //

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ✅ Hide navbar on /admin and Doctor routes */}
        {!shouldHideLayout && <AuthNavbarWrapper />}
        
        <PageTransition>
          <main>{children}</main>
        </PageTransition>

        {/* ✅ Hide footer on /admin routes */}
        {!shouldHideLayout && pageLoaded && <Footer />}

        {/* ✅ Hide chatbot on /admin routes */}
        {!shouldHideLayout && <DialogflowMessenger />}
      </body>
    </html>
  );
}
