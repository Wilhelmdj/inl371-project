import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function StatCard({
  label, value, accent = "coin", icon, className = "", delay = 0,
}: { label: string; value: string; accent?: "coin" | "blue" | "green" | "red"; icon?: ReactNode; className?: string; delay?: number }) {
  const ring: Record<string, string> = {
    coin: "border-[var(--coin)]",
    blue: "border-[var(--ms-blue)]",
    green: "border-[var(--pipe)]",
    red: "border-[var(--mario-red)]",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 18 }}
      className={`glass-strong rounded-lg p-3 border-2 ${ring[accent]} pixel-outline animate-float ${className}`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <div className="font-pixel text-[8px] uppercase opacity-80">{label}</div>
          <div className="font-pixel text-sm mt-1 text-pixel-shadow-sm">{value}</div>
        </div>
      </div>
    </motion.div>
  );
}
