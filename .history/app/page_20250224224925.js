import Header from "./_components/Header";
import Hero from "./_components/Hero";
import AuroraBackground from "@/components/aurora-background"; // Import AuroraBackground

export default function Home() {
  return (
    <div>
      {/* Header always stays on top */}
      <Header />

      {/* Apply Aurora background only to Home page */}
      <section className="relative">
        <AuroraBackground className="absolute inset-0 -z-10" />
        {/* Hero section */}
        <Hero />
      </section>
    </div>
  );
}
