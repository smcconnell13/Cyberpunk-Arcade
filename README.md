# Cline Workspace — CYBERPUNK ARCADE

This directory is the workspace for Cline (AI assistant) operations. It houses the **CYBERPUNK ARCADE** project — a curated collection of browser-based arcade games set in a unified cyberpunk universe.

## 🌆 CYBERPUNK ARCADE

### Overview

A collection of self-contained, zero-dependency HTML5 canvas games with a cyberpunk aesthetic. Each game runs in any modern browser with no setup required.

### Context & Design Document

📄 **[`CYBERPUNK_ARCADE_CONTEXT.md`](./CYBERPUNK_ARCADE_CONTEXT.md)** — The authoritative project reference. Contains:
- World-building and setting (year 2087, neon-drenched megacity)
- Technical framework (single-file HTML, Canvas 2D, vanilla JS)
- Visual identity system (neon colors, CRT effects, screen dimensions)
- Complete game catalog with existing titles and patterns
- Game design philosophy and core principles
- Input conventions and game state patterns
- Checklist for adding a new game
- Creative prompts and starter file template

**When you hear "let's make a new game"**, this document defines what that means: design and build a new single-file HTML5 cyberpunk arcade game that fits the established aesthetic and technical patterns.

## Setup

- Initialized with git for version control checkpoints
- `.gitignore` configured for common development patterns

## Checkpoints

Use git to create checkpoints at meaningful milestones:

```bash
git add .
git commit -m "Checkpoint: <description>"
```

## Auto-Approval Scope

Read and write operations are scoped to this directory only (`ProjectBrainZero/cline`).
