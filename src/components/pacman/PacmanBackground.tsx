import { useEffect, useMemo, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AnimationLoop } from "./AnimationLoop";
import { buildMazeLayout, drawMaze, type MazeTheme } from "./Maze";
import { buildPellets, drawPellets, type PelletField } from "./Pellets";
import { createGhosts, drawGhost } from "./Ghosts";
import { CRTOverlay } from "./CRTOverlay";

type Props = {
  className?: string;
  overlayOpacity?: number;
};

type Particle = { x: number; y: number; vx: number; vy: number; life: number; max: number };

export function PacmanBackground({ className, overlayOpacity = 0.62 }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();

  const ghosts = useMemo(() => createGhosts(), []);
  const particlesRef = useRef<Particle[]>([]);
  const pelletFieldRef = useRef<PelletField | null>(null);
  const layoutRef = useRef<ReturnType<typeof buildMazeLayout> | null>(null);
  const pathRef = useRef<ArcPath | null>(null);
  const intersectingRef = useRef(true);
  const docVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const theme: MazeTheme & {
      pellet: string;
      pelletGlow: string;
      pacman: string;
      pacmanGlow: string;
    } = {
      wall: "rgba(96,180,255,0.92)",
      wallGlow: "rgba(48,210,255,0.9)",
      bgA: "#050816",
      bgB: "#080a1a",
      pellet: "rgba(255,240,200,0.95)",
      pelletGlow: "rgba(255,210,120,0.55)",
      pacman: "rgba(255,230,70,0.98)",
      pacmanGlow: "rgba(255,210,80,0.65)",
    };

    let width = 1;
    let height = 1;
    let dpr = 1;
    let targetFps = 45;
    let renderAccumulatorMs = 0;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      const isSmall = width < 680 || height < 520;
      const maxDpr = reducedMotion ? 1.25 : isSmall ? 1.5 : 2;
      dpr = Math.min(maxDpr, Math.max(1, window.devicePixelRatio || 1));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Cache layout + loop path + pellet field on resize (avoid rebuilding per frame).
      const layout = buildMazeLayout(width, height);
      layoutRef.current = layout;
      const path = buildLoopPath(layout);
      pathRef.current = buildArcPath(path);

      const mobile = width < 640;
      const baseCount = reducedMotion ? 28 : mobile ? 40 : 64;
      const extraCount = reducedMotion ? 8 : mobile ? 10 : 14;
      pelletFieldRef.current = buildPellets(layout, path, { baseCount, extraCount });

      targetFps = reducedMotion ? 24 : mobile ? 30 : 45;
      renderAccumulatorMs = 0;
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => updateSize());
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        intersectingRef.current = entries.some((e) => e.isIntersecting);
      },
      { root: null, threshold: 0.06 },
    );
    intersectionObserver.observe(container);

    const onVisibility = () => {
      docVisibleRef.current = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibility, { passive: true });

    let t = Math.random();
    const secondsPerLoop = reducedMotion ? 18 : 10.5;

    const loop = new AnimationLoop(({ dtMs, nowMs }) => {
      if (!intersectingRef.current || !docVisibleRef.current) return;

      renderAccumulatorMs += dtMs;
      const minFrameMs = 1000 / targetFps;
      if (renderAccumulatorMs < minFrameMs) return;
      // Keep time stable if we miss frames.
      const stepMs = Math.min(64, renderAccumulatorMs);
      renderAccumulatorMs = 0;

      t = (t + stepMs / 1000 / secondsPerLoop) % 1;
      const intensity = reducedMotion ? 0.72 : 1;

      const layout = layoutRef.current ?? buildMazeLayout(width, height);
      const arcPath = pathRef.current ?? buildArcPath(buildLoopPath(layout));

      // Background
      ctx.clearRect(0, 0, width, height);
      drawBackground(ctx, width, height, theme, nowMs, intensity);

      // Parallax depth: subtle offset for maze/pellets
      const px = Math.sin(nowMs / 2100) * 3.0;
      const py = Math.cos(nowMs / 2600) * 2.0;
      ctx.save();
      ctx.translate(px, py);

      drawMaze(ctx, layout, theme, intensity);
      if (pelletFieldRef.current) drawPellets(ctx, pelletFieldRef.current, t, theme, intensity);

      // Pac-Man position and heading
      const pac = sampleArcPathWithTangent(arcPath, t);
      const size = Math.max(10, Math.min(18, layout.cellSize * 0.42));
      drawPacman(ctx, pac.x, pac.y, size, pac.angle, nowMs, theme, intensity);
      emitTrail(particlesRef.current, pac.x, pac.y, pac.angle, layout.cellSize, reducedMotion);

      // Ghosts chase (fake): offset along same loop with slight lateral wiggle
      for (const g of ghosts) {
        const gt = (t - g.phase + 1) % 1;
        const gp = sampleArcPathWithTangent(arcPath, gt);
        const lateral = Math.sin((nowMs / 340) + g.phase * 10) * (layout.cellSize * 0.08);
        const gx = gp.x + Math.cos(gp.angle + Math.PI / 2) * lateral;
        const gy = gp.y + Math.sin(gp.angle + Math.PI / 2) * lateral;
        drawGhost(ctx, gx, gy, size * 0.95, g, nowMs / 240, intensity);
      }

      // Particle trail
      drawParticles(ctx, particlesRef.current, intensity);
      ctx.restore();

      // Global overlay glow wash
      drawGlowWash(ctx, width, height, nowMs, intensity);
    });

    loop.start();

    return () => {
      loop.stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [ghosts, reducedMotion]);

  return (
    <motion.div
      ref={containerRef}
      className={["absolute inset-0 -z-10", className].filter(Boolean).join(" ")}
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Dark readability overlay */}
      <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />

      <CRTOverlay />
    </motion.div>
  );
}

