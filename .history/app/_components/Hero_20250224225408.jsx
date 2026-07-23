import React from "react";
import { AuroraBackground } from "@/components/aurora-background"; // Ensure correct import

function Hero() {
  return (
    <section
      suppressHydrationWarning
      className="relative bg-gray-50 overflow-hidden bg-black"
    >
      {/* Aurora Background */}
      <AuroraBackground>
        <div className="relative mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:items-center">
          <div className="mx-auto max-w-xl text-center">
            <h1 className="text-3xl font-extrabold sm:text-5xl text-primary">
              AI Course Generator
              <strong className="font-extrabold text-black sm:block">
                Increase Conversion.
              </strong>
            </h1>

            <p className="mt-4 sm:text-xl/relaxed">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt
              illo tenetur fuga ducimus numquam ea!
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                className="block w-full rounded-sm bg-primary px-12 py-3 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:ring-3 focus:outline-hidden sm:w-auto"
                href="/sign-in"
              >
                Get Started
              </a>

              <a
                className="block w-full rounded-sm px-12 py-3 text-sm font-medium text-red-600 shadow-sm hover:text-red-700 focus:ring-3 focus:outline-hidden sm:w-auto"
                href="#"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </AuroraBackground>

      {/* Content */}
    </section>
  );
}

export default Hero;
