# MTRS Landing Page — Build Plan

A single-page, retro-Nintendo-meets-enterprise landing page for the Mentor Token Reward System (Belgium Campus). Frontend only — no backend, no real auth, no DB.

## Design Direction

- **Aesthetic**: 8-bit pixel-art world (Mario-style sky, hills, pipes, coins, blocks) layered with modern glassmorphism + Microsoft-grade polish.
- **Palette** (tokens in `src/styles.css`, oklch):
  - `--sky` bright Mario blue, `--sky-deep` for parallax depth
  - `--coin` warm gold + `--coin-glow`
  - `--pipe` Mario green + `--grass`
  - `--brick` warm terracotta
  - `--star` electric yellow
  - `--ink` near-black for pixel outlines
  - `--surface` glass white / dark glass for cards
  - Microsoft-flavored accents (`--ms-blue`) on enterprise/tech callouts
- **Typography**: "Press Start 2P" for display/headings + arcade labels; "Inter" for long-form copy (keeps readability for the enterprise side).
- **Texture**: CRT scanline overlay (very subtle), pixel-perfect rendering on sprite SVGs, soft glows + drop shadows on coins/stars.
- **Motion**: Framer Motion everywhere — parallax scroll, floating coins, hover bounces, animated counters, level-map path drawing on scroll.

## File Structure

```text
src/
  routes/
    index.tsx                 # composes all sections
    __root.tsx                # head/meta (MTRS title, description, og)
  components/
    layout/
      Navbar.tsx              # glass navbar, scroll-blur
      Footer.tsx              # arcade footer
    sections/
      Hero.tsx                # hero copy + CTAs + floating stat cards
      MiniGame.tsx            # playable canvas mini-game (hero bg layer)
      ParallaxWorld.tsx       # sky/clouds/mountains/hills parallax
      WhatIsMTRS.tsx
      Features.tsx
      HowItWorks.tsx          # level-map progression
      Gamification.tsx        # XP bars, badges, counters
      Benefits.tsx            # students vs mentors split
      DemoSection.tsx         # fake Power Apps + dashboard mockups
      QRSection.tsx
    pixel/
      Coin.tsx, Cloud.tsx, Pipe.tsx, Block.tsx, Star.tsx,
      Mountain.tsx, Bush.tsx, Mushroom.tsx, ScanlineOverlay.tsx
    ui/
      ArcadeButton.tsx        # glowing, bouncy CTA wrapper
      GlowCard.tsx            # animated-border feature card
      StatCard.tsx            # floating glass stat card
      LevelNode.tsx           # checkpoint marker for HowItWorks
      XPBar.tsx, Badge.tsx, AnimatedCounter.tsx
  hooks/
    useParallax.ts            # scroll-linked transforms
    useKeyboard.ts            # arrow/space input for mini-game
    useInView.ts              # trigger entry animations
    usePrefersReducedMotion.ts
  utils/
    physics.ts                # mini-game gravity/jump/collision
    rng.ts                    # deterministic floats for particle layouts
  styles.css                  # design tokens + pixel utilities + scanlines
  assets/                     # generated pixel SVGs/PNGs (coin, pipe, etc.)
```

All sections imported into `src/routes/index.tsx` (replaces placeholder). Existing `__root.tsx` updated only for SEO meta.

## Section Breakdown

1. **Navbar** — Floating glass bar, MTRS pixel logo, links: Home, Features, How It Works, Rewards, Leaderboard, Demo, QR. Hash anchors scroll to sections (single-page brief). Blurs + tints on scroll via `useScroll`.
2. **Hero** — Full-viewport. Back layer: `ParallaxWorld` (sky → mountains → hills → ground). Mid layer: `MiniGame` canvas (side-scroller, arrow keys + space to jump, collect MTRS coins, scroll-safe: only captures keys when focused / when pointer over canvas). Front layer: heading "Level Up Student Success", subheading, body copy, three `ArcadeButton`s (Press Start, Launch MTRS App, Learn How It Works), four floating `StatCard`s (Tokens +24, Sessions 8, Power BI Active, M365 Secure).
3. **What is MTRS** — Two-column: copy + animated tech-stack tiles (Power Apps, Power Automate, Power BI, M365 A3) with pixel icons and glowing borders.
4. **Features** — 6 `GlowCard`s in responsive grid: Smart matching, Token earn/spend, Subject-specific mentoring, Scheduling & tracking, Power BI analytics, M365 secure login. Hover: lift + glow + pixel-icon bounce.
5. **How It Works** — Horizontal/zigzag level map with 5 `LevelNode` checkpoints (Levels 1–5 with provided copy). SVG path animates draw-in on scroll; Mario-style flag at the end.
6. **Gamification** — RPG dashboard mock: animated XP bar, mentor leaderboard rows, achievement badge grid, token balance with `AnimatedCounter`, streak flame, floating collected-coin particles.
7. **Benefits** — Two-column split (Students | Mentors) with pixel-art cards and provided bullet copy.
8. **Demo Section** — Fake Power Apps device frame (left), analytics dashboard mockup with bar/line charts (right), M365 login mock card, token transaction list, floating chips: Fast / Secure / Trackable / Automated. CTAs: Launch App, Use QR Code.
9. **QR Section** — Centered glowing arcade frame around a static QR SVG, animated scan-line sweep, particle field. Copy: "Scan to access MTRS" + subtext.
10. **Footer** — Pixel MTRS logo, link columns, tech-stack chips, Belgium Campus credit + group-member placeholder slots, tagline "Game Over? Never. Keep Leveling Up."

## Mini-Game (Hero)

- Canvas 2D, ~60fps, capped DPR, pauses when offscreen (`IntersectionObserver`).
- Controls: ← → move, Space/↑ jump. Listener attached only when canvas focused or hovered → never blocks page scroll.
- World: auto-scrolling ground, coins to collect, simple block obstacles. Score = "MTRS coins" displayed in retro HUD.
- Mobile: replaced with auto-playing demo loop (no input), or simple tap-to-jump button.
- Respects `prefers-reduced-motion` (renders a static pixel scene instead).

## Performance & Responsiveness

- Lazy-load below-the-fold sections via `React.lazy` + Suspense.
- All decorative pixel art as inline SVG components (no large PNGs); generated raster assets only where SVG is impractical.
- Parallax uses transform-only animations.
- Mobile: parallax depth reduced, mini-game swapped for demo loop, level map stacks vertically, navbar collapses to sheet.
- Reduced-motion: disables parallax/floating/scanlines.

## SEO

- `__root.tsx` head: title "MTRS — Mentor Token Reward System | Belgium Campus" (<60 chars), description (<160), og:title/description, twitter card. Single H1 in Hero. Semantic `<section>` + `aria-label` per section. Alt text on every pixel sprite that carries meaning (decorative ones get `aria-hidden`).

## Out of Scope (per request)

No backend, no DB, no real auth, no API calls. All data shown (tokens, leaderboard, sessions) is static mock content in component files.

## Technical Notes

- Stack already matches: React 19 + Vite + Tailwind v4 + TanStack Start. Add: `framer-motion` via `bun add framer-motion`.
- Font: load "Press Start 2P" + "Inter" from Google Fonts via `<link>` in `__root.tsx` head.
- All colors via semantic tokens in `src/styles.css` (oklch) — no hardcoded hex in components.
- Single-page experience: nav links use hash anchors (`#features`, etc.) per brief; this is the documented exception where hashes are acceptable (the brief explicitly scopes this as one landing page).
