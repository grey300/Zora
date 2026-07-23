// C:\Users\chime\Desktop\Zorav1\zora\app\dashboard\logout\page.jsx

import { useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";
import { useRouter } from "next/router"; // Assuming you're using Next.js

const LogoutPage = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    // Sign the user out
    signOut();

    // Optionally, redirect to a different page after logout
    router.push("/login"); // Redirect to login or homepage
  }, [signOut, router]);

  return (
    <div>
      <h2>You are being logged out...</h2>
    </div>
  );
};

export default LogoutPage;
