# 🌆 CYBERPUNK ARCADE — Context & Background

## Vision Statement

**CYBERPUNK ARCADE** is a curated collection of browser-based arcade games set in a unified cyberpunk universe. Each game is a standalone HTML file — self-contained, zero-dependency, instantly playable. The arcade as a whole evokes the atmosphere of a neon-drenched arcade in a dystopian megacity circa 2087: rain-slicked streets, flickering holographic signs, the hum of CRT monitors, and the thrill of beating the high score.

When you hear **"let's make a new game"**, you're being asked to design and build another entry in this collection — a single-file HTML5 canvas game that fits the cyberpunk aesthetic, runs in any modern browser, and captures the feel of classic arcade cabinets reimagined through a cyberpunk lens.

---

## The World

### Setting
- **Year:** 2087 (consistently referenced across games)
- **Place:** A sprawling megacity dominated by megacorporations, where street hackers, racers, fighters, and data-runners survive in the cracks
- **Atmosphere:** Perpetual night lit by neon and holograms. Acid rain. Drones overhead. The constant hum of augmented reality overlays on a crumbling analog foundation.

### Tone
- **Visually:** High-contrast neon on deep black. Inspired by 1980s monochrome CRT monitors: **amber** (`#ffb000`, `#ffbf00`) and **phosphor green** (`#39ff14`, `#00ff41`). Modern entries may layer in cyan, magenta, and hot pink, but the foundational aesthetic is rooted in the warm glow of amber phosphors (P3 phosphor / DEC VT100 / HP 5665A) and the electric buzz of green terminals (P1 phosphor / CGA / TRS-80). Everything GLOWS.
- **Narratively:** Gritty but playful. These are arcade games — the stakes are in-universe but the tone embraces arcade culture's inherent fun. Think *Synthwave Arcade* meets *Neon Genesis*.
- **Audience:** Fans of retro arcade, synthwave/retrowave aesthetics, cyberpunk fiction, and fast-paced casual games.

---

## Technical Framework

### Architecture
Every game in the arcade follows a **single-file HTML** pattern:

```
game-name.html  ← single file, ~500–2000 lines
  ├─ HTML structure (canvas + UI overlay)
  ├─ CSS (neon styling, scanlines, CRT effects)
  └─ JavaScript (game loop, rendering, input, state)
```

### Technology Stack
| Layer | Choice |
|-------|--------|
| **Rendering** | HTML5 Canvas 2D |
| **Language** | Vanilla JavaScript (ES6+) |
| **Styling** | Inline `<style>` — neon CSS with glow, scanline, vignette |
| **Input** | Keyboard (keydown/keyup events) + touch/click for overlay buttons |
| **Audio** | (Available but not yet implemented — Web Audio API ready) |
| **Dependencies** | **None** — zero external libraries |

### Visual Identity System

#### Color Palette

##### Primary CRT Phosphor Colors (Foundational)
```
Amber          — #ffb000   (primary game UI, main text, hero elements)
Deep Amber     — #ff8c00   (borders, secondary UI, warning states)
Bright Amber   — #ffbf00   (highlights, title text, glowing effects)
Phosphor Green — #39ff14   (scores, health, go signals — classic P1 green)
Classic Green  — #00ff41   (alternate green — Epson/CGA terminal green)
```

##### Modern Cyberpunk Accents (Extended Palette)
```
Cyan           — #00ffff   (modern entries, hero color, data streams)
Magenta        — #ff00ff   (modern entries, enemies, danger)
Hot Pink       — #ff1493   (modern entries, highlights, bonuses)
Electric Blue  — #0080ff   (modern entries, accents, data elements)
Deep Black     — #000000   (background base — CRT off state)
Dark Navy      — #0a0a1a   (game field background — CRT shadow mask)
CRT Black      — #050505   (deepest background — screen-off vignette)
```

##### Amber Variant Hierarchy (for dedicated amber CRT mode)
```
Amber (dim)    — #4d3000   (background elements, inactive UI)
Amber (mid)    — #995500   (secondary text, borders)
Amber (bright) — #ffb000   (primary text, active UI)
Amber (glow)   — #ffbf00   (title, highlights, max intensity)
Amber (white)  — #ffe566   (focus cursor, selection, peak brightness)
```

