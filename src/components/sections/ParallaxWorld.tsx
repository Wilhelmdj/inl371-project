import { Cloud } from "@/components/pixel/Cloud";
import { Mountain } from "@/components/pixel/Mountain";
import { Bush } from "@/components/pixel/Bush";
import { Star } from "@/components/pixel/Star";

export function ParallaxWorld() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-sky-gradient">
      {/* Stars (subtle, day) */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="absolute animate-twinkle"
            style={{
              left: `${(i * 53) % 100}%`,
              top: `${(i * 19) % 40}%`,
              animationDelay: `${(i % 6) * 0.3}s`,
            }}
          >
            <Star size={12} />
          </span>
        ))}
      </div>

      {/* Cloud layer slow */}
      <div className="absolute top-[10%] left-0 right-0 h-24 overflow-hidden pointer-events-none">
        <div className="flex gap-32 w-[200%] animate-drift-slow">
          {Array.from({ length: 8 }).map((_, i) => (
            <Cloud key={`c1-${i}`} size={120} className="opacity-90" />
          ))}
        </div>
      </div>
      {/* Cloud layer fast */}
      <div className="absolute top-[28%] left-0 right-0 h-20 overflow-hidden pointer-events-none">
        <div className="flex gap-24 w-[200%] animate-drift-med">
          {Array.from({ length: 10 }).map((_, i) => (
            <Cloud key={`c2-${i}`} size={80} className="opacity-80" />
          ))}
        </div>
      </div>

      {/* Mountains */}
      <div className="absolute bottom-[18%] left-0 right-0 flex items-end justify-around opacity-90 pointer-events-none">
        <Mountain width={260} />
        <Mountain width={340} />
        <Mountain width={220} />
        <Mountain width={300} />
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-[18%]">
        <div className="h-3 bg-[var(--ink)]" />
        <div className="h-3" style={{ background: "var(--grass)" }} />
        <div className="h-[calc(100%-1.5rem)]" style={{
          background: "repeating-linear-gradient(45deg, oklch(0.55 0.18 40), oklch(0.55 0.18 40) 8px, oklch(0.48 0.16 35) 8px, oklch(0.48 0.16 35) 16px)"
        }} />
      </div>

      {/* Bushes */}
      <div className="absolute bottom-[12%] left-0 right-0 flex items-end justify-around pointer-events-none">
        <Bush width={140} />
        <Bush width={100} />
        <Bush width={160} />
        <Bush width={120} />
      </div>
    </div>
  );
}
