"use client";

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import HistoryClient from "@/app/quiz-dashboard/_components/HistoryClient";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const { user } = useUser();
  const router = useRouter();

  if (!user) {
    router.push("/"); // Redirect manually on client side
    return null;
  }

  return (
    <SignedIn>
      <HistoryClient userId={user.id} />
    </SignedIn>
  );
}
