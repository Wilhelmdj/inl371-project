import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useKeyboard } from "@/hooks/useKeyboard";
import { configureCanvas } from "./GameCanvas";
import { applyPlayerPhysics, createPlayer, drawPlayer, resolvePlayerBounds, updatePlayerHit } from "./Player";
import { createPipes, drawPipes, updatePipes } from "./Pipes";
import { drawGameAtmosphere, drawGroundBand } from "./Background";
import { detectCoinCollision, detectPipeCollision } from "./Collision";
import { drawTokenCoin } from "./TokenSystem";
import { GAME_CONFIG, randomRange } from "./Physics";

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

type GameStatus = "idle" | "playing" | "gameover";

type GameState = {
  player: ReturnType<typeof createPlayer>;
  pipes: ReturnType<typeof createPipes>;
  particles: Particle[];
  time: number;
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

function createGameState(width: number, height: number): GameState {
  return {
    player: createPlayer(),
    pipes: createPipes(width, height, 6),
    particles: [],
    time: 0,
    shake: 0,
  };
}

export function FlappyGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef({ tapped: false });
  const [status, setStatus] = useState<GameStatus>("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [flashToken, setFlashToken] = useState(false);
  const statusRef = useRef<GameStatus>(status);
  const scoreRef = useRef(0);
  const highScoreRef = useRef(0);
  const stateRef = useRef<GameState | null>(null);
  const flashTimer = useRef<number | null>(null);
  const keys = useKeyboard(status === "playing");

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = configureCanvas(canvas, wrap);
    if (!ctx) return;

    const resetState = () => {
      const width = wrap.clientWidth;
      const height = wrap.clientHeight;
      stateRef.current = createGameState(width, height);
      scoreRef.current = 0;
      setScore(0);
    };

    resetState();

    let last = performance.now();
    let raf = 0;
    let visible = true;

    const resize = () => {
      configureCanvas(canvas, wrap);
      resetState();
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
      const state = stateRef.current;
      if (!state) return;
      state.particles.push(...createParticles(x, y, color));
      state.shake = 1.2;
    };

    const endGame = () => {
      const currentScore = scoreRef.current;
      if (currentScore > highScoreRef.current) {
        highScoreRef.current = currentScore;
        setHighScore(currentScore);
      }
      setStatus("gameover");
    };

    const loop = (time: number) => {
      const state = stateRef.current;
      if (!state) return;
      const dt = Math.min(0.032, (time - last) / 1000);
      last = time;
      if (!visible) {
        raf = requestAnimationFrame(loop);
        return;
      }

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      state.time += dt;

      const currentStatus = statusRef.current;
      const flapped = currentStatus === "playing" && (keys.current[" "] || keys.current.ArrowUp || keys.current.W || keys.current.w || getTap());

      if (currentStatus === "playing") {
        applyPlayerPhysics(state.player, dt, flapped);
        updatePlayerHit(state.player, dt);
        updatePipes(state.pipes, dt, width, height);

        state.pipes.forEach((pipe) => {
          if (!pipe.coin.taken && detectCoinCollision(state.player, pipe.coin)) {
            pipe.coin.taken = true;
            scoreRef.current += 1;
            setScore(scoreRef.current);
            setFlashToken(true);
            if (flashTimer.current) {
              window.clearTimeout(flashTimer.current);
            }
            flashTimer.current = window.setTimeout(() => setFlashToken(false), 220);
            triggerParticles(pipe.coin.x, pipe.coin.y, "#f8d84b");
          }

          if (detectPipeCollision(state.player, pipe)) {
            triggerParticles(state.player.x + state.player.width * 0.5, state.player.y + state.player.height * 0.5, "#fd5b6a");
            endGame();
          }
        });

        if (state.player.y >= height - GAME_CONFIG.floorHeight - state.player.height) {
          endGame();
        }
      } else {
        // gentle idle bob when not playing
        state.player.y = Math.max(20, Math.min(height - GAME_CONFIG.floorHeight - state.player.height - 12, 140 + Math.sin(state.time * 1.2) * 10));
      }

      if (state.particles.length) {
        state.particles = state.particles.filter((particle) => {
          particle.x += particle.vx * dt;
          particle.y += particle.vy * dt;
          particle.vy += GAME_CONFIG.particleGravity * dt;
          particle.life -= dt / GAME_CONFIG.particleLife;
          particle.alpha = Math.max(0, particle.life);
          return particle.life > 0;
        });
      }

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

  const handlePlay = () => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    setStatus("playing");
    setScore(0);
    scoreRef.current = 0;
    const state = stateRef.current;
    if (state) {
      state.player = createPlayer();
      state.pipes = createPipes(wrap.clientWidth, wrap.clientHeight, 6);
      state.particles = [];
      state.time = 0;
      state.shake = 0;
    }
  };

  const handleQuit = () => {
    setStatus("idle");
  };

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 z-10 pointer-events-auto overflow-hidden"
      onPointerDown={() => {
        if (statusRef.current === "playing") {
          inputRef.current.tapped = true;
        }
      }}
    >
      <canvas ref={canvasRef} className="w-full h-full pixelated" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/90 via-black/0 to-transparent" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_28%)]" />

      <div className="pointer-events-none absolute top-5 left-5 z-20 flex flex-col gap-2 rounded-2xl border border-[rgba(255,255,255,0.14)] bg-[rgba(20,20,40,0.9)] px-3 py-2 text-[10px] text-white shadow-[0_0_28px_rgba(0,0,0,0.35)]">
        <span className="font-pixel uppercase tracking-[0.25em] text-[var(--mario-red)]">Flappy MTRS</span>
        <div className="inline-flex items-center gap-2">
          <span className="font-pixel text-[16px] text-white">{score.toString().padStart(3, "0")}</span>
          <span className="text-[var(--coin)]">★</span>
        </div>
      </div>

      <div className="pointer-events-none absolute top-5 right-5 z-20 rounded-2xl border border-[rgba(255,255,255,0.14)] bg-[rgba(16,18,36,0.9)] px-3 py-2 text-[9px] text-white/80 font-pixel uppercase tracking-[0.2em]">
        best {highScore.toString().padStart(3, "0")}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center z-20">
        <div className="rounded-full border border-[rgba(255,255,255,0.14)] bg-[rgba(10,12,32,0.9)] px-4 py-2 text-[9px] text-white/80 font-pixel uppercase tracking-[0.2em]">
          {status === "playing" ? "SPACE / TAP to flap" : status === "gameover" ? "GAME OVER - RESTART OR QUIT" : "PRESS PLAY TO START"}
        </div>
      </div>

      <div className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center px-6 z-20">
        {status !== "playing" && (
          <div className="w-full max-w-xs rounded-3xl border-4 border-[var(--ink)] bg-[rgba(10,12,24,0.92)] p-5 text-center shadow-[0_0_40px_rgba(0,0,0,0.45)]">
            <p className="font-pixel text-[11px] uppercase text-[var(--mario-red)] tracking-[0.3em] mb-3">arcade standby</p>
            <h3 className="font-pixel text-2xl text-white mb-3">Play Flappy, okay.</h3>
            <p className="font-pixel text-[11px] text-white/80 leading-relaxed mb-5">
              Click play to launch. High score is saved while the session stays open.
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handlePlay}
                className="font-pixel rounded-xl border-2 border-[var(--ink)] bg-[var(--mario-red)] px-4 py-3 text-[11px] uppercase text-white shadow-[0_0_20px_rgba(253,91,106,0.35)] transition hover:bg-[#f95b6a]"
              >
                PLAY
              </button>
              {status === "gameover" && (
                <button
                  type="button"
                  onClick={handleQuit}
                  className="font-pixel rounded-xl border-2 border-white/15 bg-[rgba(255,255,255,0.05)] px-4 py-3 text-[11px] uppercase text-white hover:bg-white/10"
                >
                  QUIT
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
