import { auth } from "@clerk/nextjs/server"; // use Clerk auth
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { LucideLayoutDashboard } from "lucide-react";
import HistoryClient from "./HistoryClient"; // Client component to fetch and render history

export default async function HistoryPage() {
  const { userId } = auth(); // get Clerk user

  if (!userId) {
    return redirect("/sign-in"); // if not logged in
  }

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-[90vw] max-w-md">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">History</CardTitle>
            <Link className={buttonVariants()} href="/dashboard">
              <LucideLayoutDashboard className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </CardHeader>
        <CardContent className="max-h-[60vh] overflow-y-auto">
          <HistoryClient userId={userId} />
        </CardContent>
      </Card>
    </div>
  );
}
