import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useKeyboard } from "@/hooks/useKeyboard";
import { configureCanvas } from "./GameCanvas";
import { applyPlayerPhysics, bouncePlayer, createPlayer, drawPlayer, resolvePlayerBounds, updatePlayerHit } from "./Player";
import { createPipes, drawPipes, updatePipes } from "./Pipes";
import { drawGameAtmosphere, drawGroundBand } from "./Background";
import { detectCoinCollision, detectPipeCollision } from "./Collision";
import { drawTokenCoin, drawTokenIcon, TokenCoin } from "./TokenSystem";
import { GAME_CONFIG, clamp, randomRange } from "./Physics";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  alpha: number;
  color: string;
};

type GameState = {
  player: ReturnType<typeof createPlayer>;
  pipes: ReturnType<typeof createPipes>;
  particles: Particle[];
  time: number;
  tokenCount: number;
  shake: number;
};

function createParticles(x: number, y: number, color: string, count = 8): Particle[] {
  return Array.from({ length: count }).map(() => ({
    x,
    y,
    vx: randomRange(-90, 90),
    vy: randomRange(-220, -80),
    life: 1,
    size: randomRange(2.8, 4.8),
    alpha: 1,
    color,
  }));
}

export function FlappyGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef({ tapped: false });
  const keys = useKeyboard(true);
  const [tokenCount, setTokenCount] = useState(0);
  const [flashToken, setFlashToken] = useState(false);
  const flashTimer = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = configureCanvas(canvas, wrap);
    if (!ctx) return;

    const state: GameState = {
      player: createPlayer(),
      pipes: createPipes(wrap.clientWidth, wrap.clientHeight, 6),
      particles: [],
      time: 0,
      tokenCount: 0,
      shake: 0,
    };

    let last = performance.now();
    let raf = 0;
    let visible = true;

    const resize = () => {
      configureCanvas(canvas, wrap);
    };

    const observer = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
    });

    observer.observe(wrap);
    window.addEventListener("resize", resize);

    const getTap = () => {
      if (inputRef.current.tapped) {
        inputRef.current.tapped = false;
        return true;
      }
      return false;
    };

    const triggerParticles = (x: number, y: number, color: string) => {
      state.particles.push(...createParticles(x, y, color));
      state.shake = 1.2;
    };

    const loop = (time: number) => {
      const dt = Math.min(0.032, (time - last) / 1000);
      last = time;
      if (!visible) {
        raf = requestAnimationFrame(loop);
        return;
      }

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      state.time += dt;

      const space = keys.current[" "] || keys.current.ArrowUp || keys.current.W || keys.current.w;
      const flap = space || getTap();
      applyPlayerPhysics(state.player, dt, flap);
      updatePlayerHit(state.player, dt);
      resolvePlayerBounds(state.player, height);

      updatePipes(state.pipes, dt, width, height);

      state.pipes.forEach((pipe) => {
        if (!pipe.coin.taken && detectCoinCollision(state.player, pipe.coin)) {
          pipe.coin.taken = true;
          state.tokenCount += 1;
          setTokenCount((value) => value + 1);
          setFlashToken(true);
          if (flashTimer.current) {
            window.clearTimeout(flashTimer.current);
          }
          flashTimer.current = window.setTimeout(() => setFlashToken(false), 220);
          triggerParticles(pipe.coin.x, pipe.coin.y, "#f8d84b");
        }

        if (detectPipeCollision(state.player, pipe)) {
          bouncePlayer(state.player);
          triggerParticles(state.player.x + state.player.width * 0.5, state.player.y + state.player.height * 0.5, "#6dfa8a");
        }
      });

      state.particles = state.particles.filter((particle) => {
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        particle.vy += GAME_CONFIG.particleGravity * dt;
        particle.life -= dt / GAME_CONFIG.particleLife;
        particle.alpha = Math.max(0, particle.life);
        return particle.life > 0;
      });

      ctx.clearRect(0, 0, width, height);
      drawGameAtmosphere(ctx, width, height, state.time);
      drawPipes(ctx, state.pipes, height);

      state.pipes.forEach((pipe) => {
        if (!pipe.coin.taken && pipe.coin.x > -40 && pipe.coin.x < width + 40) {
          drawTokenCoin(ctx, pipe.coin);
        }
      });

      drawGroundBand(ctx, width, height);
      drawPlayer(ctx, state.player, state.shake);

      state.particles.forEach((particle) => {
        ctx.save();
        ctx.globalAlpha = particle.alpha * 0.82;
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
        ctx.restore();
      });

      if (state.shake > 0) {
        state.shake = Math.max(0, state.shake - dt * 3.6);
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      if (flashTimer.current) {
        window.clearTimeout(flashTimer.current);
      }
    };
  }, [keys]);

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 z-10 pointer-events-auto overflow-hidden"
      onPointerDown={() => {
        inputRef.current.tapped = true;
      }}
    >
      <canvas ref={canvasRef} className="w-full h-full pixelated" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/0 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_28%)]" />

      <div className="pointer-events-none absolute top-5 left-5 z-20 flex flex-col gap-2 rounded-2xl border-2 border-[var(--ink)] bg-[rgba(6,15,38,0.78)] px-3 py-2 text-[10px] text-white shadow-[0_0_28px_rgba(0,0,0,0.35)]">
        <span className="font-pixel uppercase tracking-[0.25em] text-[var(--coin)]">MTRS TOKEN BANK</span>
        <motion.div
          animate={{ scale: flashToken ? 1.08 : 1 }}
          transition={{ type: "spring", stiffness: 340, damping: 14 }}
          className="inline-flex items-center gap-2"
        >
          <span className="font-pixel text-[18px] text-[var(--coin)]">★</span>
          <span className="font-pixel text-[16px] text-white">{tokenCount.toString().padStart(3, "0")}</span>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute top-5 right-5 z-20 rounded-2xl border-2 border-[var(--ink)] bg-[rgba(14,26,52,0.76)] px-3 py-2 text-[9px] text-white/80 font-pixel uppercase tracking-[0.2em]">
        press <span className="text-[var(--coin)]">SPACE</span> or <span className="text-[var(--coin)]">↑</span>
      </div>
    </div>
  );
}
