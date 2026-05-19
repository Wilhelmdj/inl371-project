import { clamp, GAME_CONFIG, lerp } from "./Physics";

export type PlayerState = {
  x: number;
  y: number;
  vy: number;
  width: number;
  height: number;
  rotation: number;
  hitTimer: number;
  flapCooldown: number;
};

export function createPlayer(): PlayerState {
  return {
    x: 120,
    y: 140,
    vy: 0,
    width: 28,
    height: 26,
    rotation: 0,
    hitTimer: 0,
    flapCooldown: 0,
  };
}

export function drawPlayer(ctx: CanvasRenderingContext2D, player: PlayerState, shake: number) {
  const centerX = Math.round(player.x + player.width * 0.5);
  const centerY = Math.round(player.y + player.height * 0.5);
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate((player.rotation * Math.PI) / 180);
  ctx.translate(-centerX, -centerY);

  const px = Math.round(player.x);
  const py = Math.round(player.y);
  const bodyW = player.width;
  const bodyH = player.height;

  ctx.shadowColor = "rgba(0,0,0,0.18)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 2;

  ctx.fillStyle = "#0a0a14";
  ctx.fillRect(px - 1, py - 1, bodyW + 2, bodyH + 2);

  // Hat
  ctx.fillStyle = "#d93f49";
  ctx.fillRect(px + 2, py, bodyW - 4, 8);
  ctx.fillStyle = "#fb6b6b";
  ctx.fillRect(px + 3, py + 2, bodyW - 6, 4);

  // Face
  ctx.fillStyle = "#f4c290";
  ctx.fillRect(px + 3, py + 8, bodyW - 6, 8);
  ctx.fillStyle = "#0a0a14";
  ctx.fillRect(px + bodyW - 10, py + 11, 2, 3);

  // Body / overalls
  ctx.fillStyle = "#1f6cd6";
  ctx.fillRect(px + 2, py + 16, bodyW - 4, 10);
  ctx.fillStyle = "#2b82e1";
  ctx.fillRect(px + 2, py + 18, bodyW - 4, 4);
  ctx.fillStyle = "#f5c93b";
  ctx.fillRect(px + 4, py + 18, 3, 3);
  ctx.fillRect(px + bodyW - 7, py + 18, 3, 3);

  // Floating token held by character
  ctx.fillStyle = "#f5c93b";
  ctx.fillRect(px + bodyW - 10, py + 6, 8, 8);
  ctx.fillStyle = "#fff8c4";
  ctx.fillRect(px + bodyW - 7, py + 9, 4, 2);

  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.18 + Math.abs(Math.sin(shake * 2)) * 0.18;
  ctx.fillStyle = "#f5c93b";
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + bodyH * 0.5, bodyW * 0.9, bodyH * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.shadowBlur = 0;
}

export function applyPlayerPhysics(player: PlayerState, dt: number, flap: boolean) {
  if (player.flapCooldown > 0) {
    player.flapCooldown = Math.max(0, player.flapCooldown - dt);
  }

  if (flap && player.flapCooldown === 0) {
    player.vy = GAME_CONFIG.flapImpulse;
    player.flapCooldown = 0.12;
  }

  player.vy = clamp(player.vy + GAME_CONFIG.gravity * dt, -GAME_CONFIG.terminalVelocity, GAME_CONFIG.terminalVelocity);
  player.y += player.vy * dt;

  const targetRotation = clamp((player.vy / 700) * GAME_CONFIG.maxRotation, GAME_CONFIG.minRotation, GAME_CONFIG.maxRotation);
  player.rotation = lerp(player.rotation, targetRotation, Math.min(1, dt * GAME_CONFIG.rotationSpeed));
}

export function resolvePlayerBounds(player: PlayerState, height: number) {
  const floorY = height - GAME_CONFIG.floorHeight - player.height;
  if (player.y > floorY) {
    player.y = floorY;
    player.vy = 0;
    player.rotation = 0;
  }
  if (player.y < 12) {
    player.y = 12;
    player.vy = 0;
  }
}

export function bouncePlayer(player: PlayerState) {
  player.vy = -260;
  player.rotation = -18;
  player.hitTimer = 0.22;
}

export function updatePlayerHit(player: PlayerState, dt: number) {
  if (player.hitTimer > 0) {
    player.hitTimer = Math.max(0, player.hitTimer - dt);
  }
}
