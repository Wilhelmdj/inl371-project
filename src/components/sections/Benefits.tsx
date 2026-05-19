import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { Coin } from "@/components/pixel/Coin";
import { Star } from "@/components/pixel/Star";

const STUDENT = ["Get help faster", "Book sessions with tokens", "Earn tokens by contributing", "Track academic progress"];
const MENTOR = ["Earn tokens automatically", "Reduce admin overhead", "Build mentoring credibility", "Develop leadership skills"];

function List({ items, color }: { items: string[]; color: string }) {
  return (
    <ul className="space-y-3">
      {items.map((t, i) => (
        <motion.li
          key={t}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className="flex items-center gap-3 text-base"
        >
          <span className={`inline-block w-3 h-3 ${color} border-2 border-[var(--ink)]`} />
          {t}
        </motion.li>
      ))}
    </ul>
  );
}

export function Benefits() {
  return (
    <section className="relative py-24 md:py-32 border-t-4 border-[var(--ink)]">
      <div className="absolute inset-0 bg-sky-gradient opacity-90" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 font-pixel text-[10px] px-3 py-2 rounded-md bg-[var(--ink)] text-[var(--coin)] border-2 border-[var(--coin)] mb-6">
            ★ TWO PLAYERS
          </div>
          <h2 className="font-pixel text-2xl md:text-4xl text-[var(--ink)] text-pixel-shadow-sm">Built for both sides</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <GlowCard glow="red">
            <div className="flex items-center gap-3 mb-4">
              <Coin size={32} />
              <h3 className="font-pixel text-lg text-white text-pixel-shadow-sm">For Students</h3>
            </div>
            <List items={STUDENT} color="bg-[var(--mario-red)]" />
          </GlowCard>
          <GlowCard glow="green">
            <div className="flex items-center gap-3 mb-4">
              <Star size={32} />
              <h3 className="font-pixel text-lg text-white text-pixel-shadow-sm">For Mentors</h3>
            </div>
            <List items={MENTOR} color="bg-[var(--pipe)]" />
          </GlowCard>
        </div>
      </div>
    </section>
  );
}
