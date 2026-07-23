import "./globals.css"; // Landing page-specific styles
import Features from "./_components/components/ui/Features";
import Hero from "./_components/components/ui/Hero";
import Footer from "./_components/components/ui/Footer";
import Navbar from "./_components/components/ui/Navbar";

export default function Home() {
  return (
    <div className="bg-[#2D3345] min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