#### CRT Effects (consistent across all games)
- **Scanlines:** Horizontal line overlay via `repeating-linear-gradient`
- **Vignette:** Radial darkening at edges
- **Screen flicker:** Subtle opacity animation
- **Neon glow:** `box-shadow` and `text-shadow` with layered blur radii
- **Font:** `'Courier New', monospace` throughout (retro terminal feel)
- **Phosphor Color Mode:** Each game may render in one of three CRT phosphor styles:
  - **AMBER** — Warm amber phosphor (P3-style), default for classic arcade feel
  - **GREEN** — Electric green phosphor (P1-style), classic terminal / CGA feel
  - **RGB** — Full neon cyberpunk palette (cyan, magenta, pink), for modern entries

#### Screen Dimensions
Games use varied aspect ratios depending on genre:
- **Vertical shooter:** 400 × 600 (portrait, e.g., CYBERFLY)
- **Horizontal runner:** 800 × 500 (widescreen, e.g., CYBER DASH)
- **Square/puzzle:** 400–500px per side (e.g., tetris, trivia)

---

## Game Catalog

### Existing Games

| Game | Title | Genre | View | Core Mechanic | Key Colors |
|------|-------|-------|------|---------------|------------|
| 1 | **CYBERFLY // 2087** | Vertical shooter / flight | Portrait 400×600 | Dodge obstacles, shoot enemies, survive | Magenta frame, black void |
| 2 | **CYBER DASH** | Neon runner / endless | Landscape 800×500 | Lane-switching, obstacle avoidance, speed scaling | Cyan frame, navy field |
| 3 | **Neon Brickout** | Brick breaker | Landscape | Paddle control, ball physics, brick destruction | — |
| 4 | **CYBERPUNK Trivia** | Knowledge quiz | Overlay UI | Answer cyberpunk-themed questions under pressure | — |
| 5 | **Canyon Runner** | Endless runner | ? | Obstacle avoidance | — |
| 6 | **Missile Command** | Classic arcade shooter | ? | Target defense, strategic placement | — |
| 7 | **Falldown** | Falling object catcher | ? | Catch/dodge falling items | — |
| 8 | **Tetris** | Block puzzle | Standard | Piece rotation, line clearing | — |
| 9 | **Neon Brickout** | Brick breaker | Landscape | Paddle control, ball physics, neon power-ups | — |
| 10 | **Gridwar** | Tactical combat | Landscape | Strategic grid-based combat | — |
| 11 | **NEON OVERDRIVE // 2087** | Two-player racing | Landscape (fullscreen) | Drift physics, lap timing, collision | Cyan vs Magenta |
| 12 | **CYBER RACE** | Two-player racing | Top-down fullscreen | Track boundaries, lap counting, time trial | Cyan vs Magenta |
| 13 | **Cyber Dash** | Endless runner | Landscape 800x500 | Lane-switching, obstacle avoidance | Cyan frame, navy field |

### Common Game Patterns

Most arcade games in this collection follow one of these structural templates:

```
1. ENDLESS RUNNER / DODGE
   - Player moves horizontally/vertically
   - Obstacles spawn from the opposite edge
   - Speed increases over time
   - Score = distance survived or objects dodged
   - Example: CYBER DASH, CANYON RUNNER

2. VERTICAL SHOOTER
   - Player at bottom, moves freely within bounds
   - Enemies spawn from top
   - Projectiles fired upward
   - Power-ups drop from defeated enemies
   - Example: CYBERFLY

3. CLASSIC ARCADE CLONE
   - Faithful or cyberpunk-themed reimagining
   - Level-based or score-chase structure
   - Example: MISSILE COMMAND, TETRIS, NEON BRICKOUT

4. QUIZ / PUZZLE
   - Static UI overlay with canvas or DOM elements
   - Timer-based decision making
   - Example: CYBERPUNK TRIVIA

5. TWO-PLAYER RACING
   - Fullscreen canvas, shared keyboard for 2 players
   - Track defined as array of waypoints (parametric curves via Catmull-Rom spline)
   - Arcade-feel physics: acceleration, braking, drift/slide on curves
   - Lap tracking via waypoint progression with checkpoint validation (prevents cheating by crossing finish line backwards)
   - Neon edge rendering with glow effects (dual-curb system: magenta outer, cyan inner)
   - Off-track penalty: speed capped to ~25% of normal
   - Car-to-car collision with spark particles
   - Minimap overlay for track overview
   - Time trial mode: single-player, 5-lap record with localStorage best times
   - Examples: NEON OVERDRIVE, CYBER RACE
```

