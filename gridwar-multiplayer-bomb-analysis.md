# GRIDWAR MULTIPLAYER — BOMB CHAIN REACTION BUG ANALYSIS

File: /workspace/Arcade/Gridwar-multiplayer.html
Date: 2026-07-12

---

## SUMMARY

The bomb chain reaction system in the multiplayer version has a critical
double-splice bug that silently deletes unrelated bombs, plus a structural
single-hop chain discovery limitation that prevents multi-bomb cascades
from propagating correctly. Three additional minor issues were found.

The single-player version (Gridwar.html) fixed the double-splice bug
but still has the single-hop chain discovery limitation.

---

## BUG #1 — CRITICAL: Double-Splice Silently Deletes Unrelated Bombs

**Location:** triggerExp() lines 794-858, update() line 667

### What Happens

When a bomb's timer reaches zero, the update loop calls triggerExp(b)
then splices the bomb:

    // update(), line 667
    if(b.timer<=0){triggerExp(b); ...; bombs.splice(i,1);}

Inside triggerExp, the chain discovery loop does NOT skip the original
bomb. The original bomb is still in the bombs[] array (it gets spliced
by the caller AFTER triggerExp returns). Its position matches the center
explosion tile (line 801), so it gets added to done[]:

    // triggerExp(), lines 817-830
    while(chain){
      chain=false;
      for(var bi=0;bi<bombs.length;bi++){
        if(done.indexOf(bombs[bi])>=0)continue;
        for(var ei=0;ei<explosions.length;ei++){
          if(bombs[bi].x===explosions[ei].x && bombs[bi].y===explosions[ei].y){
            done.push(bombs[bi]); chain=true; break;
          }
        }
      }
    }

Then the splice loop removes ALL bombs in done[] from bombs[], including
the original:

    // triggerExp(), lines 854-856
    for(var bi=bombs.length-1;bi>=0;bi--){
      if(done.indexOf(bombs[bi])>=0) bombs.splice(bi,1);
    }

Now control returns to update(). The original bomb has ALREADY been
spliced from bombs[]. But update() runs bombs.splice(i,1) anyway. Index
i now points to whatever bomb shifted into that position — a completely
unrelated bomb gets silently deleted without exploding.

### Impact

- Bombs randomly vanish from the field without detonating
- Players lose bomb placement capacity for no reason (the bomb counter
  thinks the bomb is gone but no explosion happened)
- In a two-player game, this can cause unfair advantages/disadvantages
  when bombs near each other chain-explode

### Root Cause

The single-player version (Gridwar.html, line 1256) explicitly skips the
original bomb in chain discovery:

    if (otherBomb === bomb) continue;

The multiplayer version omitted this check.

### Fix

Option A (minimal — matches single-player pattern):

