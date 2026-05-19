import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { Coin } from "@/components/pixel/Coin";

const STACK = [
  { name: "Microsoft Power Apps", desc: "Low-code app surface for students and mentors.", glow: "blue" as const },
  { name: "Power Automate", desc: "Token rewards & session workflows on autopilot.", glow: "green" as const },
  { name: "Power BI", desc: "Real-time mentorship analytics dashboards.", glow: "coin" as const },
  { name: "Microsoft 365 A3", desc: "Enterprise-grade campus authentication.", glow: "red" as const },
];

export function WhatIsMTRS() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute -top-12 -left-12 w-72 h-72 rounded-full" style={{ background: "radial-gradient(circle, var(--coin) 0%, transparent 70%)", opacity: 0.15 }} />
      <div className="absolute -bottom-12 -right-12 w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, var(--ms-blue) 0%, transparent 70%)", opacity: 0.18 }} />
      <div className="relative mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 font-pixel text-[10px] px-3 py-2 rounded-md bg-[var(--coin)]/20 border-2 border-[var(--coin)] text-[var(--coin)] mb-6">
            <Coin size={16} /> WORLD 1-1 · ABOUT
          </div>
          <h2 className="font-pixel text-2xl md:text-4xl text-white text-pixel-shadow leading-tight">
            What is <span className="text-[var(--coin)]">MTRS</span>?
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/90">
            MTRS (Mentor Token Reward System) helps students access support when they need it —
            and motivates mentors by rewarding meaningful sessions with tokens.
            Students can earn tokens by contributing, or spend tokens to book sessions.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { k: "Mentors", v: "120+" },
              { k: "Sessions", v: "1.8K" },
              { k: "Tokens", v: "24K" },
            ].map((s) => (
              <div key={s.k} className="glass-strong rounded-lg p-3 border-2 border-[var(--ink)] text-center">
                <div className="font-pixel text-lg text-[var(--coin)] text-pixel-shadow-sm">{s.v}</div>
                <div className="font-pixel text-[8px] uppercase opacity-80 mt-1">{s.k}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {STACK.map((s, i) => (
            <GlowCard key={s.name} glow={s.glow} delay={i * 0.08}>
              <div className="font-pixel text-[10px] uppercase text-[var(--coin)] mb-2">Powered By</div>
              <div className="font-pixel text-sm leading-tight text-white">{s.name}</div>
              <p className="mt-3 text-sm opacity-80">{s.desc}</p>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
}
