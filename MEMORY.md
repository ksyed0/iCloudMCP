# Memory — iCloudMCP

Key facts, decisions, and learnings that future agents should know immediately.
Linked topic files are listed at the bottom. Update this file at session close.

---

## Project Identity

- **Repo:** `ksyed0/iCloudMCP` — fork of `mattt/iMCP`
- **App name:** iCloudMCP (macOS menu bar app, MCP server)
- **CLI binary:** `icloudmcp-server` (stdio-to-TCP Bonjour proxy)
- **Bundle ID (app):** `ksyed0.iCloudMCP`
- **Bundle ID (CLI):** `ksyed0.icloudmcp-server`
- **License:** MIT (original Mattt 2025 + fork Kamal Syed 2026)
- **Platform:** macOS 15.3+, Xcode 16+, Swift

## Architecture Summary

Two Xcode targets share a Bonjour transport layer:
1. **iCloudMCP.app** — runs the MCP server (NWListener on `_mcp._tcp`), manages permissions, shows UI
2. **icloudmcp-server** — CLI spawned by AI clients; discovers the app via Bonjour and proxies stdio ↔ TCP

Ten services (Calendar, Contacts, Capture, Location, Maps, Messages, Reminders, Shortcuts, Weather, Utilities) each implement the `Service` protocol. `ServerController` owns the server lifecycle, approval queue, and service routing.

## Current ID Watermarks (as of Session 1)

See `docs/ID_REGISTRY.md` for the authoritative next-available IDs.

- EPICs: 0001–0012 used (next: EPIC-0013)
- Stories: 0001–0020 used (next: US-0021)
- Tasks: 0001–0020 used (next: TASK-0021)
- ACs: 0001–0078 used (next: AC-0079)
- TCs: TC-0001 through TC-0015 created this session (next: TC-0016)
- BUGs: 0001–0005 used (next: BUG-0006)
- Lessons: L-0001 through L-0003 (next: L-0004)

## Known Open Bugs

| ID | Severity | Summary |
|---|---|---|
| BUG-0001 | Medium | CLI Bonjour filter uses fragile string match |
| BUG-0002 | High | CLI 10s network timeout triggers on slow tools |
| BUG-0003 | Low | Weather service silently absent without WeatherKit entitlement |
| BUG-0004 | Medium | Messages activation dialog loops if user cancels |
| BUG-0005 | Medium | Port conflict recovery disconnects active CLI clients |

## Key Technical Decisions

- **No Xcode unit tests** — the only automated test suite is PlanVisualizer's Jest suite (`npm run plan:test`)
- **WeatherKit is conditional** — gated by `#if WEATHERKIT_AVAILABLE`; requires separate entitlement
- **Messages uses SQLite direct access** — sandbox exception + security-scoped bookmark; not a public API
- **Tool results are JSON-LD** — encoded via the `Ontology` (loopwork-ai) package using schema.org types

## Linked Topic Files

- `docs/ID_REGISTRY.md` — authoritative ID sequences
- `MIGRATION_LOG.md` — iMCP → iCloudMCP rename + PlanVisualizer install details
- `docs/LESSONS.md` — lessons from this session (L-0001 to L-0003)
- `PROMPT_LOG.md` — session prompt history