Add a skip for the original bomb in the chain discovery loop:

    // In triggerExp(), inside the while loop:
    for(var bi=0;bi<bombs.length;bi++){
      if(bombs[bi]===bomb) continue;        // <-- ADD THIS
      if(done.indexOf(bombs[bi])>=0)continue;
      ...

Option B (more robust):

Don't splice chain bombs inside triggerExp at all. Return the list of
chain bombs and let the caller handle all splicing:

    function triggerExp(bomb){
      ...
      // Return chain bombs instead of splicing them
      return done;
    }

    // In update():
    if(b.timer<=0){
      var chainBombs = triggerExp(b);
      // Splice original bomb
      bombs.splice(i,1);
      // Splice chain bombs
      for(var j=bombs.length-1;j>=0;j--){
        if(chainBombs.indexOf(bombs[j])>=0) bombs.splice(j,1);
      }
    }

---

## BUG #2 — MAJOR: Single-Hop Chain Discovery

**Location:** triggerExp() lines 817-852 (all versions)

### What Happens

The chain reaction uses a two-phase approach:
  1. Discovery phase (while loop): find all bombs on explosion tiles
  2. Processing phase (for loop): create explosion tiles for chain bombs

The problem: new explosion tiles for chain bombs are only created in
the processing phase, AFTER the discovery while loop exits. The while
loop can only find bombs that overlap with the ORIGINAL bomb's explosion
path. Bombs reachable only through a chained bomb's explosion are never
discovered.

### Example Scenario

    Bomb A at (5,5) — blast radius 3 — timer expires
    Bomb B at (7,5) — within A's blast radius
    Bomb C at (9,5) — NOT within A's blast radius, but within B's

    1. A explodes → explosion tiles: (5,5),(6,5),(7,5),(8,5)
    2. Discovery loop finds B at (7,5) → added to done[]
    3. Discovery loop does NOT find C at (9,5) — not on any explosion tile
    4. Processing phase creates B's explosion tiles: includes (9,5)
    5. But discovery already finished — C is never chain-detected
    6. C sits on the field with its original timer, explodes later

### Impact

- Chain reactions stop after one hop in many configurations
- Bombs that should chain-explode instead detonate on their own timers
- Creates unpredictable explosion timing — the core complaint about
  "proximity of multiple bombs and when they go off"

### Note

This bug exists in ALL three versions (multiplayer, single-player,
backup). The single-player version's comment says "Collect all bombs
that need to explode FIRST, then trigger explosions" but the
implementation doesn't interleave discovery with explosion creation.

### Fix

Interleave discovery and explosion creation in a single loop so that
chain bomb explosions are immediately added to the explosion tile set,
allowing the next iteration to discover bombs on those new tiles:

    function triggerExp(bomb){
      if(!bomb||bomb.x===undefined||bomb.y===undefined)return [];
      var processed = [];  // bombs already exploded (including original)
      var queue = [bomb];   // bombs to process

      while(queue.length > 0){
        var cb = queue.shift();
        processed.push(cb);

        var player = players[cb.owner];
        if(!player) continue;
        var r = player.blastRadius;
        var cardinals = [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}];

        // Center explosion
        explosions.push({x:cb.x, y:cb.y, timer:EXP_DUR});
        spawnExp(cb.x, cb.y);

        // Expand cardinals
        for(var ci=0; ci<cardinals.length; ci++){
          var d = cardinals[ci];
          for(var i=1; i<=r; i++){
            var nx = cb.x + d.x*i, ny = cb.y + d.y*i;
            if(nx<0||nx>=COLS||ny<0||ny>=ROWS) break;
            if(grid[ny][nx]===SOLID) break;
            explosions.push({x:nx, y:ny, timer:EXP_DUR});
            spawnExp(nx, ny);
            if(grid[ny][nx]===DESTRUCTIBLE){
              grid[ny][nx]=EMPTY; spawnPU(nx,ny); break;
            }
          }
        }

        // Check if any unprocessed bombs are now on explosion tiles
        for(var bi=0; bi<bombs.length; bi++){
          if(processed.indexOf(bombs[bi])>=0) continue;
          if(queue.indexOf(bombs[bi])>=0) continue;
          for(var ei=0; ei<explosions.length; ei++){
            if(bombs[bi].x===explosions[ei].x &&
               bombs[bi].y===explosions[ei].y){
              queue.push(bombs[bi]);
              break;
            }
          }
        }
      }

      SFX.explosion();

      // Return all bombs that were exploded (original + chains)
      // Caller is responsible for splicing them from bombs[]
      return processed;
    }

Then in update():

    if(b.timer<=0){
      var exploded = triggerExp(b);
      if(b.owner===1) _p2BombJustDropped = false;
      // Splice all exploded bombs (original + chains)
      for(var j=bombs.length-1; j>=0; j--){
        if(exploded.indexOf(bombs[j])>=0) bombs.splice(j,1);
      }
    }

