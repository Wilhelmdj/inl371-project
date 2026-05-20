import { motion } from "framer-motion";

type Props = {
  className?: string;
};

export function CRTOverlay({ className }: Props) {
  return (
    <div className={["pointer-events-none absolute inset-0", className].filter(Boolean).join(" ")}>
      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,0.28) 0px, rgba(255,255,255,0.28) 1px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 6px)",
          backgroundSize: "100% 6px",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 45%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.45) 70%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* Subtle flicker */}
      <motion.div
        className="absolute inset-0 bg-black/10"
        animate={{ opacity: [0.04, 0.1, 0.06, 0.12, 0.05] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ mixBlendMode: "overlay" }}
      />
    </div>
  );
}

