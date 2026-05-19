export function Bush({ width = 120, className = "" }: { width?: number; className?: string }) {
  const g = "var(--grass)";
  const k = "var(--ink)";
  return (
    <svg width={width} height={width * 0.4} viewBox="0 0 20 8" shapeRendering="crispEdges" className={`pixelated ${className}`} aria-hidden>
      <rect x="2" y="3" width="2" height="2" fill={k}/>
      <rect x="1" y="5" width="18" height="3" fill={g}/>
      <rect x="3" y="2" width="4" height="3" fill={g}/>
      <rect x="8" y="3" width="5" height="2" fill={g}/>
      <rect x="13" y="2" width="4" height="3" fill={g}/>
      <rect x="0" y="6" width="20" height="1" fill={k}/>
    </svg>
  );
}
