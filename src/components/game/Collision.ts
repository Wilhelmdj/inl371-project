import type { PlayerState } from "./Player";
import type { Pipe } from "./Pipes";
import type { TokenCoin } from "./TokenSystem";

export type Rect = { x: number; y: number; width: number; height: number };

export function rectsCollide(a: Rect, b: Rect) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

export function detectPipeCollision(player: PlayerState, pipe: Pipe) {
  const playerBox: Rect = { x: player.x + 2, y: player.y + 2, width: player.width - 4, height: player.height - 4 };
  const pipeTop: Rect = { x: pipe.x, y: 0, width: pipe.width, height: pipe.gapY };
  const pipeBottom: Rect = {
    x: pipe.x,
    y: pipe.gapY + pipe.gapSize,
    width: pipe.width,
    height: 9999,
  };
  return rectsCollide(playerBox, pipeTop) || rectsCollide(playerBox, pipeBottom);
}

export function detectCoinCollision(player: PlayerState, coin: TokenCoin) {
  if (coin.taken) return false;
  const pw = player.width - 4;
  const ph = player.height - 4;
  const playerBox: Rect = { x: player.x + 2, y: player.y + 2, width: pw, height: ph };
  const coinBox: Rect = { x: coin.x - coin.size * 0.4, y: coin.y - coin.size * 0.4, width: coin.size * 0.8, height: coin.size * 0.8 };
  return rectsCollide(playerBox, coinBox);
}
