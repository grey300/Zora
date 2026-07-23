"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/app/dashboard/_components/SideBar";
import Header from "@/app/dashboard/_components/Header";
import HistoryClient from "./HistoryClient";

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isLoaded = status !== "loading";
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
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0B0E14]">
      <div className="hidden md:block">
        <SideBar />
      </div>

      <div className="flex flex-1 flex-col md:ml-64">
        <Header />
        <div className="flex-1 p-8">
          <HistoryClient userId={user.id} />
        </div>
      </div>
    </div>
  );
}
