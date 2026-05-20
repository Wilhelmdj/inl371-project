import { motion } from "framer-motion";
import { PacmanBackground } from "@/components/pacman/PacmanBackground";
import { Coin } from "@/components/pixel/Coin";
import { Star } from "@/components/pixel/Star";

const LEVELS = [
  { n: 1, t: "Sign In", d: "Use your Microsoft 365 campus account to access MTRS securely." },
  { n: 2, t: "Request or Offer Help", d: "Choose a subject, share your goal, and set a preferred time window." },
  { n: 3, t: "Match & Schedule", d: "MTRS suggests the best-fit mentor, then confirms the session." },
  { n: 4, t: "Complete & Confirm", d: "Session outcomes are recorded for quality and progress tracking." },
  { n: 5, t: "Tokens + Analytics", d: "Tokens are awarded automatically and visualized through Power BI dashboards." },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative overflow-hidden border-t-4 border-[var(--ink)] py-24 md:py-32">
      <PacmanBackground />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-md border-2 border-[var(--coin)] bg-[#0a0f3a] px-3 py-2 font-pixel text-[10px] text-[var(--coin)]">
            FREE ARCADE DEMO
          </div>
          <h2 className="font-pixel text-2xl text-white text-pixel-shadow-sm md:text-4xl">How It Works</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/80">
            A retro arcade maze theme behind our flow—sign in, request help, match, and win tokens in a Pac-Man-inspired world.
          </p>
        </div>

        <div className="relative grid items-end gap-6 pb-16 md:grid-cols-5 md:gap-3">
          {LEVELS.map((lv, i) => (
            <motion.div
              key={lv.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className={`relative z-10 ${i % 2 ? "md:translate-y-8" : "md:-translate-y-8"}`}
            >
              <div className="glass-strong arcade-glow rounded-xl border-4 border-white/15 bg-[#0a0f3a]/85 p-5 text-center backdrop-blur-md">
                <div className="mb-3 flex items-center justify-center">
                  <div className="relative">
                    <Star size={48} />
                    <span className="absolute inset-0 -mt-1 flex items-center justify-center font-pixel text-xs text-[var(--ink)]">
                      {lv.n}
                    </span>
                  </div>
                </div>
                <div className="font-pixel text-[9px] uppercase text-[var(--mario-red)]">Level {lv.n}</div>
                <h3 className="mt-2 font-pixel text-sm text-white text-pixel-shadow-sm">{lv.t}</h3>
                <p className="mt-3 text-xs leading-relaxed opacity-90">{lv.d}</p>
                <div className="mt-3 flex items-center justify-center gap-1">
                  {Array.from({ length: lv.n }).map((_, j) => (
                    <Coin key={j} size={14} />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
