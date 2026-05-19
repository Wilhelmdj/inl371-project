import { Coin } from "@/components/pixel/Coin";
import { Star } from "@/components/pixel/Star";

export function Footer() {
  return (
    <footer className="relative bg-night-gradient border-t-4 border-[var(--ink)] mt-0 pt-16 pb-8 overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <span
            key={i}
            className="absolute animate-twinkle"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              animationDelay: `${(i % 5) * 0.4}s`,
            }}
          >
            <Star size={10} />
          </span>
        ))}
      </div>
      <div className="relative mx-auto max-w-7xl px-6 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Coin size={36} />
            <span className="font-pixel text-lg text-[var(--coin)] text-pixel-shadow-sm">MTRS</span>
          </div>
          <p className="text-sm opacity-80 leading-relaxed">
            Mentor Token Reward System — a gamified mentorship platform built for Belgium Campus.
          </p>
        </div>
        <div>
          <h4 className="font-pixel text-[10px] uppercase text-[var(--coin)] mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {["Home", "Features", "How It Works", "Rewards", "Demo"].map((l) => (
              <li key={l}>
                <a href={`#${l.toLowerCase().replace(/ /g, "")}`} className="opacity-80 hover:text-[var(--coin)] hover:opacity-100 transition">{l}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-pixel text-[10px] uppercase text-[var(--coin)] mb-4">Tech Stack</h4>
          <ul className="space-y-2 text-sm">
            {["Microsoft Power Apps", "Power Automate", "Power BI", "Microsoft 365 A3"].map((l) => (
              <li key={l} className="opacity-80">{l}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-pixel text-[10px] uppercase text-[var(--coin)] mb-4">Project Credits</h4>
          <p className="text-sm opacity-80 mb-3">Belgium Campus — Capstone Project</p>
          <ul className="space-y-1 text-xs opacity-70">
            <li>Team Member 01</li>
            <li>Team Member 02</li>
            <li>Team Member 03</li>
            <li>Team Member 04</li>
          </ul>
        </div>
      </div>
      <div className="relative mt-12 pt-8 border-t-2 border-[var(--ink)]/40 mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-pixel text-[10px] text-[var(--coin)] text-pixel-shadow-sm">
          GAME OVER? NEVER. KEEP LEVELING UP.
        </p>
        <p className="text-xs opacity-60">© {new Date().getFullYear()} MTRS · Belgium Campus</p>
      </div>
    </footer>
  );
}
