"use client";

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import HistoryClient from "./HistoryClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const { isLoaded, user } = useUser(); // <-- also check isLoaded
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) {
    return null; // Don't render anything on server / loading state
  }

  if (!user) {
    router.push("/"); // redirect to landing
    return null;
  }

  return (
    <SignedIn>
      <HistoryClient userId={user.id} />
    </SignedIn>
  );
}
