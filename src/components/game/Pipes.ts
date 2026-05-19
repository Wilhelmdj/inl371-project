import { randomRange, GAME_CONFIG } from "./Physics";
import type { TokenCoin } from "./TokenSystem";

export type Pipe = {
  x: number;
  width: number;
  gapY: number;
  gapSize: number;
  coin: TokenCoin;
};

export function createPipes(width: number, height: number, count = 5) {
  const pipes: Pipe[] = [];
  const startX = 350;
  for (let i = 0; i < count; i += 1) {
    const x = startX + i * GAME_CONFIG.pipeSpacing;
    const gapSize = randomRange(GAME_CONFIG.pipeGapMin, GAME_CONFIG.pipeGapMax);
    const gapY = randomRange(82, height - GAME_CONFIG.floorHeight - gapSize - 44);
    const coin = createPipeCoin(x, gapY, gapSize);
    pipes.push({ x, width: GAME_CONFIG.pipeWidth, gapY, gapSize, coin });
  }
  return pipes;
}

export function updatePipes(pipes: Pipe[], dt: number, width: number, height: number) {
  const speed = GAME_CONFIG.pipeSpeed;
  let maxX = pipes.reduce((max, pipe) => Math.max(max, pipe.x), 0);

  pipes.forEach((pipe) => {
    pipe.x -= speed * dt;
    pipe.coin.x -= speed * dt;
    if (pipe.x + pipe.width < -80) {
      pipe.x = maxX + GAME_CONFIG.pipeSpacing + randomRange(0, 24);
      maxX = pipe.x;
      pipe.gapSize = randomRange(GAME_CONFIG.pipeGapMin, GAME_CONFIG.pipeGapMax);
      pipe.gapY = randomRange(82, height - GAME_CONFIG.floorHeight - pipe.gapSize - 44);
      pipe.coin = createPipeCoin(pipe.x, pipe.gapY, pipe.gapSize);
    }
  });
}

export function drawPipes(ctx: CanvasRenderingContext2D, pipes: Pipe[], height: number) {
  pipes.forEach((pipe) => {
    const x = Math.round(pipe.x);
    const topHeight = Math.round(pipe.gapY);
    const bottomY = Math.round(pipe.gapY + pipe.gapSize);
    const bottomHeight = Math.round(height - GAME_CONFIG.floorHeight - bottomY);

    ctx.fillStyle = "#0d171c";
    ctx.fillRect(x - 6, 0, pipe.width + 12, topHeight + 8);
    ctx.fillRect(x - 6, bottomY - 8, pipe.width + 12, bottomHeight + 12);

    ctx.fillStyle = "#3db454";
    ctx.fillRect(x, 0, pipe.width, topHeight);
    ctx.fillRect(x, bottomY, pipe.width, bottomHeight);

    ctx.fillStyle = "#7be383";
    ctx.fillRect(x + 4, 4, 8, Math.max(8, topHeight - 8));
    ctx.fillRect(x + 4, bottomY + 4, 8, Math.max(8, bottomHeight - 8));

    ctx.fillStyle = "#2c8a43";
    ctx.fillRect(x, topHeight - 12, pipe.width, 12);
    ctx.fillRect(x, bottomY - 12, pipe.width, 12);

    ctx.fillStyle = "#72ce76";
    ctx.fillRect(x + 6, topHeight - 12, pipe.width - 12, 4);
    ctx.fillRect(x + 6, bottomY - 12, pipe.width - 12, 4);
  });
}

function createPipeCoin(pipeX: number, gapY: number, gapSize: number): TokenCoin {
  const centerY = gapY + gapSize * 0.5;
  const bob = Math.sin((pipeX / 10) % (Math.PI * 2)) * 6;
  return {
    x: pipeX + GAME_CONFIG.pipeWidth * 0.5,
    y: centerY + bob - 4,
    size: GAME_CONFIG.tokenSize,
    taken: false,
    floatPhase: Math.random() * Math.PI * 2,
    wobble: Math.random() * 0.8,
  };
}
