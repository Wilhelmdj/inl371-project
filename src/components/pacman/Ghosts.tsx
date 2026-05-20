export type GhostId = "blinky" | "pinky" | "inky";

export type Ghost = {
  id: GhostId;
  color: string;
  glow: string;
  speed: number; // relative to pac-man
  phase: number; // progress offset
};

export function createGhosts(): Ghost[] {
  return [
    { id: "blinky", color: "#ff355d", glow: "rgba(255,53,93,0.85)", speed: 1.02, phase: 0.12 },
    { id: "pinky", color: "#ff7ad9", glow: "rgba(255,122,217,0.8)", speed: 0.98, phase: 0.18 },
    { id: "inky", color: "#26e6ff", glow: "rgba(38,230,255,0.75)", speed: 1.0, phase: 0.26 },
  ];
}

export function drawGhost(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  ghost: Ghost,
  wiggle: number,
  intensity: number,
) {
  ctx.save();
  ctx.translate(x, y);

  // Body glow
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = 0.75 * intensity;
  ctx.shadowColor = ghost.glow;
  ctx.shadowBlur = 18;

  // Simple rounded ghost with scalloped bottom.
  const w = size;
  const h = size * 1.15;
  const r = w * 0.45;

  ctx.fillStyle = ghost.color;
  ctx.beginPath();
  ctx.moveTo(-w * 0.5, h * 0.25);
  ctx.quadraticCurveTo(-w * 0.5, -h * 0.1, 0, -h * 0.1);
  ctx.quadraticCurveTo(w * 0.5, -h * 0.1, w * 0.5, h * 0.25);
  ctx.lineTo(w * 0.5, h * 0.42);
  const bumps = 4;
  for (let i = 0; i <= bumps; i++) {
    const t = i / bumps;
    const bx = w * 0.5 - t * w;
    const by = h * 0.42 + Math.sin(t * Math.PI * 2 + wiggle) * (h * 0.04);
    ctx.quadraticCurveTo(bx + w / bumps / 2, by + h * 0.12, bx - w / bumps, h * 0.42);
  }
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1 * intensity;

  // Eyes
  const eyeY = -h * 0.02;
  const eyeX = w * 0.16;
  const eyeR = r * 0.26;
  ctx.fillStyle = "rgba(245,250,255,0.95)";
  ctx.beginPath();
  ctx.arc(-eyeX, eyeY, eyeR, 0, Math.PI * 2);
  ctx.arc(eyeX, eyeY, eyeR, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(30,170,255,0.95)";
  ctx.shadowColor = "rgba(80,220,255,0.8)";
  ctx.shadowBlur = 10;
  const pupilR = eyeR * 0.45;
  ctx.beginPath();
  ctx.arc(-eyeX + pupilR * 0.45, eyeY + pupilR * 0.2, pupilR, 0, Math.PI * 2);
  ctx.arc(eyeX + pupilR * 0.45, eyeY + pupilR * 0.2, pupilR, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();
}

