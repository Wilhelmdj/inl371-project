import { GAME_CONFIG } from "./Physics";

export function drawGameAtmosphere(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "rgba(102, 181, 255, 0.18)");
  gradient.addColorStop(0.45, "rgba(137, 208, 255, 0.08)");
  gradient.addColorStop(1, "rgba(5, 18, 44, 0.08)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 10; i += 1) {
    const x = ((i * 73 + time * 5) % width) - 40;
    const y = (height * 0.18) + (i % 5) * 42;
    ctx.fillRect(x, y, 16, 6);
    ctx.fillRect(x + 4, y - 8, 12, 4);
  }
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.08;
  for (let j = 0; j < 12; j += 1) {
    const radius = 5 + (j % 3) * 3;
    const x = ((j * 97 + time * 15) % (width + 160)) - 80;
    const y = 40 + (j * 26) % (height * 0.4);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = "soft-light";
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.16;
  for (let y = 0; y < height; y += 5) {
    ctx.fillRect(0, y, width, 1);
  }
  ctx.restore();
}

export function drawGroundBand(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const y = height - GAME_CONFIG.floorHeight;
  ctx.fillStyle = "#0d1218";
  ctx.fillRect(0, y, width, GAME_CONFIG.floorHeight);
  ctx.fillStyle = "#5dbb45";
  ctx.fillRect(0, y + 8, width, 8);
  for (let tileX = 0; tileX < width; tileX += 32) {
    ctx.fillStyle = "#a4541f";
    ctx.fillRect(tileX, y + 16, 28, GAME_CONFIG.floorHeight - 16);
    ctx.fillStyle = "#6b330d";
    ctx.fillRect(tileX + 14, y + 16, 2, GAME_CONFIG.floorHeight - 16);
  }
}
