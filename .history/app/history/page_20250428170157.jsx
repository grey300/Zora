import { auth } from "@clerk/nextjs/server"; // Clerk auth
import { redirect } from "next/navigation"; // <-- This line was missing
import HistoryClient from "./HistoryClient"; // your client component

export default async function HistoryPage() {
  const { userId } = auth(); // get the Clerk userId

  if (!userId) {
    return redirect("/sign-in"); // redirect if not logged in
  }

  return <HistoryClient userId={userId} />;
}
