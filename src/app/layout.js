// app/layout.js

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

export const metadata = {
  title: "MediCare - AI Dermatology",
  description: "AI-powered healthcare for skin analysis and more",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthNavbarWrapper />

        {/* Smooth transition wrapper */}
        <PageTransition>
          <main>{children}</main>
        </PageTransition>

        <Footer />
      </body>
    </html>
  );
}
