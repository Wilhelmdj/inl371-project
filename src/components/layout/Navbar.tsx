import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coin } from "@/components/pixel/Coin";

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#how", label: "How It Works" },
  { href: "#rewards", label: "Rewards" },
  { href: "#leaderboard", label: "Leaderboard" },
  { href: "#demo", label: "Demo" },
  { href: "#qr", label: "QR Access" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div
          className={`flex items-center justify-between rounded-2xl border-4 border-[var(--ink)] px-4 py-2 transition-all ${
            scrolled ? "glass-strong" : "glass"
          }`}
          style={{ boxShadow: "0 4px 0 var(--ink), 0 10px 30px oklch(0 0 0 / 0.4)" }}
        >
          <a href="#home" className="flex items-center gap-2 group">
            <Coin size={28} />
            <span className="font-pixel text-sm text-pixel-shadow-sm text-[var(--coin)]">
              MTRS
            </span>
          </a>
          <ul className="hidden lg:flex items-center gap-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="font-pixel text-[9px] uppercase px-3 py-2 rounded-md hover:bg-[var(--coin)] hover:text-[var(--ink)] transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#demo"
            className="hidden lg:inline-flex font-pixel text-[9px] uppercase px-4 py-2 rounded-md bg-[var(--mario-red)] text-white border-2 border-[var(--ink)] arcade-glow-red"
          >
            Play Demo
          </a>
          <button
            className="lg:hidden font-pixel text-[10px] text-[var(--coin)]"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? "CLOSE" : "MENU"}
          </button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden mt-2 glass-strong rounded-2xl border-4 border-[var(--ink)]"
            >
              <ul className="p-2">
                {LINKS.map((l) => (
                  <li key={l.href}>
                    <a
                      onClick={() => setOpen(false)}
                      href={l.href}
                      className="block font-pixel text-[10px] uppercase px-4 py-3 rounded-md hover:bg-[var(--coin)] hover:text-[var(--ink)]"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
