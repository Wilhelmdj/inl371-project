import { motion } from "framer-motion";
import { Coin } from "@/components/pixel/Coin";
import { Star } from "@/components/pixel/Star";
import { Pipe } from "@/components/pixel/Pipe";

const LEVELS = [
  { n: 1, t: "Sign In", d: "Use your Microsoft 365 campus account to access MTRS securely." },
  { n: 2, t: "Request or Offer Help", d: "Choose a subject, share your goal, and set a preferred time window." },
  { n: 3, t: "Match & Schedule", d: "MTRS suggests the best-fit mentor, then confirms the session." },
  { n: 4, t: "Complete & Confirm", d: "Session outcomes are recorded for quality and progress tracking." },
  { n: 5, t: "Tokens + Analytics", d: "Tokens are awarded automatically and visualized through Power BI dashboards." },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-24 md:py-32 overflow-hidden border-t-4 border-[var(--ink)]">
      <div className="absolute inset-0 bg-sky-gradient opacity-90" />
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-[var(--ink)]" />
      <div className="absolute bottom-3 left-0 right-0 h-3" style={{ background: "var(--grass)" }} />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 font-pixel text-[10px] px-3 py-2 rounded-md bg-[var(--ink)] text-[var(--coin)] border-2 border-[var(--coin)] mb-6">
            ★ WORLD MAP
          </div>
          <h2 className="font-pixel text-2xl md:text-4xl text-[var(--ink)] text-pixel-shadow-sm">How It Works</h2>
          <p className="mt-3 text-[var(--ink)]/80 max-w-2xl mx-auto">
            Five levels from sign-in to rewards. Beat each one to earn tokens and progress.
          </p>
        </div>

        {/* Path connecting levels */}
        <div className="relative grid md:grid-cols-5 gap-6 md:gap-3 items-end pb-16">
          <svg className="hidden md:block absolute inset-x-0 top-1/2 -z-0 w-full h-24 pointer-events-none" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <motion.path
              d="M50,50 Q150,10 250,50 T450,50 T650,50 T850,50 L950,50"
              fill="none"
              stroke="var(--ink)"
              strokeWidth="6"
              strokeDasharray="10 10"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2 }}
            />
          </svg>

          {LEVELS.map((lv, i) => (
            <motion.div
              key={lv.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className={`relative z-10 ${i % 2 ? "md:translate-y-8" : "md:-translate-y-8"}`}
            >
              <div className="glass-strong rounded-xl p-5 border-4 border-[var(--ink)] arcade-glow text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="relative">
                    <Star size={48} />
                    <span className="absolute inset-0 flex items-center justify-center font-pixel text-xs text-[var(--ink)] -mt-1">
                      {lv.n}
                    </span>
                  </div>
                </div>
                <div className="font-pixel text-[9px] uppercase text-[var(--mario-red)]">Level {lv.n}</div>
                <h3 className="font-pixel text-sm mt-2 text-white text-pixel-shadow-sm">{lv.t}</h3>
                <p className="mt-3 text-xs opacity-90 leading-relaxed">{lv.d}</p>
                <div className="mt-3 flex items-center justify-center gap-1">
                  {Array.from({ length: lv.n }).map((_, j) => <Coin key={j} size={14} />)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Flag at end */}
        <div className="absolute right-8 bottom-12 z-10 hidden md:flex flex-col items-center">
          <div className="w-1 h-24 bg-[var(--ink)]" />
          <Pipe height={80} />
        </div>
      </div>
    </section>
  );
}
