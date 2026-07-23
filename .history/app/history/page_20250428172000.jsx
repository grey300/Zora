"use client";

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import HistoryClient from "./HistoryClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/app/dashboard/_components/SideBar"; // <-- ✅ Import your Sidebar component

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
      <div className="flex">
        {/* Left sidebar */}
        <div className="w-64">
          <SideBar />
        </div>

        {/* Right content (history) */}
        <div className="flex-1 p-8">
          <HistoryClient userId={user.id} />
        </div>
      </div>
    </SignedIn>
  );
}
