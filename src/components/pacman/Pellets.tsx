import type { MazeLayout } from "./Maze";

export type Pellet = {
  x: number;
  y: number;
  p: number; // progress along loop [0..1)
};

export type PelletField = {
  pellets: Pellet[];
};

export type PelletOptions = {
  baseCount?: number;
  extraCount?: number;
};

export function buildPellets(
  layout: MazeLayout,
  path: Array<{ x: number; y: number }>,
  options: PelletOptions = {},
): PelletField {
  // Place pellets along the motion path at regular intervals.
  const pellets: Pellet[] = [];
  const count = Math.max(24, Math.floor(options.baseCount ?? 64));
  const offset = Math.random() * 0.02;

  for (let i = 0; i < count; i++) {
    const p = (i / count + offset) % 1;
    const pt = sampleLoop(path, p);
    pellets.push({ x: pt.x, y: pt.y, p });
  }

  // Sprinkle a few extra "side corridor" pellets for depth.
  const extras = Math.max(6, Math.floor(options.extraCount ?? Math.floor((layout.cols * layout.rows) / 6)));
  for (let i = 0; i < extras; i++) {
    const p = (Math.random() + offset) % 1;
    const base = sampleLoop(path, p);
    const jitter = (layout.cellSize * 0.35) * (Math.random() - 0.5);
    const jitterY = (layout.cellSize * 0.25) * (Math.random() - 0.5);
    pellets.push({ x: base.x + jitter, y: base.y + jitterY, p });
  }

  return { pellets };
}

export function drawPellets(
  ctx: CanvasRenderingContext2D,
  field: PelletField,
  pacmanProgress: number,
  theme: { pellet: string; pelletGlow: string },
  intensity: number,
) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  const eatWindow = 0.035; // how far behind pac-man pellets remain "eaten"
  const regenSoftness = 0.015;

  for (const pellet of field.pellets) {
    const d = loopDistance(pellet.p, pacmanProgress);
    const eaten = d < eatWindow;
    const t = eaten ? smoothstep(eatWindow - regenSoftness, eatWindow, d) : 1;
    const alpha = (0.25 + 0.75 * t) * intensity;

    // Core dot
    ctx.globalAlpha = alpha;
    ctx.fillStyle = theme.pellet;
    ctx.beginPath();
    ctx.arc(pellet.x, pellet.y, 1.6, 0, Math.PI * 2);
    ctx.fill();

    // Glow halo
    ctx.globalAlpha = alpha * 0.7;
    ctx.shadowColor = theme.pelletGlow;
    ctx.shadowBlur = 10;
    ctx.fillStyle = theme.pelletGlow;
    ctx.beginPath();
    ctx.arc(pellet.x, pellet.y, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  ctx.restore();
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / Math.max(1e-6, edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function loopDistance(a: number, b: number) {
  // distance from pellet progress a to pacman progress b along the forward direction
  let d = b - a;
  if (d < 0) d += 1;
  return d;
}

function sampleLoop(path: Array<{ x: number; y: number }>, t: number) {
  const n = path.length;
  if (n === 0) return { x: 0, y: 0 };
  const s = (t % 1) * n;
  const i0 = Math.floor(s) % n;
  const i1 = (i0 + 1) % n;
  const f = s - Math.floor(s);
  const a = path[i0];
  const b = path[i1];
  return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
}

