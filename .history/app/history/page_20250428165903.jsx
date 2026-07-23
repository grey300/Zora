import { auth } from "@clerk/nextjs/server";
import HistoryClient from "./HistoryClient"; // We will create this next!

export default async function HistoryPage() {
  const { userId } = auth(); // 👈 Get userId from Clerk

  if (!userId) {
    return redirect("/sign-in"); // redirect to sign in if no user
  }

  return <HistoryClient userId={userId} />;
}
