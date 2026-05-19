type Variant = "question" | "brick" | "used";
export function Block({ size = 48, variant = "question", className = "" }: { size?: number; variant?: Variant; className?: string }) {
  const k = "var(--ink)";
  if (variant === "question") {
    const o = "var(--coin)";
    const h = "var(--coin-glow)";
    return (
      <svg width={size} height={size} viewBox="0 0 8 8" shapeRendering="crispEdges" className={`pixelated ${className}`} aria-hidden>
        <rect x="0" y="0" width="8" height="8" fill={k}/>
        <rect x="1" y="1" width="6" height="6" fill={o}/>
        <rect x="1" y="1" width="6" height="1" fill={h}/>
        <rect x="1" y="1" width="1" height="6" fill={h}/>
        {/* ? */}
        <rect x="3" y="2" width="2" height="1" fill={k}/>
        <rect x="5" y="3" width="1" height="1" fill={k}/>
        <rect x="4" y="4" width="1" height="1" fill={k}/>
        <rect x="4" y="6" width="1" height="1" fill={k}/>
      </svg>
    );
  }
  if (variant === "used") {
    const b = "var(--brick-deep)";
    return (
      <svg width={size} height={size} viewBox="0 0 8 8" shapeRendering="crispEdges" className={`pixelated ${className}`} aria-hidden>
        <rect x="0" y="0" width="8" height="8" fill={k}/>
        <rect x="1" y="1" width="6" height="6" fill={b}/>
      </svg>
    );
  }
  const r = "var(--brick)";
  const rd = "var(--brick-deep)";
  return (
    <svg width={size} height={size} viewBox="0 0 8 8" shapeRendering="crispEdges" className={`pixelated ${className}`} aria-hidden>
      <rect x="0" y="0" width="8" height="8" fill={k}/>
      <rect x="1" y="1" width="6" height="6" fill={r}/>
      <rect x="1" y="3" width="6" height="1" fill={rd}/>
      <rect x="3" y="1" width="1" height="2" fill={rd}/>
      <rect x="5" y="4" width="1" height="3" fill={rd}/>
    </svg>
  );
}
