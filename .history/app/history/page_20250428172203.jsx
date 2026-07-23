"use client";

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/app/dashboard/_components/SideBar"; // Sidebar
import Header from "@/app/dashboard/_components/Header"; // ✅ Import your Header
import HistoryClient from "./HistoryClient";

export default function HistoryPage() {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) {
    return null;
  }

  if (!user) {
    router.push("/");
    return null;
  }

  return (
    <SignedIn>
      <div className="flex flex-col min-h-screen">
        {/* Top Header */}

        {/* Below header: Sidebar + Content */}
        <div className="flex flex-1">
          {/* Sidebar */}
          <div className="w-64">
            <SideBar />
          </div>
          <div className="w-64">
            <Header />
          </div>
          {/* Main Content */}
          <div className="flex-1 p-8">
            <HistoryClient userId={user.id} />
          </div>
        </div>
      </div>
    </SignedIn>
  );
}