This fix:
- Uses a worklist queue instead of a two-phase approach
- Creates explosion tiles immediately when a bomb is processed
- Checks for newly-covered bombs after each explosion is added
- Handles multi-hop chains correctly (A→B→C→D...)
- Returns the full list of exploded bombs for the caller to splice
- Eliminates the double-splice bug (Bug #1) as a side effect

---

## BUG #3 — MINOR: Duplicate Explosion Tiles

**Location:** triggerExp() lines 801-816 and 831-852

### What Happens

Because the original bomb is included in done[] (Bug #1), the chain
processing loop (lines 831-852) creates explosion tiles for it again.
These duplicate the tiles already created in the initial expansion
(lines 801-816).

### Impact

- Duplicate explosion tiles on the same grid cell
- Duplicate particles spawned (visual clutter, minor perf hit)
- Duplicate powerup spawn checks (though the grid check prevents
  double-spawning since the tile is already EMPTY)

### Fix

Fixed automatically by Bug #1 fix (the original bomb is excluded from
chain processing).

---

## BUG #4 — MINOR: No Chain Reaction Visual Delay

**Location:** triggerExp() — all explosions created in same frame

### What Happens

All chain bombs explode in the same animation frame. In classic
Bomberman, chain reactions have a brief delay (50-100ms) creating a
visual cascade effect. Here, everything appears simultaneously.

### Impact

- Chain reactions look flat/uniform rather than cascading
- Harder to visually parse which bomb triggered which

### Fix (Optional)

Give chain-discovered bombs a small timer offset instead of exploding
immediately:

    // In the worklist approach, add a delay field:
    queue.push({bomb: bombs[bi], delay: 80});  // 80ms delay
    
    // Only process bombs whose delay has elapsed:
    // (requires moving chain processing to the update loop)

This is a gameplay/visual polish issue, not a correctness bug. The
worklist fix for Bug #2 can be extended to support delayed chain
reactions if desired.

---

## BUG #5 — MINOR: Joiner Bomb Array Replaced Every Frame

**Location:** Joiner state handler, line 1242

### What Happens

The host sends the full game state (including bombs array) every frame.
The joiner replaces its entire bombs array:

    if(b2) bombs = b2.map(function(b){{x:b.x,y:b.y,timer:b.timer,...}});

But the joiner's update() function also runs, decrementing bomb timers
and potentially splicing exploded bombs. The state message overwrites
this local state every frame, causing:

- Timer jitter: joiner decrements timer, then state resets it to
  host's value
- Visual flicker: if joiner predicts a bomb explosion (timer hits 0
  locally before host's message arrives), the bomb disappears then
  reappears when the next state message still includes it
- Locally-predicted P2 bombs (client-side prediction, line 1280) may
  vanish if the host hasn't processed the input yet

### Impact

Minor visual glitches on the joiner's screen. Not a game-breaking bug
but contributes to the feeling that bomb timing is "off."

### Fix (If Desired)

- Option A: Don't run bomb timer logic on the joiner — purely render
  from host state (simplest, removes prediction)
- Option B: Use interpolation/reconciliation instead of wholesale
  replacement (more complex, smoother visuals)
- Option C: Accept the current behavior as acceptable for P2P

---

## COMPARISON WITH SINGLE-PLAYER VERSION

| Issue | Multiplayer | Single-Player |
|------|-------------|---------------|
| Double-splice (Bug #1) | PRESENT | Fixed (skips original bomb) |
| Single-hop chain (Bug #2) | PRESENT | PRESENT |
| Duplicate tiles (Bug #3) | PRESENT | Fixed (original bomb excluded) |
| No cascade delay (Bug #4) | PRESENT | PRESENT |
| Bomb array sync (Bug #5) | N/A (P2P only) | N/A |

The single-player version already fixed Bugs #1 and #3 by adding the
explicit `if (otherBomb === bomb) continue;` check. The multiplayer
version was likely written before or independently of this fix.

---

## RECOMMENDED FIX PRIORITY

1. **Bug #1 (double-splice)** — Fix immediately. Silently deletes bombs.
   One-line fix: add `if(bombs[bi]===bomb) continue;` to the chain
   discovery loop in triggerExp().

2. **Bug #2 (single-hop chain)** — Fix next. Causes the user-reported
   "proximity/timing" bug. Requires restructuring triggerExp to use a
   worklist queue (full rewrite of the function, ~40 lines).

3. **Bug #3 (duplicate tiles)** — Automatically fixed by Bug #1 fix.

4. **Bug #4 (no cascade delay)** — Optional polish. Not a correctness
   issue.

5. **Bug #5 (joiner sync)** — Monitor. May not be noticeable in
   practice due to 60fps state updates.

---

## APPENDIX: TRACE OF BUG #1 DOUBLE-SPLICE

Initial state: bombs = [B0(idx0), B1(idx1), B2(idx2)]
B1's timer reaches 0. update() calls triggerExp(B1), i=1.

Inside triggerExp(B1):
  - Center explosion at B1's position
  - Chain discovery finds B1 (matches center explosion tile)
  - done = [B1]
  - Chain processing creates duplicate explosion tiles for B1
  - Splice loop: finds B1 at index 1, splices it
  - bombs is now [B0(idx0), B2(idx1)]  ← B2 shifted to index 1!

Back in update(), after triggerExp returns:
  - bombs.splice(1, 1)  ← removes B2, not B1!
  - bombs is now [B0]  ← B2 silently deleted, never exploded

Result: B2 vanishes from the field without detonating.
