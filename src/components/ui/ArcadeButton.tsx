import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

type Props = Omit<HTMLMotionProps<"button">, "children"> & {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
};

const variants: Record<Variant, string> = {
  primary: "bg-[var(--mario-red)] text-white border-[var(--ink)] arcade-glow-red",
  secondary: "bg-[var(--coin)] text-[var(--ink)] border-[var(--ink)] arcade-glow",
  ghost: "bg-[var(--ms-blue)] text-white border-[var(--ink)] arcade-glow-blue",
};
const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-[10px]",
  md: "px-6 py-3 text-[11px]",
  lg: "px-8 py-4 text-sm",
};

export const ArcadeButton = forwardRef<HTMLButtonElement, Props>(
  ({ variant = "primary", size = "md", className = "", children, ...rest }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ y: -4, scale: 1.03 }}
        whileTap={{ y: 2, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
        className={`font-pixel inline-flex items-center gap-2 border-4 rounded-md cursor-pointer select-none uppercase tracking-wider ${variants[variant]} ${sizes[size]} ${className}`}
        style={{ boxShadow: "0 6px 0 var(--ink), 0 10px 24px oklch(0 0 0 / 0.4)" }}
        {...rest}
      >
        {children}
      </motion.button>
    );
  }
);
ArcadeButton.displayName = "ArcadeButton";
