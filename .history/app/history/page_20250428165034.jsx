import { auth } from "@clerk/nextjs/server";
// import { useAuth } from "@clerk/nextjs";
import HistoryComponent from "@/app/quiz-dashboard/_components/HistoryComponent";

export default async function HistoryPage() {
  const { userId } = await auth(); // Clerk's userId
  // const {userId} = useAuth();
  console.log("HistoryPage userId:", userId); // Debugging line
  return <HistoryComponent userId={userId} />;
}
