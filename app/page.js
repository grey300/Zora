"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "./globals.css";
import Features from "@/components/landing/Features";
import Hero from "@/components/landing/Hero";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import Showcase from "@/components/landing/Showcase";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen overflow-hidden bg-[#070911]">
      <Navbar />
      <Hero />
      <Features />
      <Showcase />
      <Footer />
    </div>
  );
}
