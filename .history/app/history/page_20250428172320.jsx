"use client";

import { SignedIn, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/app/dashboard/_components/SideBar";
import Header from "@/app/dashboard/_components/Header";
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
      <div className="flex min-h-screen">
        {/* Sidebar on the left */}
        <div className="w-64">
          <SideBar />
        </div>

        {/* Right side: Header + Content */}
        <div className="flex-1 flex flex-col">
          {/* Header at the top */}
          <div className="w-full">
            <Header />
          </div>

          {/* History content below Header */}
          <div className="flex-1 p-8">
            <HistoryClient userId={user.id} />
          </div>
        </div>
      </div>
    </SignedIn>
  );
}
