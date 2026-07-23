import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import Layout from "@/components/common/Layout";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Zora",
  description: "AI-powered courses and quizzes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          <ReactQueryProvider>
            <Layout>
              {children}
              <Analytics />
              <SpeedInsights />
            </Layout>
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