function buildLoopPath(layout: { cols: number; rows: number; cellSize: number; originX: number; originY: number }) {
  const cs = layout.cellSize;

  const cx = (col: number) => layout.originX + (col + 0.5) * cs;
  const cy = (row: number) => layout.originY + (row + 0.5) * cs;

  // Corridor-center loop (keeps motion between maze walls).
  // Using half-cell centers means we're visually "in the hallway", not riding wall strokes.
  return [
    { x: cx(2), y: cy(1) },
    { x: cx(11), y: cy(1) },
    { x: cx(11), y: cy(2) },
    { x: cx(8), y: cy(2) },
    { x: cx(8), y: cy(5) },
    { x: cx(11), y: cy(5) },
    { x: cx(11), y: cy(6) },
    { x: cx(2), y: cy(6) },
    { x: cx(2), y: cy(5) },
    { x: cx(5), y: cy(5) },
    { x: cx(5), y: cy(2) },
    { x: cx(2), y: cy(2) },
  ];
}

type ArcPath = {
  points: Array<{ x: number; y: number }>;
  cumLen: number[]; // cumLen[0]=0 ... cumLen[n]=total
  total: number;
};

function buildArcPath(points: Array<{ x: number; y: number }>): ArcPath {
  const n = points.length;
  const cumLen: number[] = [0];
  let total = 0;
  for (let i = 0; i < n; i++) {
    const a = points[i]!;
    const b = points[(i + 1) % n]!;
    total += Math.hypot(b.x - a.x, b.y - a.y);
    cumLen.push(total);
  }
  return { points, cumLen, total: Math.max(1e-6, total) };
}

