type Props = { size?: number; className?: string };
export function Coin({ size = 24, className = "" }: Props) {
  const s = size / 8;
  // 8x8 pixel coin
  const p = "var(--ink)";
  const y = "var(--coin)";
  const h = "var(--coin-glow)";
  const grid: (string | null)[][] = [
    [null, null, p, p, p, p, null, null],
    [null, p, y, h, h, y, p, null],
    [p, y, h, h, y, y, h, p],
    [p, y, h, y, y, y, h, p],
    [p, y, h, y, y, y, h, p],
    [p, y, h, h, y, y, h, p],
    [null, p, y, h, h, y, p, null],
    [null, null, p, p, p, p, null, null],
  ];
  return (
    <div
      className={`inline-block pixelated animate-coin-flip ${className}`}
      style={{ width: size, height: size, lineHeight: 0 }}
      aria-hidden
    >
      <svg width={size} height={size} viewBox="0 0 8 8" shapeRendering="crispEdges">
        {grid.map((row, ri) =>
          row.map((c, ci) =>
            c ? <rect key={`${ri}-${ci}`} x={ci} y={ri} width={1} height={1} fill={c} /> : null
          )
        )}
      </svg>
    </div>
  );
}
