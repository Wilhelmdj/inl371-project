export function Pipe({ height = 120, className = "" }: { height?: number; className?: string }) {
  const g = "var(--pipe)";
  const d = "var(--pipe-deep)";
  const k = "var(--ink)";
  const l = "oklch(0.82 0.18 145)";
  return (
    <svg
      width={height * 0.7}
      height={height}
      viewBox="0 0 14 20"
      shapeRendering="crispEdges"
      className={`pixelated ${className}`}
      aria-hidden
    >
      {/* lip */}
      <rect x="0" y="0" width="14" height="1" fill={k} />
      <rect x="0" y="1" width="14" height="3" fill={g} />
      <rect x="1" y="1" width="2" height="2" fill={l} />
      <rect x="0" y="4" width="14" height="1" fill={k} />
      {/* body */}
      <rect x="1" y="5" width="12" height="15" fill={g} />
      <rect x="2" y="5" width="2" height="15" fill={l} />
      <rect x="10" y="5" width="2" height="15" fill={d} />
      <rect x="0" y="5" width="1" height="15" fill={k} />
      <rect x="13" y="5" width="1" height="15" fill={k} />
    </svg>
  );
}
