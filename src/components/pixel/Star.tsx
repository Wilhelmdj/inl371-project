export function Star({ size = 24, className = "" }: { size?: number; className?: string }) {
  const k = "var(--ink)";
  const y = "var(--star)";
  const w = "oklch(1 0 0)";
  return (
    <svg width={size} height={size} viewBox="0 0 8 8" shapeRendering="crispEdges" className={`pixelated ${className}`} aria-hidden>
      <rect x="3" y="0" width="2" height="1" fill={k}/>
      <rect x="2" y="1" width="1" height="1" fill={k}/>
      <rect x="3" y="1" width="2" height="1" fill={y}/>
      <rect x="5" y="1" width="1" height="1" fill={k}/>
      <rect x="0" y="2" width="1" height="1" fill={k}/>
      <rect x="1" y="2" width="6" height="1" fill={y}/>
      <rect x="2" y="2" width="2" height="1" fill={w}/>
      <rect x="7" y="2" width="1" height="1" fill={k}/>
      <rect x="0" y="3" width="8" height="1" fill={k}/>
      <rect x="1" y="3" width="6" height="1" fill={y}/>
      <rect x="0" y="4" width="1" height="1" fill={k}/>
      <rect x="1" y="4" width="6" height="1" fill={y}/>
      <rect x="7" y="4" width="1" height="1" fill={k}/>
      <rect x="1" y="5" width="1" height="1" fill={k}/>
      <rect x="2" y="5" width="4" height="1" fill={y}/>
      <rect x="6" y="5" width="1" height="1" fill={k}/>
      <rect x="2" y="6" width="1" height="1" fill={k}/>
      <rect x="3" y="6" width="2" height="1" fill={y}/>
      <rect x="5" y="6" width="1" height="1" fill={k}/>
      <rect x="2" y="7" width="1" height="1" fill={k}/>
      <rect x="5" y="7" width="1" height="1" fill={k}/>
    </svg>
  );
}