---

## Game Design Philosophy

### Core Principles

1. **Instant Playability** — No load screens, no assets to fetch, no setup. Open the HTML file and play. This is the spirit of arcade cabinets: insert coin, press start.

2. **Cyberpunk First** — Every visual element reinforces the aesthetic. The UI is a CRT monitor. The score pulses with neon glow. The game over screen looks like a system crash.

3. **Arcade Loop** — Quick sessions (30 seconds to 3 minutes), escalating difficulty, high-score chase, one more run temptation.

4. **Minimal Assets** — Zero images, zero fonts, zero external resources. Everything is drawn with Canvas primitives or styled with CSS. The aesthetic emerges from code, not assets.

5. **Accessible Complexity** — Easy to learn (arrow keys or WASD, maybe one action button), hard to master. Depth comes from mechanics interaction, not UI complexity.

### Input Conventions

| Control | Standard Mapping |
|---------|-----------------|
| Move Left | ← or A |
| Move Right | → or D |
| Move Up | ↑ or W |
| Move Down | ↓ or S |
| Action / Shoot | Space or X |
| Pause | P or Esc |
| Start / Restart | Enter or Click overlay |

### Game States (consistent pattern)
```
MENU → PLAYING → GAME_OVER → (HIGH_SCORE?) → MENU
                ↓
            PAUSED
```

Each game includes:
- **Title screen** with neon-animated title and instructions
- **In-game HUD** (score, lives/health)
- **Pause state**
- **Game over screen** with final score, high score, and restart option
- **High score persistence** via `localStorage` (when implemented)

---

## Project Structure

```
ProjectBrainZero/cline/
├── README.md                          ← Workspace setup (git checkpoints)
├── CYBERPUNK_ARCADE_CONTEXT.md        ← This document
├── arcade.html                        ← Arcade lobby/launcher (in development)
├── [game-name].html                   ← Individual game files
└── ...
```

### Naming Convention
- Games: `snake_case.html` (e.g., `cyber_dash.html`, `neon_brickout.html`)
- Title display: `NEON_SNAKE` or `NEON SNAKE` (all caps, spaced or underscored)
- Comments/internal: `neonSnake` or `neon_snake` (camelCase or snake_case, developer's choice)

---

## Adding a New Game: Checklist

When the user says **"let's make a new game"**, here's what that entails:

### Design Phase
- [ ] Determine game genre (endless runner, vertical shooter, puzzle, classic clone, etc.)
- [ ] Define core mechanic (what does the player DO?)
- [ ] Choose screen dimensions (portrait 400×600, landscape 800×500, etc.)
- [ ] Choose CRT phosphor mode: **AMBER** (P3-style, warm terminal), **GREEN** (P1-style, classic CGA), or **RGB** (full neon cyberpunk)
- [ ] Pick primary accent color within chosen phosphor palette (see Color Palette section)
- [ ] Name the game (cyberpunk-styled, all caps with potential subtitle)

### Implementation Phase
- [ ] Create new `game-name.html` file
- [ ] Set up HTML skeleton with `<canvas>` and UI overlay
- [ ] Implement CSS: neon styling, CRT effects (scanlines + vignette + flicker)
- [ ] Implement JavaScript game loop:
  - `init()` — initialize canvas, set up event listeners
  - `gameLoop(timestamp)` — update + render cycle
  - `update(dt)` — game logic, physics, collisions
  - `render(ctx)` — draw everything
  - `handleInput(key, state)` — keyboard/touch handlers
  - `gameOver()` — transition to game over screen
  - `saveHighScore()` — localStorage persistence
- [ ] Test in browser

### Quality Checklist
- [ ] Runs without any external dependencies
- [ ] Fits within the cyberpunk aesthetic (neon, CRT, glow)
- [ ] Has clear start → play → game over → restart flow
- [ ] Controls are responsive and intuitive
- [ ] Score/tracking is visible and meaningful
- [ ] Title screen matches arcade branding
- [ ] Game over screen offers restart option

---

## Creative Prompts for New Games

When asked to generate a new game, consider these themes and mechanics that fit the arcade:

### Genre Ideas
- **Data-runner:** Horizontal platformer with wall-jump mechanics
- **Netrunner:** Top-down hack-and-slash through a corporate firewall
- **Drone Racer:** First-person (pseudo-3D) racing through a neon city
- **Hologram Hacker:** Match-3 puzzle with cyberpunk theme
- **Street Samurai:** 2D side-scrolling fighter (one-button combat)
- **Neon Taxi:** Traffic-dodging driving game
- **Data Courier:** Delivery game — navigate a maze while being chased
- **Synth DJ:** Rhythm game — hit notes to the beat
- **Corp Infiltrator:** Stealth game — avoid security cameras and guards
- **Memory Hack:** Simon-says pattern memory game with cyber theme
- **Drift King:** Two-player racing — slide through neon curves, first to N laps wins (see: NEON OVERDRIVE, CYBER RACE)
- **Neon Drift:** Drift-scored racing — points awarded for slide angle, not just speed

### Mechanics That Fit Well
- Speed increases over time (endless style)
- Wave-based enemy spawning
- Power-ups with cyberpunk names (OVERCLOCK, SHIELD, DECODE, DECOY)
- Combo system for rapid successive actions
- Progressive difficulty with "phases" (like a boss game cycling through stages)

---

## File Template (Starter)

When creating a new game, use this as the base structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>GAME_TITLE // 2087</title>
<style>
  html, body {
    width: 100%; height: 100%; margin: 0; padding: 0;
    background: #000; display: flex; justify-content: center; align-items: center;
    overflow: hidden; font-family: 'Courier New', monospace;
  }
  #gameContainer {
    position: relative;
    width: [WIDTH]px; height: [HEIGHT]px;
    border: 2px solid [COLOR];
    box-shadow: 0 0 20px [COLOR], 0 0 40px [COLOR], inset 0 0 20px rgba([COLOR_RGB], 0.1);
    overflow: hidden;
  }
  canvas { display: block; }
  /* Scanlines, vignette, flicker — copy from any existing game */
