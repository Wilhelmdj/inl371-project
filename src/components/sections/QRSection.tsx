import { motion } from "framer-motion";
import { Star } from "@/components/pixel/Star";
import { Coin } from "@/components/pixel/Coin";

// Static pixel QR-looking pattern (not a scannable code — visual only)
function FauxQR() {
  // 21x21 grid
  const N = 21;
  const cells: boolean[][] = Array.from({ length: N }, () => Array(N).fill(false));
  // deterministic pseudo-random
  let seed = 7;
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) cells[y][x] = rand() > 0.55;
  // finder patterns
  const drawFinder = (ox: number, oy: number) => {
    for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) {
      const on = x === 0 || x === 6 || y === 0 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4);
      cells[oy + y][ox + x] = on;
    }
  };
  drawFinder(0, 0); drawFinder(N - 7, 0); drawFinder(0, N - 7);

  return (
    <svg viewBox={`0 0 ${N} ${N}`} shapeRendering="crispEdges" className="w-full h-full pixelated">
      <rect width={N} height={N} fill="white" />
      {cells.map((row, y) => row.map((on, x) => on ? <rect key={`${y}-${x}`} x={x} y={y} width={1} height={1} fill="black" /> : null))}
    </svg>
  );
}

export function QRSection() {
  return (
    <section id="qr" className="relative py-24 md:py-32 border-t-4 border-[var(--ink)] overflow-hidden">
      <div className="absolute inset-0 bg-sky-gradient opacity-80" />
      {/* particle dots */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className="absolute animate-float" style={{ left: `${(i*41)%100}%`, top: `${(i*23)%100}%`, animationDelay: `${(i%6)*0.3}s` }}>
            <Coin size={16} />
          </span>
        ))}
      </div>
      <div className="relative mx-auto max-w-5xl px-6 grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 font-pixel text-[10px] px-3 py-2 rounded-md bg-[var(--ink)] text-[var(--coin)] border-2 border-[var(--coin)] mb-4">
            ★ QR ACCESS
          </div>
          <h2 className="font-pixel text-2xl md:text-4xl text-[var(--ink)] text-pixel-shadow-sm leading-tight">Scan to access MTRS</h2>
          <p className="mt-4 text-[var(--ink)]/90 text-lg">
            Perfect for demos and campus presentations. Point your phone, jump in, level up.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {["Microsoft 365 SSO", "Mobile-ready", "Demo Mode"].map(t => (
              <span key={t} className="font-pixel text-[9px] uppercase px-3 py-2 bg-[var(--ink)] text-[var(--coin)] rounded border-2 border-[var(--coin)]">{t}</span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: "spring" }}
          className="relative mx-auto"
        >
          <div className="relative w-[280px] h-[280px] md:w-[340px] md:h-[340px] glass-strong rounded-2xl border-4 border-[var(--ink)] p-5 arcade-glow">
            <div className="absolute -top-3 -left-3"><Star size={28} /></div>
            <div className="absolute -top-3 -right-3"><Star size={28} /></div>
            <div className="absolute -bottom-3 -left-3"><Star size={28} /></div>
            <div className="absolute -bottom-3 -right-3"><Star size={28} /></div>
            <div className="relative w-full h-full overflow-hidden rounded">
              <FauxQR />
              {/* scan line */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-b from-[var(--coin)] to-transparent shadow-[0_0_18px_var(--coin)] animate-scan" />
            </div>
          </div>
          <div className="text-center mt-4 font-pixel text-[10px] uppercase text-[var(--ink)]">★ Insert Coin to Begin ★</div>
        </motion.div>
      </div>
    </section>
  );
}
