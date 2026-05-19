export function Mushroom({ size = 36, className = "" }: { size?: number; className?: string }) {
  const k = "var(--ink)";
  const r = "var(--mario-red)";
  const w = "oklch(1 0 0)";
  const t = "oklch(0.88 0.05 60)";
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" shapeRendering="crispEdges" className={`pixelated ${className}`} aria-hidden>
      <rect x="2" y="0" width="6" height="1" fill={k}/>
      <rect x="1" y="1" width="8" height="1" fill={k}/>
      <rect x="2" y="1" width="2" height="1" fill={r}/>
      <rect x="4" y="1" width="2" height="1" fill={w}/>
      <rect x="6" y="1" width="2" height="1" fill={r}/>
      <rect x="0" y="2" width="10" height="2" fill={k}/>
      <rect x="1" y="2" width="2" height="2" fill={r}/>
      <rect x="3" y="2" width="4" height="2" fill={w}/>
      <rect x="7" y="2" width="2" height="2" fill={r}/>
      <rect x="0" y="4" width="10" height="1" fill={k}/>
      <rect x="2" y="5" width="6" height="1" fill={k}/>
      <rect x="2" y="5" width="6" height="1" fill={w}/>
      <rect x="3" y="6" width="4" height="3" fill={k}/>
      <rect x="3" y="6" width="4" height="3" fill={t}/>
      <rect x="3" y="9" width="4" height="1" fill={k}/>
    </svg>
  );
}
