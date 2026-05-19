import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { WhatIsMTRS } from "@/components/sections/WhatIsMTRS";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Gamification } from "@/components/sections/Gamification";
import { Benefits } from "@/components/sections/Benefits";
import { DemoSection } from "@/components/sections/DemoSection";
import { QRSection } from "@/components/sections/QRSection";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <WhatIsMTRS />
      <Features />
      <HowItWorks />
      <Gamification />
      <Benefits />
      <DemoSection />
      <QRSection />
      <Footer />
    </main>
  );
}
