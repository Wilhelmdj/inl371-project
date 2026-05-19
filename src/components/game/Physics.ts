export const GAME_CONFIG = {
  gravity: 1550,
  flapImpulse: -420,
  terminalVelocity: 900,
  maxRotation: 32,
  minRotation: -28,
  rotationSpeed: 8,
  baseSpeed: 146,
  pipeSpeed: 146,
  floorHeight: 90,
  pipeWidth: 50,
  pipeGapMin: 130,
  pipeGapMax: 175,
  pipeSpacing: 278,
  tokenSize: 14,
  particleGravity: 1200,
  particleLife: 0.62,
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

export function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function easeOutQuad(t: number) {
  return t * (2 - t);
}
