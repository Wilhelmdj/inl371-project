import { motion } from "framer-motion";
import { ParallaxWorld } from "./ParallaxWorld";
import { FlappyGame } from "@/components/game/FlappyGame";
import { ArcadeButton } from "@/components/ui/ArcadeButton";
import { Coin } from "@/components/pixel/Coin";
import { Star } from "@/components/pixel/Star";
import { Mushroom } from "@/components/pixel/Mushroom";
import gameBoyImage from "@/assets/GameBoy.png";

export function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[100vh] w-full overflow-hidden scanlines border-b-4 border-[var(--ink)]"
    >
      <ParallaxWorld />

      {/* Floating decorations */}
      <div className="absolute top-32 right-[12%] z-20 pointer-events-none animate-float-slow">
        <Star size={48} />
      </div>
      <div className="absolute top-44 left-[8%] z-20 pointer-events-none animate-bob">
        <Coin size={42} />
      </div>
      <div className="absolute top-72 right-[26%] z-20 pointer-events-none animate-float">
        <Mushroom size={56} />
      </div>

      {/* Foreground content */}
      <div className="relative z-30 mx-auto max-w-7xl px-6 pt-40 pb-24 min-h-[100vh] grid gap-8 lg:grid-cols-[1.55fr_1fr] items-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl pointer-events-auto"
        >
          <div className="inline-flex items-center gap-2 font-pixel text-[10px] uppercase px-3 py-2 rounded-md bg-[var(--ink)] text-[var(--coin)] border-2 border-[var(--coin)] mb-6 animate-blink">
            ★ Belgium Campus · Press Start
          </div>
          <h1 className="font-pixel text-3xl sm:text-5xl md:text-6xl text-white text-pixel-shadow leading-[1.15]">
            <span className="text-[var(--coin)]">Level Up</span><br />
            Student Success
          </h1>
          <p className="font-pixel text-xs sm:text-sm mt-6 text-white text-pixel-shadow-sm">
            Mentoring that rewards impact — with tokens.
          </p>
          <p className="mt-6 text-base md:text-lg text-white/95 max-w-2xl leading-relaxed drop-shadow-[2px_2px_0_var(--ink)]">
            MTRS connects students who need academic support with qualified peer mentors at Belgium Campus.
            Mentors earn tokens for completed sessions, while students can earn, spend, and grow — all with
            secure Microsoft 365 A3 sign-in.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ArcadeButton variant="primary" size="lg">▶ Press Start</ArcadeButton>
            <ArcadeButton variant="secondary" size="lg">🚀 Launch MTRS App</ArcadeButton>
            <ArcadeButton variant="ghost" size="lg">📖 Learn How It Works</ArcadeButton>
          </div>
        </motion.div>

        <div className="relative pointer-events-auto min-h-[420px] overflow-hidden rounded-[28px] border-4 border-[var(--ink)] bg-[rgba(4,12,33,0.95)] shadow-[0_0_68px_rgba(0,0,0,0.4)]">
          <img
            src={gameBoyImage}
            alt="Game Boy"
            className="pointer-events-none absolute inset-0 z-0 h-full w-full object-contain object-center opacity-95 drop-shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
            draggable={false}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,96,96,0.12),transparent_22%)] pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-12 border-b border-white/10 bg-[rgba(0,0,0,0.12)] backdrop-blur-[8px] pointer-events-none" />
          <div className="absolute top-4 left-4 z-20 font-pixel text-[9px] uppercase tracking-[0.3em] text-[var(--mario-red)] pointer-events-none">Play Flappy</div>
          <FlappyGame />
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 font-pixel text-[9px] text-white text-pixel-shadow-sm animate-bob">
        ↓ SCROLL TO CONTINUE
      </div>
    </section>
  );
}
