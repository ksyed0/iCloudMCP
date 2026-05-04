# Project Constitution — iCloudMCP

> **North Star:** Give AI assistants like Claude frictionless, privacy-respecting access to
> macOS personal data (calendar, contacts, messages, location, etc.) via the Model Context
> Protocol, with the user always in control of what is shared.

---

## §1 — Project Identity

| Field | Value |
|---|---|
| Name | iCloudMCP |
| Repo | `ksyed0/iCloudMCP` |
| Upstream | `mattt/iMCP` (forked 2026-05-04) |
| License | MIT |
| Platform | macOS 15.3+, Swift, Xcode 16+ |
| Bundle ID (app) | `ksyed0.iCloudMCP` |
| Bundle ID (CLI) | `ksyed0.icloudmcp-server` |

---

## §2 — Architecture

### Two-Target Design

| Target | Binary | Role |
|---|---|---|
| `iCloudMCP` | `iCloudMCP.app` | Menu bar app — MCP server, permissions, UI |
| `icloudmcp-server` | `icloudmcp-server` | CLI proxy — Bonjour discovery + stdio↔TCP bridge |

### Transport

- App advertises `_mcp._tcp` via Bonjour (`NWListener`)
- CLI discovers the service and proxies all JSON-RPC between client stdio and app TCP
- Both run on the local network only (`acceptLocalOnly = true`)

### Service Layer

Every capability implements `protocol Service`:
```swift
protocol Service {
    @ToolBuilder var tools: [Tool] { get }
    var isActivated: Bool { get async }
    func activate() async throws
}
```

Services are singletons. `ServerController` is the central coordinator that owns server
lifecycle, connection approval, trusted-client state, and tool routing.

### Services & Tools (29 total)

| Service | Tools |
|---|---|
| Calendar | `calendars_list`, `events_fetch`, `events_create` |
| Contacts | `contacts_me`, `contacts_search`, `contacts_create`, `contacts_update` |
| Capture | `capture_take_picture`, `capture_record_audio`, `capture_take_screenshot` |
| Location | `location_current`, `location_geocode`, `location_reverse-geocode` |
| Maps | `maps_search`, `maps_directions`, `maps_explore`, `maps_eta`, `maps_generate` |
| Messages | `messages_fetch` |
| Reminders | `reminders_lists`, `reminders_fetch`, `reminders_create` |
| Shortcuts | `shortcuts_list`, `shortcuts_run` |
| Weather | `weather_current`, `weather_daily`, `weather_hourly`, `weather_minute` |
| Utilities | `utilities_beep` |

Weather is conditional (`#if WEATHERKIT_AVAILABLE`).

---

## §3 — Behavioral Rules

- **Privacy first:** The app never transmits data externally. All tool calls are local.
- **Permission gating:** Every service requires explicit macOS permission before its tools are available.
- **User approval:** New MCP clients must be approved by the user before any tools are callable.
- **No silent failures:** Disabled services return explicit error messages to the AI client.
- **Trusted clients:** Once approved with "Always trust", a client bypasses future dialogs.

---

## §4 — Data Schema

### Tool Result Format

All tools return JSON-LD encoded via the `Ontology` (loopwork-ai) package:
```json
{ "@context": "https://schema.org", "@type": "Person", "name": "..." }
```

### Security-Scoped Bookmarks

Two UserDefaults keys store persistent file access:
- `ksyed0.iCloudMCP.claudeConfigBookmark` — Claude Desktop config
- `ksyed0.iCloudMCP.messagesDatabaseBookmark` — Messages chat.db

### MCP Server Advertisement

```
Service type: _mcp._tcp
Domain: local.
Name: (device hostname — not explicitly set)
```

---

## §5 — Key Dependencies

| Package | Source | Purpose |
|---|---|---|
| `swift-sdk` | modelcontextprotocol | MCP protocol, Server, transport |
| `Ontology` | loopwork-ai | JSON-LD types for tool results |
| `JSONSchema` | loopwork-ai | Input schema definitions |
| `madrid` | loopwork-ai | iMessage SQLite + typedstream decoding |
| `MenuBarExtraAccess` | orchetect | Programmatic menu bar extra control |
| `swift-service-lifecycle` | swift-server | CLI lifecycle management |

---

## §6 — Development Tooling

- **PlanVisualizer** (`ksyed0/PlanVisualizer` v2.1.0) — dashboard for epics, costs, bugs
- **Jest** — PlanVisualizer test suite (`npm run plan:test`, 757 tests)
- **capture-cost.js** Stop hook — appends AI cost rows to `docs/AI_COST_LOG.md` each session

---

## §7 — Open Issues

See `docs/BUGS.md` for the full bug list. Critical open issues:

- **BUG-0002 (High):** CLI 10-second network timeout causes premature disconnection on slow tool calls (audio recording, screenshots)
- **BUG-0001 (Medium):** Bonjour endpoint filter fragility — may connect to wrong MCP service

---

## §8 — Discovery Answers (Session 1)

| Question | Answer |
|---|---|
| North Star | Give AI assistants frictionless, private access to macOS data via MCP |
| Integrations | Apple frameworks only (EventKit, CNContactStore, ScreenCaptureKit, etc.) |
| Source of Truth | macOS system data via Apple frameworks; Messages via direct SQLite |
| Delivery Payload | JSON-LD tool results via MCP protocol to AI clients (Claude Desktop, etc.) |
| Behavioral Rules | Privacy-first; always user-approved; no external data transmission |
