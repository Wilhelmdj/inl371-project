export function Mountain({ width = 240, className = "" }: { width?: number; className?: string }) {
  return (
    <svg width={width} height={width * 0.55} viewBox="0 0 24 14" shapeRendering="crispEdges" className={`pixelated ${className}`} aria-hidden>
      <polygon points="12,1 22,13 2,13" fill="var(--sky-deep)" />
      <polygon points="12,1 14,4 10,4" fill="oklch(0.94 0.02 250)" />
      <polygon points="14,4 16,6 12,6 12,4" fill="oklch(0.94 0.02 250)" />
    </svg>
  );
}
