import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  glow?: "coin" | "blue" | "red" | "green";
  delay?: number;
};

const glowMap = {
  coin: "arcade-glow",
  blue: "arcade-glow-blue",
  red: "arcade-glow-red",
  green: "arcade-glow-green",
};

export function GlowCard({ children, className = "", glow = "coin", delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`relative glass-strong rounded-xl p-6 border-4 border-[var(--ink)] hover:${glowMap[glow]} transition-shadow ${className}`}
      style={{ boxShadow: "0 6px 0 var(--ink), 0 12px 32px oklch(0 0 0 / 0.45)" }}
    >
      {children}
    </motion.div>
  );
}
