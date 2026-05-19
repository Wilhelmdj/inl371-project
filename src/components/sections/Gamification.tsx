import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Coin } from "@/components/pixel/Coin";
import { Star } from "@/components/pixel/Star";
import { Mushroom } from "@/components/pixel/Mushroom";

const LEADERBOARD = [
  { rank: 1, name: "M. Dlamini", tokens: 1240, streak: 28 },
  { rank: 2, name: "L. Van Wyk", tokens: 1102, streak: 21 },
  { rank: 3, name: "S. Naidoo", tokens: 980, streak: 17 },
  { rank: 4, name: "T. Botha", tokens: 870, streak: 12 },
  { rank: 5, name: "K. Mokoena", tokens: 745, streak: 9 },
];

const BADGES = [
  { name: "First Session", icon: <Star size={28} /> },
  { name: "10 Sessions", icon: <Coin size={28} /> },
  { name: "Mentor Streak", icon: <Mushroom size={28} /> },
  { name: "Top 10", icon: <Star size={28} /> },
  { name: "Token Master", icon: <Coin size={28} /> },
  { name: "5-Star Rated", icon: <Star size={28} /> },
];

export function Gamification() {
  return (
    <section id="rewards" className="relative py-24 md:py-32 border-t-4 border-[var(--ink)]">
      <div className="absolute inset-0 bg-night-gradient" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 font-pixel text-[10px] px-3 py-2 rounded-md bg-[var(--coin)] text-[var(--ink)] border-2 border-[var(--ink)] mb-6">
            ★ HIGH SCORES
          </div>
          <h2 className="font-pixel text-2xl md:text-4xl text-white text-pixel-shadow">Gamification HUD</h2>
          <p className="mt-3 text-white/80 max-w-2xl mx-auto">
            Real-time XP, leaderboards, badges, and streaks. Mentorship becomes the most rewarding side quest on campus.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* XP + Tokens */}
          <GlowCard glow="coin">
            <div className="font-pixel text-[10px] uppercase text-[var(--coin)] mb-3">Your Token Balance</div>
            <div className="font-pixel text-4xl text-white text-pixel-shadow flex items-center gap-3">
              <Coin size={36} /> <AnimatedCounter to={1240} />
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between font-pixel text-[10px] uppercase mb-2">
                <span>XP Level 7</span><span className="text-[var(--coin)]">3,200 / 5,000</span>
              </div>
              <div className="h-5 bg-black/40 border-2 border-[var(--ink)] rounded overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "64%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[var(--coin)] to-[var(--mario-red)]"
                />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 font-pixel text-[9px] uppercase">
              <span className="px-2 py-1 bg-[var(--mario-red)] text-white rounded">🔥 28-day streak</span>
            </div>
          </GlowCard>

          {/* Leaderboard */}
          <GlowCard glow="blue" className="lg:col-span-1" id="leaderboard">
            <div className="font-pixel text-[10px] uppercase text-[var(--coin)] mb-4">Top Mentors</div>
            <ul className="space-y-2">
              {LEADERBOARD.map((p) => (
                <li key={p.rank} className="flex items-center justify-between bg-black/30 border-2 border-[var(--ink)] rounded px-3 py-2">
                  <div className="flex items-center gap-3">
                    <span className="font-pixel text-xs text-[var(--coin)] w-6">#{p.rank}</span>
                    <span className="text-sm">{p.name}</span>
                  </div>
                  <div className="font-pixel text-[10px] flex items-center gap-1">
                    <Coin size={14} /> {p.tokens}
                  </div>
                </li>
              ))}
            </ul>
          </GlowCard>

          {/* Badges */}
          <GlowCard glow="green">
            <div className="font-pixel text-[10px] uppercase text-[var(--coin)] mb-4">Achievements</div>
            <div className="grid grid-cols-3 gap-3">
              {BADGES.map((b) => (
                <div key={b.name} className="text-center p-3 bg-black/30 border-2 border-[var(--ink)] rounded hover:bg-[var(--coin)]/20 transition">
                  <div className="flex justify-center mb-2 animate-float">{b.icon}</div>
                  <div className="font-pixel text-[7px] uppercase opacity-90 leading-tight">{b.name}</div>
                </div>
              ))}
            </div>
          </GlowCard>
        </div>
      </div>
    </section>
  );
}
