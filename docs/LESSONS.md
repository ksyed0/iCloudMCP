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
