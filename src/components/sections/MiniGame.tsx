import { useEffect, useRef, useState } from "react";
import { useKeyboard } from "@/hooks/useKeyboard";

type Coin = { x: number; y: number; taken: boolean };
type Obstacle = { x: number; w: number; h: number };

export function MiniGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [score, setScore] = useState(0);
  const keys = useKeyboard(active);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };
    resize();
    window.addEventListener("resize", resize);

    // Player state
    const player = { x: 80, y: 0, vy: 0, w: 22, h: 28, onGround: false };
    let cameraX = 0;
    const gravity = 1500;
    const jumpV = -560;
    const speed = 220;

    // World
    const groundFromBottom = 90;
    const worldCoins: Coin[] = [];
    const worldObs: Obstacle[] = [];
    for (let i = 0; i < 30; i++) {
      worldCoins.push({ x: 300 + i * 180 + (i % 3) * 40, y: 60 + (i % 4) * 30, taken: false });
      if (i % 4 === 0) worldObs.push({ x: 400 + i * 200, w: 24, h: 40 });
    }

    let last = performance.now();
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => (visible = e.isIntersecting));
    });
    io.observe(wrap);

    let localScore = 0;

    const loop = (t: number) => {
      const dt = Math.min(0.033, (t - last) / 1000);
      last = t;

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      if (!visible) { raf = requestAnimationFrame(loop); return; }

      // Input
      let move = 0;
      const k = keys.current;
      if (k["ArrowLeft"] || k["a"]) move -= 1;
      if (k["ArrowRight"] || k["d"]) move += 1;
      const wantJump = k[" "] || k["ArrowUp"] || k["w"];

      // Auto-scroll when idle so it's lively
      const autoScroll = active ? 0 : 60;

      player.x += move * speed * dt + autoScroll * dt;
      cameraX += autoScroll * dt;
      if (move > 0) cameraX += (player.x - (cameraX + w * 0.35)) * Math.min(1, dt * 4);
      if (move < 0) cameraX = Math.max(cameraX, player.x - w * 0.6);

      // Gravity / jump
      player.vy += gravity * dt;
      player.y += player.vy * dt;
      const groundY = h - groundFromBottom - player.h;
      if (player.y >= groundY) {
        player.y = groundY;
        player.vy = 0;
        player.onGround = true;
      } else {
        player.onGround = false;
      }
      if (wantJump && player.onGround && active) {
        player.vy = jumpV;
        player.onGround = false;
      }

      // Coins
      worldCoins.forEach((c) => {
        if (c.taken) return;
        const sx = c.x - cameraX;
        const sy = h - groundFromBottom - c.y - 16;
        if (
          player.x + player.w > c.x &&
          player.x < c.x + 16 &&
          player.y + player.h > h - groundFromBottom - c.y - 16 &&
          player.y < h - groundFromBottom - c.y
        ) {
          c.taken = true;
          localScore++;
          setScore(localScore);
        }
        // draw
        if (sx > -20 && sx < w + 20) {
          ctx.fillStyle = "#000";
          ctx.fillRect(sx, sy, 16, 16);
          ctx.fillStyle = "#f5c93b";
          ctx.fillRect(sx + 2, sy + 2, 12, 12);
          ctx.fillStyle = "#fff3a8";
          ctx.fillRect(sx + 4, sy + 4, 3, 8);
        }
      });

      // Background gradient sky
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.clearRect(0, 0, w, h);

      // Ground band
      ctx.fillStyle = "#0a0a14";
      ctx.fillRect(0, h - groundFromBottom, w, 2);
      ctx.fillStyle = "#5dbb45";
      ctx.fillRect(0, h - groundFromBottom + 2, w, 6);
      // pattern bricks
      const bx = -(cameraX % 32);
      for (let x = bx; x < w; x += 32) {
        ctx.fillStyle = "#a4541f";
        ctx.fillRect(x, h - groundFromBottom + 8, 30, groundFromBottom - 8);
        ctx.fillStyle = "#6b330d";
        ctx.fillRect(x + 14, h - groundFromBottom + 8, 2, groundFromBottom - 8);
      }

      // Obstacles (pipes)
      worldObs.forEach((o) => {
        const sx = o.x - cameraX;
        if (sx < -60 || sx > w + 60) return;
        const sy = h - groundFromBottom - o.h;
        ctx.fillStyle = "#0a0a14";
        ctx.fillRect(sx - 2, sy - 2, o.w + 4, o.h + 4);
        ctx.fillStyle = "#3aa84a";
        ctx.fillRect(sx, sy, o.w, o.h);
        ctx.fillStyle = "#7ddb6a";
        ctx.fillRect(sx + 2, sy + 2, 4, o.h - 4);
      });

      // Player (pixel character)
      const px = Math.round(player.x - cameraX);
      const py = Math.round(player.y);
      // shadow
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(px, h - groundFromBottom - 2, player.w, 4);
      // body
      ctx.fillStyle = "#0a0a14";
      ctx.fillRect(px - 1, py - 1, player.w + 2, player.h + 2);
      ctx.fillStyle = "#e23b3b"; // hat
      ctx.fillRect(px, py, player.w, 8);
      ctx.fillStyle = "#f4c290"; // face
      ctx.fillRect(px + 2, py + 8, player.w - 4, 8);
      ctx.fillStyle = "#0a0a14"; // eye
      ctx.fillRect(px + player.w - 8, py + 11, 2, 3);
      ctx.fillStyle = "#1f6cd6"; // overalls
      ctx.fillRect(px, py + 16, player.w, 12);
      ctx.fillStyle = "#f5c93b"; // button
      ctx.fillRect(px + 4, py + 19, 2, 2);
      ctx.fillRect(px + player.w - 6, py + 19, 2, 2);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [active, keys]);

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 z-10 pointer-events-auto"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onTouchStart={() => setActive(true)}
    >
      <canvas ref={canvasRef} className="w-full h-full pixelated" />
      <div className="pointer-events-none absolute top-24 left-4 md:left-8 font-pixel text-[10px] text-[var(--ink)] bg-[var(--coin)] px-3 py-2 border-2 border-[var(--ink)] rounded">
        ★ MTRS COINS: {score.toString().padStart(3, "0")}
      </div>
      <div className="pointer-events-none absolute top-24 right-4 md:right-8 font-pixel text-[8px] text-white glass-strong px-3 py-2 border-2 border-[var(--ink)] rounded">
        {active ? "← → MOVE · SPACE JUMP" : "HOVER TO PLAY"}
      </div>
    </div>
  );
}
