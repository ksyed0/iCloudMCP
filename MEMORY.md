# Memory — iCloudMCP

Key facts, decisions, and learnings that future agents should know immediately.
Linked topic files are listed at the bottom. Update this file at session close.

---

## Project Identity

- **Repo:** `ksyed0/iCloudMCP` — fork of `mattt/iMCP` — https://github.com/ksyed0/iCloudMCP
- **App name:** iCloudMCP (macOS menu bar app, MCP server)
- **CLI binary:** `icloudmcp-server` (stdio-to-TCP Bonjour proxy)
- **Bundle ID (app):** `ksyed0.iCloudMCP`
- **Bundle ID (CLI):** `ksyed0.icloudmcp-server`
- **License:** MIT (original Mattt 2025 + fork Kamal Syed 2026)
- **Platform:** macOS 15.3+, Xcode 16+, Swift 6.3

## Architecture Summary

Two Xcode targets share a Bonjour transport layer:
1. **iCloudMCP.app** — runs the MCP server (NWListener on `_mcp._tcp`), manages permissions, shows UI
2. **icloudmcp-server** — CLI spawned by AI clients; discovers the app via Bonjour and proxies stdio ↔ TCP

Ten services (Calendar, Contacts, Capture, Location, Maps, Messages, Reminders, Shortcuts, Weather, Utilities) each implement the `Service` protocol. `ServerController` owns the server lifecycle, approval queue, and service routing.

## Git & Branch State (as of Session 2 close)

- **`main`** — initial fork setup + PlanVisualizer install (7 commits)
- **`develop`** — all Session 2 work including CI, TC additions, dashboard fixes (15+ commits)
- **PR #1** open: `develop → main` — blocked pending GitHub Actions CI passing
- Branch protection: `main` and `develop` both require PR + 1 code owner review + 5 status checks

## Current ID Watermarks (as of Session 2)

See `docs/ID_REGISTRY.md` for the authoritative next-available IDs.

- EPICs: 0001–0013 used (next: EPIC-0014)
- Stories: 0001–0024 used (next: US-0025)
- Tasks: 0001–0024 used (next: TASK-0025)
- ACs: 0001–0095 used (next: AC-0096)
- TCs: 0001–0040 used (next: TC-0041)
- BUGs: 0001–0005 used (next: BUG-0006)
- Lessons: L-0001 through L-0006 (next: L-0007)

## Critical Rules Learned This Session

- **ALWAYS use `Status: Done` for Epics and Stories** — NOT `Complete`. `Complete` is a display label only. See L-0004.
- **After npm install, check .gitignore exists first** — node_modules must be excluded. See L-0006.
- **After PlanVisualizer install, copy `docs/agents/images/`** — not copied by install.sh. See L-0005.

## Known Open Bugs

| ID | Severity | Summary |
|---|---|---|
| BUG-0001 | Medium | CLI Bonjour filter uses fragile string match |
| BUG-0002 | **High** | CLI 10s network timeout triggers on slow tools |
| BUG-0003 | Low | Weather service silently absent without WeatherKit entitlement |
| BUG-0004 | Medium | Messages activation dialog loops if user cancels |
| BUG-0005 | Medium | Port conflict recovery disconnects active CLI clients |

## Release Workflow Secrets Needed

Before first release tag, configure in GitHub Settings → Secrets → Actions:
`APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_TEAM_ID`,
`KEYCHAIN_PASSWORD`, `NOTARYTOOL_APPLE_ID`, `NOTARYTOOL_PASSWORD`, `NOTARYTOOL_TEAM_ID`

## Key Technical Decisions

- **No Xcode unit tests** — the only automated test suite is PlanVisualizer's Jest suite (`npm run plan:test`)
- **WeatherKit is conditional** — gated by `#if WEATHERKIT_AVAILABLE`; requires separate entitlement
- **Messages uses SQLite direct access** — sandbox exception + security-scoped bookmark; not a public API
- **Tool results are JSON-LD** — encoded via the `Ontology` (loopwork-ai) package using schema.org types
- **CI requires code owner approval** — only @ksyed0 can approve PRs; enforce_admins=false for override

## Linked Topic Files

- `docs/ID_REGISTRY.md` — authoritative ID sequences
- `MIGRATION_LOG.md` — iMCP→iCloudMCP rename + PlanVisualizer install + CI setup
- `docs/LESSONS.md` — 6 lessons from Sessions 1 and 2
- `PROMPT_LOG.md` — full session prompt history
- `architecture/SERVER.md` — MCP server + transport layer SOP
- `architecture/SERVICES.md` — service protocol + permission model SOP