</style>
</head>
<body>
<div id="gameContainer">
  <canvas id="gameCanvas" width="[WIDTH]" height="[HEIGHT]"></canvas>
  <div id="scanlines"></div>
  <div id="vignette"></div>
  <div id="overlay">
    <div id="title">GAME_TITLE</div>
    <div id="subtitle">SUBTITLE</div>
    <div id="instructions">...</div>
    <button id="startBtn">INITIALIZE</button>
  </div>
</div>
<script>
  // Game code goes here
  // Pattern: init() → gameLoop() → render() → handleInput() → gameOver()
</script>
</body>
</html>
```

---

## Quick Reference: Color to RGB for Glow Effects

### Amber CRT Phosphor (P3-Style — Classic 1980s Terminal)
| Color | Hex | RGB |
|-------|-----|-----|
| Amber (dim) | `#4d3000` | `77, 48, 0` |
| Amber (mid) | `#995500` | `153, 85, 0` |
| Amber (bright) | `#ffb000` | `255, 176, 0` |
| Amber (glow) | `#ffbf00` | `255, 191, 0` |
| Amber (peak) | `#ffe566` | `255, 229, 102` |
| Deep Amber | `#ff8c00` | `255, 140, 0` |

### Green CRT Phosphor (P1-Style — Classic Terminal / CGA)
| Color | Hex | RGB |
|-------|-----|-----|
| Phosphor Green | `#39ff14` | `57, 255, 20` |
| Classic Green | `#00ff41` | `0, 255, 65` |
| Dark Green | `#008020` | `0, 128, 32` |
| Green Glow | `#00ff00` | `0, 255, 0` |

### Modern Cyberpunk Neon
| Color | Hex | RGB |
|-------|-----|-----|
| Cyan | `#00ffff` | `0, 255, 255` |
| Magenta | `#ff00ff` | `255, 0, 255` |
| Hot Pink | `#ff1493` | `255, 20, 147` |
| Electric Blue | `#0080ff` | `0, 128, 255` |
| Toxic Green | `#39ff14` | `57, 255, 20` |
| Orange | `#ff8c00` | `255, 140, 0` |
| Yellow | `#ffff00` | `255, 255, 0` |

---

*Last updated: 2026-06-05*
*Latest additions: NEON OVERDRIVE // 2087 — two-player drift racing on parametric oval circuit; CYBER RACE — top-down circuit racing with two-player versus and time trial modes*
*This document serves as the authoritative context for the CYBERPUNK ARCADE project. Any new game development should reference this document for aesthetic, technical, and design guidance.*