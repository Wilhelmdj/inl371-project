export type MazeTheme = {
  wall: string;
  wallGlow: string;
  bgA: string;
  bgB: string;
};

export type MazeLayout = {
  cols: number;
  rows: number;
  cellSize: number;
  padding: number;
  walls: Array<{ x1: number; y1: number; x2: number; y2: number }>;
};

function seg(x1: number, y1: number, x2: number, y2: number) {
  return { x1, y1, x2, y2 };
}

export function buildMazeLayout(width: number, height: number): MazeLayout {
  const padding = Math.max(20, Math.min(width, height) * 0.06);
  const cols = 14;
  const rows = 8;
  const cellSize = Math.floor(Math.min((width - padding * 2) / cols, (height - padding * 2) / rows));

  const originX = Math.floor((width - cols * cellSize) / 2);
  const originY = Math.floor((height - rows * cellSize) / 2);

  const toX = (c: number) => originX + c * cellSize;
  const toY = (r: number) => originY + r * cellSize;

  const walls: MazeLayout["walls"] = [];

  // Outer frame
  walls.push(seg(toX(1), toY(1), toX(cols - 1), toY(1)));
  walls.push(seg(toX(1), toY(rows - 1), toX(cols - 1), toY(rows - 1)));
  walls.push(seg(toX(1), toY(1), toX(1), toY(rows - 1)));
  walls.push(seg(toX(cols - 1), toY(1), toX(cols - 1), toY(rows - 1)));

  // Simplified iconic maze-ish blocks (not a full game maze)
  // Horizontal bars
  walls.push(seg(toX(3), toY(2), toX(6), toY(2)));
  walls.push(seg(toX(8), toY(2), toX(11), toY(2)));
  walls.push(seg(toX(3), toY(6), toX(6), toY(6)));
  walls.push(seg(toX(8), toY(6), toX(11), toY(6)));

  // Center pen (ghost house vibe)
  walls.push(seg(toX(6), toY(4), toX(8), toY(4)));
  walls.push(seg(toX(6), toY(3), toX(6), toY(5)));
  walls.push(seg(toX(8), toY(3), toX(8), toY(5)));
  walls.push(seg(toX(6), toY(3), toX(8), toY(3)));
  walls.push(seg(toX(6), toY(5), toX(8), toY(5)));

  // Vertical pillars
  walls.push(seg(toX(4), toY(3), toX(4), toY(5)));
  walls.push(seg(toX(10), toY(3), toX(10), toY(5)));

  // Corner hooks
  walls.push(seg(toX(2), toY(2), toX(2), toY(3)));
  walls.push(seg(toX(2), toY(2), toX(3), toY(2)));
  walls.push(seg(toX(cols - 2), toY(2), toX(cols - 3), toY(2)));
  walls.push(seg(toX(cols - 2), toY(2), toX(cols - 2), toY(3)));
  walls.push(seg(toX(2), toY(rows - 2), toX(3), toY(rows - 2)));
  walls.push(seg(toX(2), toY(rows - 2), toX(2), toY(rows - 3)));
  walls.push(seg(toX(cols - 2), toY(rows - 2), toX(cols - 3), toY(rows - 2)));
  walls.push(seg(toX(cols - 2), toY(rows - 2), toX(cols - 2), toY(rows - 3)));

  return { cols, rows, cellSize, padding, walls };
}

export function drawMaze(
  ctx: CanvasRenderingContext2D,
  layout: MazeLayout,
  theme: MazeTheme,
  intensity: number,
) {
  const { walls } = layout;
  ctx.save();

  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Glow pass
  ctx.globalAlpha = 0.8 * intensity;
  ctx.strokeStyle = theme.wallGlow;
  ctx.lineWidth = 8;
  ctx.shadowColor = theme.wallGlow;
  ctx.shadowBlur = 18;

  ctx.beginPath();
  for (const w of walls) {
    ctx.moveTo(w.x1, w.y1);
    ctx.lineTo(w.x2, w.y2);
  }
  ctx.stroke();

  // Core pass
  ctx.globalAlpha = 0.95 * intensity;
  ctx.shadowBlur = 0;
  ctx.strokeStyle = theme.wall;
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (const w of walls) {
    ctx.moveTo(w.x1, w.y1);
    ctx.lineTo(w.x2, w.y2);
  }
  ctx.stroke();

  ctx.restore();
}