function sampleArcPathWithTangent(path: ArcPath, t: number) {
  const dist = ((t % 1) + 1) % 1;
  const target = dist * path.total;

  // Binary search segment index in cumLen
  let lo = 0;
  let hi = path.cumLen.length - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (path.cumLen[mid]! < target) lo = mid + 1;
    else hi = mid;
  }

  const seg = Math.max(1, lo) - 1;
  const a = path.points[seg % path.points.length]!;
  const b = path.points[(seg + 1) % path.points.length]!;
  const segStart = path.cumLen[seg]!;
  const segEnd = path.cumLen[seg + 1]!;
  const f = (target - segStart) / Math.max(1e-6, segEnd - segStart);

  const x = a.x + (b.x - a.x) * f;
  const y = a.y + (b.y - a.y) * f;
  const angle = Math.atan2(b.y - a.y, b.x - a.x);
  return { x, y, angle };
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: { bgA: string; bgB: string },
  nowMs: number,
  intensity: number,
) {
  const g = ctx.createLinearGradient(0, 0, width, height);
  g.addColorStop(0, theme.bgA);
  g.addColorStop(1, theme.bgB);
  ctx.globalAlpha = 1;
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);

  // Soft animated bloom blobs
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const t = nowMs / 1000;
  const cx = width * (0.45 + Math.sin(t * 0.12) * 0.08);
  const cy = height * (0.45 + Math.cos(t * 0.16) * 0.07);
  const r = Math.max(width, height) * 0.65;
  const rg = ctx.createRadialGradient(cx, cy, r * 0.12, cx, cy, r);
  rg.addColorStop(0, `rgba(24,140,255,${0.16 * intensity})`);
  rg.addColorStop(0.5, `rgba(18,255,230,${0.08 * intensity})`);
  rg.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function drawGlowWash(ctx: CanvasRenderingContext2D, width: number, height: number, nowMs: number, intensity: number) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = 0.12 * intensity;
  const t = nowMs / 1000;
  const gx = width * (0.5 + Math.sin(t * 0.25) * 0.08);
  const gy = height * (0.55 + Math.cos(t * 0.22) * 0.07);
  const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(width, height) * 0.75);
  g.addColorStop(0, "rgba(255,220,90,0.25)");
  g.addColorStop(0.55, "rgba(44,220,255,0.2)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function drawPacman(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  angle: number,
  nowMs: number,
  theme: { pacman: string; pacmanGlow: string },
  intensity: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const mouth = 0.18 + Math.abs(Math.sin(nowMs / 130)) * 0.42;
  const start = mouth;
  const end = Math.PI * 2 - mouth;

  ctx.globalCompositeOperation = "lighter";
  ctx.shadowColor = theme.pacmanGlow;
  ctx.shadowBlur = 18;
  ctx.globalAlpha = 0.95 * intensity;
  ctx.fillStyle = theme.pacman;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, radius, start, end);
  ctx.closePath();
  ctx.fill();

  // Tiny highlight
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.25 * intensity;
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.beginPath();
  ctx.arc(-radius * 0.25, -radius * 0.4, radius * 0.25, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function emitTrail(particles: Particle[], x: number, y: number, angle: number, cellSize: number, reduced: boolean) {
  const emitCount = reduced ? 1 : 2;
  for (let i = 0; i < emitCount; i++) {
    const sp = (reduced ? 18 : 30) + Math.random() * (reduced ? 10 : 24);
    const vx = Math.cos(angle + Math.PI) * sp + (Math.random() - 0.5) * 18;
    const vy = Math.sin(angle + Math.PI) * sp + (Math.random() - 0.5) * 18;
    const max = (reduced ? 0.35 : 0.55) + Math.random() * 0.35;
    particles.push({ x, y, vx, vy, life: 0, max });
  }
  const maxParticles = reduced ? 60 : 120;
  if (particles.length > maxParticles) particles.splice(0, particles.length - maxParticles);
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[], intensity: number) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]!;
    p.life += 1 / 60;
    const t = p.life / p.max;
    if (t >= 1) {
      particles.splice(i, 1);
      continue;
    }
    p.x += p.vx * (1 / 60);
    p.y += p.vy * (1 / 60);
    p.vx *= 0.96;
    p.vy *= 0.96;

    const a = (1 - t) * 0.35 * intensity;
    ctx.globalAlpha = a;
    ctx.fillStyle = "rgba(255,220,120,0.9)";
    ctx.shadowColor = "rgba(255,200,120,0.7)";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  ctx.restore();
}
