export type FrameInfo = {
  nowMs: number;
  dtMs: number;
};

export class AnimationLoop {
  private rafId: number | null = null;
  private lastMs: number | null = null;
  private readonly onFrame: (info: FrameInfo) => void;

  constructor(onFrame: (info: FrameInfo) => void) {
    this.onFrame = onFrame;
  }

  start() {
    if (this.rafId != null) return;
    this.lastMs = null;

    const tick = (nowMs: number) => {
      if (this.rafId == null) return;
      const dtMs = this.lastMs == null ? 16.67 : Math.min(48, Math.max(0, nowMs - this.lastMs));
      this.lastMs = nowMs;
      this.onFrame({ nowMs, dtMs });
      this.rafId = window.requestAnimationFrame(tick);
    };

    this.rafId = window.requestAnimationFrame(tick);
  }

  stop() {
    if (this.rafId == null) return;
    window.cancelAnimationFrame(this.rafId);
    this.rafId = null;
    this.lastMs = null;
  }
}

