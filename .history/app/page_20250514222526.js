"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "./globals.css"; // Landing page-specific styles
import Features from "./_components/components/ui/Features";
import Hero from "./_components/components/ui/Hero";
import Footer from "./_components/components/ui/Footer";
import Navbar from "./_components/components/ui/Navbar";

export default function Home() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
