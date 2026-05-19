import { randomRange, GAME_CONFIG } from "./Physics";

export type TokenCoin = {
  x: number;
  y: number;
  size: number;
  taken: boolean;
  floatPhase: number;
  wobble: number;
};

export function createTokenCoin(x: number, y: number): TokenCoin {
  return {
    x,
    y,
    size: GAME_CONFIG.tokenSize,
    taken: false,
    floatPhase: Math.random() * Math.PI * 2,
    wobble: Math.random() * 0.8,
  };
}

export function updateTokenCoin(coin: TokenCoin, dt: number, dx: number) {
  coin.x -= dx * dt;
  coin.floatPhase += dt * 2.2;
  coin.y += Math.sin(coin.floatPhase) * 0.18;
}

export function drawTokenCoin(ctx: CanvasRenderingContext2D, coin: TokenCoin, alpha = 1) {
  const px = Math.round(coin.x);
  const py = Math.round(coin.y + Math.sin(coin.floatPhase) * 3);
  const r = coin.size * 0.4;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.shadowColor = "rgba(245, 201, 59, 0.55)";
  ctx.shadowBlur = 8;
  ctx.fillStyle = "#f5c93b";
  ctx.beginPath();
  ctx.ellipse(px, py, r + 2, r + 3, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.fillStyle = "#fff3a8";
  ctx.fillRect(px - 3, py - 1, 6, 3);
  ctx.fillRect(px - 1, py - 4, 2, 8);
  ctx.restore();
}

export function drawTokenIcon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  ctx.fillStyle = "#f5c93b";
  ctx.beginPath();
  ctx.ellipse(x, y, size * 0.45, size * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff8c4";
  ctx.fillRect(x - size * 0.14, y - 1, size * 0.28, 2);
  ctx.fillRect(x - 1, y - size * 0.14, 2, size * 0.28);
  ctx.restore();
}

export function positionCoinAbovePipe(pipeX: number, gapY: number, gapSize: number) {
  return createTokenCoin(pipeX + 24, gapY + gapSize * 0.5 + randomRange(-22, 22));
}
