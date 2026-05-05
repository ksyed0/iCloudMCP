# Lessons Learned — iCloudMCP

## L-0001 — Always add a LICENSE file (no extension) alongside LICENSE.md

**Rule:** Create a bare `LICENSE` file (no extension) in addition to `LICENSE.md`. GitHub's license detection only triggers on `LICENSE`, `LICENSE.txt`, or `LICENSE.md` at the repo root — but only the no-extension form reliably surfaces the license badge on the repo page.
_Discovered when setting the MIT license: LICENSE.md existed but GitHub did not show the license badge until a bare LICENSE file was added._
**Date:** 2026-05-04

## L-0002 — PlanVisualizer install script does not copy all orchestrator files

**Rule:** After running `scripts/install.sh`, manually copy `orchestrator/file-lock.js`, `orchestrator/spawn.js`, `orchestrator/git-safe.js`, and `orchestrator/adapters/` from the PlanVisualizer source. The install script only copies `orchestrator/atomic-write.js`, causing test suite failures on the first run.
_Discovered during PlanVisualizer installation into iCloudMCP: 8 test suites failed with MODULE_NOT_FOUND errors until the missing orchestrator files were copied manually._
**Date:** 2026-05-04

## L-0003 — Bonjour service name is not set explicitly; CLI filter is fragile

**Rule:** When using `NWListener.Service(type:domain:)` without a `name:` parameter, the advertised Bonjour service name defaults to the device hostname, not the app name. Any filter that checks for the app name in `String(describing: endpoint)` will fail on machines whose hostname differs from the expected string. Always set an explicit `name:` or filter on service type alone.
_Identified during codebase analysis (BUG-0001): `CLI/main.swift` filters by `.contains("iCloudMCP")` which is unreliable._
**Date:** 2026-05-04

## L-0004 — plan_visualizer.md spec says "Complete"; parsers require "Done"

**Rule:** Never use `Status: Complete` for Epics or Stories in RELEASE_PLAN.md. The plan_visualizer.md documentation lists `Complete` as a valid status, but every parser in the codebase (`detect-at-risk.js`, `compute-risk.js`, `snapshot.js`, `render-tabs.js`, `historical-sim.js`) exclusively checks `status === 'Done'`. `Complete` is only used as a _display label_ mapped from `Done` inside `render-tabs.js`. Stories marked `Complete` are treated as still-active, causing all linked TCs to be flagged as at-risk and the traceability matrix to show incorrect state.
_Discovered when the traceability matrix showed everything as at-risk and Not Run despite all 15 TCs being marked Pass. Root cause: 37 story/epic Status fields used `Complete` instead of `Done`._
**Date:** 2026-05-04

## L-0005 — install.sh omits docs/agents/images/ — agentic dashboard portraits broken

**Rule:** After running PlanVisualizer's `install.sh`, manually copy `docs/agents/images/` from the PlanVisualizer source repo. The install script copies `docs/dashboard.html` but not the agent portrait PNGs it references at the relative path `agents/images/`. Without this, all portrait thumbnails and avatar chips in the agentic dashboard are broken (404).
_Filed as ksyed0/PlanVisualizer#533. Fixed locally by copying 9 agent PNGs + 27 optimised variants._
**Date:** 2026-05-04

## L-0006 — Add .gitignore before first npm install to prevent committing node_modules

**Rule:** Create `.gitignore` with `node_modules/` before running `npm install` in any project. In this case, `npm install` ran before `.gitignore` existed, committing ~4,200 node_modules files in a single commit. A follow-up commit had to `git rm -r --cached node_modules/` to remove them, creating a noisy history entry.
_Discovered when the CI commit included 4,221 file additions — almost entirely node_modules. The fix commit had 10,772 file deletions._
**Date:** 2026-05-04
