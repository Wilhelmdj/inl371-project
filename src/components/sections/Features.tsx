import { GlowCard } from "@/components/ui/GlowCard";
import { Coin } from "@/components/pixel/Coin";
import { Star } from "@/components/pixel/Star";
import { Mushroom } from "@/components/pixel/Mushroom";
import { Block } from "@/components/pixel/Block";

const FEATURES = [
  { icon: <Star size={36} />, title: "Smart Matching", desc: "Algorithmic mentor-student pairing based on subject, schedule, and goals.", glow: "coin" as const },
  { icon: <Coin size={36} />, title: "Token Economy", desc: "Earn tokens by mentoring, spend tokens to book sessions — a closed-loop reward system.", glow: "coin" as const },
  { icon: <Block variant="brick" size={36} />, title: "Subject-Specific", desc: "Find mentors who specialize in exactly what you're working on this semester.", glow: "red" as const },
  { icon: <Mushroom size={36} />, title: "Scheduling & Tracking", desc: "Plan, attend, and confirm sessions with built-in time-window matching.", glow: "green" as const },
  { icon: <Block variant="question" size={36} />, title: "Power BI Analytics", desc: "Live dashboards visualize impact, tokens, and progress across the campus.", glow: "blue" as const },
  { icon: <Star size={36} />, title: "M365 Secure Login", desc: "Sign in safely with your Microsoft 365 A3 Belgium Campus identity.", glow: "blue" as const },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32 border-t-4 border-[var(--ink)] bg-night-gradient">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 font-pixel text-[10px] px-3 py-2 rounded-md bg-[var(--mario-red)] text-white border-2 border-[var(--ink)] mb-6">
            ★ POWER-UPS
          </div>
          <h2 className="font-pixel text-2xl md:text-4xl text-white text-pixel-shadow">Features that score points</h2>
          <p className="mt-4 text-white/80 max-w-2xl mx-auto">
            Every feature is a power-up engineered for academic impact, built on Microsoft's enterprise stack.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <GlowCard key={f.title} glow={f.glow} delay={i * 0.06}>
              <div className="mb-4 animate-float">{f.icon}</div>
              <h3 className="font-pixel text-sm text-white text-pixel-shadow-sm">{f.title}</h3>
              <p className="mt-3 text-sm opacity-85 leading-relaxed">{f.desc}</p>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
}
