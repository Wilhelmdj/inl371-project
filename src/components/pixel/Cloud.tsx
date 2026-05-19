export function Cloud({ size = 96, className = "" }: { size?: number; className?: string }) {
  const w = "var(--cloud)";
  const k = "var(--ink)";
  const grid = [
    "...kkkk....kkkk.",
    "..kwwwwk..kwwwk.",
    ".kwwwwwwkkwwwwk.",
    "kwwwwwwwwwwwwwk.",
    "kwwwwwwwwwwwwwwk",
    ".kwwwwwwwwwwwwk.",
    "..kkkkkkkkkkkk..",
  ];
  return (
    <svg
      width={size}
      height={(size * grid.length) / 16}
      viewBox={`0 0 16 ${grid.length}`}
      shapeRendering="crispEdges"
      className={`pixelated ${className}`}
      aria-hidden
    >
      {grid.map((row, ri) =>
        row.split("").map((c, ci) =>
          c === "w" ? <rect key={`${ri}-${ci}`} x={ci} y={ri} width={1} height={1} fill={w} /> :
          c === "k" ? <rect key={`${ri}-${ci}`} x={ci} y={ri} width={1} height={1} fill={k} /> : null
        )
      )}
    </svg>
  );
}
