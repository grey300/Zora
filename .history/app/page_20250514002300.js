import "./globals.css"; // Landing page-specific styles
import Features from "./_components/components/ui/Features";
import Hero from "./_components/components/ui/Hero";
import Footer from "./_components/components/ui/Footer";
import Navbar from "./_components/components/ui/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      {/* Sample Section to Demonstrate Color Combos */}
      <div className="p-4 flex flex-col gap-4 items-center">
        {/* Primary Button */}
        <button
          style={{
            backgroundColor: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
          }}
          className="px-4 py-2 rounded hover:bg-[hsl(var(--primary-hover))]"
        >
          Get Started
        </button>
        {/* Secondary Button */}
        <button
          style={{
            backgroundColor: "hsl(var(--secondary))",
            color: "hsl(var(--secondary-foreground))",
          }}
          className="px-4 py-2 rounded hover:bg-[hsl(var(--secondary-hover))]"
        >
          Learn More
        </button>
        {/* Highlight Tag */}
        <span
          style={{
            backgroundColor: "hsl(var(--accent))",
            color: "hsl(var(--accent-foreground))",
          }}
          className="px-2 py-1 rounded text-sm"
        >
          New Feature
        </span>
        {/* Sample Card */}
        <div className="card max-w-sm">
          <h3>Feature Highlight</h3>
          <p>Explore our latest updates.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
