# Migration Log — iCloudMCP

Cross-platform or cross-version changes that affect agent behaviour, file formats, or
toolchain configuration. Agents should read this before assuming the current state of
the repo matches prior session notes.

---

## 2026-05-04 — Fork from iMCP; iMCP → iCloudMCP rename

**Type:** Fork + Rename
**Scope:** Entire codebase

### What Changed

- Forked from `mattt/iMCP` at commit `c72a411` (initial baseline)
- All user-visible strings renamed: `iMCP` → `iCloudMCP`
- Binary target renamed: `imcp-server` → `icloudmcp-server`
- Xcode project renamed: `iMCP.xcodeproj` → `iCloudMCP.xcodeproj`
- Scheme renamed: `iMCP.xcscheme` → `iCloudMCP.xcscheme`
- Bundle identifiers updated:
  - App: `co.dododo.iMCP` → `ksyed0.iCloudMCP`
  - CLI: `com.loopwork.imcp-server` → `ksyed0.icloudmcp-server`
- `UserDefaults` keys updated to `ksyed0.iCloudMCP.*` prefix
- Sparkle feed URL updated to `downloads.icloudmcp.app`
- GitHub issue URL updated to `ksyed0/iCloudMCP`
- `LICENSE.md` updated to add fork copyright (Kamal Syed, 2026)
- Bare `LICENSE` file added for GitHub badge detection

### Agent Impact

- Any stored `UserDefaults` data from the original `iMCP` app (trusted clients, bookmarks)
  will not be read by `iCloudMCP` due to key prefix change. Users must re-grant permissions.
- `claude_desktop_config.json` entries keyed `"iMCP"` must be updated to `"iCloudMCP"`.
- The Cursor deep link base64 payload was updated to reference the new binary path.

---

## 2026-05-04 — PlanVisualizer installed

**Type:** Toolchain Addition
**Scope:** Repo root

### What Changed

- PlanVisualizer v2.1.0 installed from `ksyed0/PlanVisualizer`
- Added: `tools/`, `tests/`, `orchestrator/`, `jest.config.js`, `eslint.config.js`
- Added: `plan-visualizer.config.json` (project: iCloudMCP, repo: ksyed0/iCloudMCP)
- Added: `.github/workflows/plan-visualizer.yml`
- Added: `.claude/settings.json` with `capture-cost.js` Stop hook
- Added: `package.json` with `plan:test`, `plan:generate` scripts
- Added: `AGENTS.md`, `CLAUDE.md`, `plan_visualizer.md`
- chart.js added as a dependency (required by test suite)

### Agent Impact

- Run `npm run plan:test` (757 tests) before every commit.
- All tracked documents must follow the format in `plan_visualizer.md`.
