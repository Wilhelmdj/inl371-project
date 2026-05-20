import { motion } from "framer-motion";
import { ArcadeButton } from "@/components/ui/ArcadeButton";
import { Coin } from "@/components/pixel/Coin";
import { Star } from "@/components/pixel/Star";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

const CHIPS = ["⚡ Fast", "🔒 Secure", "📊 Trackable", "🤖 Automated"];
const TX = [
  { who: "Session w/ M. Dlamini", v: "+25" },
  { who: "Booked: Discrete Math 101", v: "-15" },
  { who: "Streak Bonus", v: "+10" },
  { who: "Session w/ L. Van Wyk", v: "+25" },
];
const BARS = [40, 65, 50, 80, 60, 90, 75];

export function DemoSection() {
  return (
    <section id="demo" className="relative py-24 md:py-32 border-t-4 border-[var(--ink)] bg-night-gradient overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 font-pixel text-[10px] px-3 py-2 rounded-md bg-[var(--mario-red)] text-white border-2 border-[var(--ink)] mb-6">
            ★ LIVE DEMO
          </div>
          <h2 className="font-pixel text-2xl md:text-4xl text-white text-pixel-shadow">See MTRS in motion</h2>
          <p className="mt-3 text-white/80 max-w-2xl mx-auto">
            A glimpse into the Power Apps surface, Power BI dashboard, and the token economy at work.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Power Apps mock device */}
          <ContainerScroll titleComponent={<></>}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="mx-auto w-full max-w-lg glass-strong rounded-3xl border-4 border-[var(--ink)] p-3 arcade-glow-blue">
              <div className="aspect-[9/16] rounded-2xl bg-gradient-to-b from-[var(--sky-deep)] to-[var(--sky-night)] border-2 border-[var(--ink)] p-4 flex flex-col gap-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="font-pixel text-[8px] uppercase opacity-80">MTRS · Power Apps</div>
                  <div className="font-pixel text-[8px] text-[var(--coin)]">9:41</div>
                </div>
                <div className="glass-strong rounded-lg p-3 border-2 border-[var(--ink)]">
                  <div className="font-pixel text-[8px] uppercase opacity-80">M365 Sign In</div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-[var(--ms-blue)] grid place-items-center font-pixel text-[8px]">M</div>
                    <div className="text-xs">student@belgiumcampus.ac.za</div>
                  </div>
                  <div className="mt-3 h-2 rounded bg-[var(--pipe)] w-full" />
                </div>
                <div className="glass-strong rounded-lg p-3 border-2 border-[var(--ink)]">
                  <div className="font-pixel text-[8px] uppercase opacity-80 mb-2">Your Tokens</div>
                  <div className="font-pixel text-2xl text-[var(--coin)] flex items-center gap-2"><Coin size={22} /> 1,240</div>
                </div>
                <div className="glass-strong rounded-lg p-3 border-2 border-[var(--ink)] flex-1">
                  <div className="font-pixel text-[8px] uppercase opacity-80 mb-2">Recent Activity</div>
                  <ul className="space-y-1.5">
                    {TX.map((t) => (
                      <li key={t.who} className="flex items-center justify-between text-[11px]">
                        <span className="opacity-90 truncate">{t.who}</span>
                        <span className={`font-pixel text-[9px] ${t.v.startsWith("+") ? "text-[var(--pipe)]" : "text-[var(--mario-red)]"}`}>{t.v}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="font-pixel text-[10px] uppercase py-3 rounded bg-[var(--mario-red)] text-white border-2 border-[var(--ink)]">Book Session</button>
              </div>
            </div>
            {/* Floating chips */}
            <div className="absolute -top-2 -right-2 hidden md:block">
              <Star size={36} className="animate-float" />
            </div>
          </motion.div>
          </ContainerScroll>

          {/* Analytics dashboard */}
          <ContainerScroll titleComponent={<></>}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-strong rounded-2xl border-4 border-[var(--ink)] p-6 arcade-glow"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-pixel text-[10px] uppercase text-[var(--coin)]">Power BI</div>
                <div className="font-pixel text-sm text-white text-pixel-shadow-sm">Campus Impact</div>
              </div>
              <div className="font-pixel text-[9px] uppercase px-2 py-1 bg-[var(--pipe)] text-[var(--ink)] rounded">LIVE</div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[{l:"Sessions",v:"1,842"},{l:"Tokens",v:"24,120"},{l:"Mentors",v:"127"}].map((s) => (
                <div key={s.l} className="bg-black/30 border-2 border-[var(--ink)] rounded p-2 text-center">
                  <div className="font-pixel text-sm text-[var(--coin)]">{s.v}</div>
                  <div className="font-pixel text-[7px] uppercase opacity-80 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
            {/* Bar chart */}
            <div className="bg-black/30 border-2 border-[var(--ink)] rounded p-4 h-44 flex items-end justify-around gap-2">
              {BARS.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.6 }}
                  className="w-full bg-gradient-to-t from-[var(--ms-blue)] to-[var(--coin)] border-2 border-[var(--ink)]"
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {CHIPS.map((c) => (
                <span key={c} className="font-pixel text-[9px] uppercase px-3 py-1.5 rounded glass border-2 border-[var(--coin)]">
                  {c}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <ArcadeButton variant="primary" size="md">Launch App</ArcadeButton>
              <ArcadeButton variant="secondary" size="md">Use QR Code</ArcadeButton>
            </div>
          </motion.div>
          </ContainerScroll>
        </div>
      </div>
    </section>
  );
}
