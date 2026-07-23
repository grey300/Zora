import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation"; // <-- IMPORTANT import
import HistoryComponent from "@/app/quiz-dashboard/_components/HistoryComponent";

export default async function HistoryPage() {
  const { userId } = auth(); // Server side get user ID

  if (!userId) {
    return redirect("/sign-in"); // If not logged in, redirect
  }

  return <HistoryClient userId={userId} />; // If logged in, show history
}
