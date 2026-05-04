# CLAUDE.md — Claude Code Session Instructions

> **Platform file for Claude Code.** The authoritative operating standards are in `AGENTS.md`. This file adds Claude-specific directives and serves as the session entry point.

---

## Mandatory Session Startup

1. Read `AGENTS.md` in full before writing any code or using any tools.
2. Read `MEMORY.md` and all linked topic files (if present).
3. Read `PROMPT_LOG.md` to understand the prompt history and where the last session ended (if present).
4. Check `docs/ID_REGISTRY.md` before creating any new artefact (epic, story, task, AC, TC, bug) (if present).

---

## Project at a Glance

- **Repo:** `ksyed0/iCloudMCP`
- **Purpose:** macOS app connecting your digital life with AI via the Model Context Protocol (MCP).
- **Platform:** macOS (Swift / SwiftUI / Xcode)
- **Xcode Project:** `iMCP.xcodeproj`
- **App entry point:** `App/App.swift`
- **PlanVisualizer entry point:** `node tools/generate-plan.js`
- **PlanVisualizer config:** `plan-visualizer.config.json`
- **Project Constitution:** `PROJECT.md` (create if missing; see AGENTS.md)

---

## PlanVisualizer Integration

This project has PlanVisualizer installed for tracking plans, bugs, costs, and progress.

| Command | Purpose |
|---|---|
| `npm run plan:test` | Run PlanVisualizer test suite (must pass before committing) |
| `npm run plan:test:coverage` | Run with coverage report |
| `npm run plan:generate` | Generate `docs/plan-status.html` dashboard |
| `npm run plan:cleanup` | Clean stale worktrees and merged branches |

Tracked documents live in `docs/` — see `plan_visualizer.md` for format requirements.

---

## Key Protocols (from AGENTS.md)

| Protocol                | Rule                                                                                               |
| ----------------------- | -------------------------------------------------------------------------------------------------- |
| §1 Sequential Execution | **Disabled** — parallel agents permitted                                                           |
| §4 Prompt Logging       | Log every user prompt to `PROMPT_LOG.md` with timestamp                                            |
| §8 Unit Testing         | ≥80% coverage; all PlanVisualizer tests pass before any commit                                     |
| §11 Git Workflow        | `feature/*` → `develop` (PR) → `main` (PR). Never push directly to `main` or `develop`             |
| §14 Session Close       | Update `progress.md`, `MEMORY.md`, `PROMPT_LOG.md`, `LESSONS.md`, `MIGRATION_LOG.md` before ending |

---

## Git Branching Quick Reference

```
feature/US-XXXX-short-name    → squash-merge into develop via PR
bugfix/BUG-XXXX-short-name    → squash-merge into develop via PR
release/X.Y.Z                 → merge into main via PR
hotfix/BUG-XXXX-short-name    → branch from main, merge into main + develop
```

Both `main` and `develop` are **protected** — CI must pass before merging.

---

## Commit Message Format

```
[TYPE] US-XXXX | TASK-XXXX: Short imperative description (max 72 chars)
```

Types: `feat`, `fix`, `test`, `docs`, `refactor`, `chore`, `style`, `perf`

---

## Session Close Checklist

- [ ] All changes committed to feature branch, PR opened to `develop`
- [ ] `progress.md` updated with what was done, test results, blockers
- [ ] `MEMORY.md` updated with new learnings (if present)
- [ ] `PROMPT_LOG.md` updated with all prompts from this session (if present)
- [ ] `MIGRATION_LOG.md` updated if cross-platform changes were made (if present)
- [ ] `docs/LESSONS.md` updated if bugs were fixed or lessons learned (if present)
- [ ] `docs/AI_COST_LOG.md` committed if the Stop hook accumulated rows during this session
- [ ] **Before any `git stash` or branch-switch:** commit `docs/AI_COST_LOG.md` first to avoid orphaned cost rows
- [ ] PlanVisualizer tests verified passing (`npm run plan:test`)
