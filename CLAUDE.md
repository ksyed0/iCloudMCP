# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Build Commands

```bash
# Build both targets (app + CLI server)
xcodebuild -project iCloudMCP.xcodeproj -scheme iCloudMCP build

# Build for release / archive
Scripts/release.sh archive

# Run PlanVisualizer test suite (must pass before committing)
npm run plan:test

# Run PlanVisualizer tests with coverage
npm run plan:test:coverage

# Generate HTML dashboard from tracked docs
npm run plan:generate
```

There are no Xcode unit tests — all automated tests are the PlanVisualizer JS suite in `tests/`.

---

## Architecture

### Two Xcode targets

| Target | Binary | Role |
|---|---|---|
| `iCloudMCP` | `iCloudMCP.app` | Menu bar app — runs the MCP server, manages permissions, shows UI |
| `icloudmcp-server` | `icloudmcp-server` | CLI proxy — what AI clients (Claude Desktop) actually spawn |

The CLI binary is **not** an MCP server itself. It is a stdio-to-TCP bridge: on launch it uses Bonjour (`_mcp._tcp`) to discover the running menu bar app and proxies all JSON-RPC messages between the client's stdin/stdout and the app's TCP listener. This means the GUI owns all service state and permission grants.

### Service layer (`App/Services/`)

Every capability (Calendar, Contacts, Messages, etc.) implements the `Service` protocol:

```swift
protocol Service {
    @ToolBuilder var tools: [Tool] { get }
    var isActivated: Bool { get async }  // permission granted?
    func activate() async throws         // trigger permission request
}
```

Tools are declared inline using the `@ToolBuilder` result builder. Each service is a singleton (`static let shared`). `ServerController` keeps a registry of all services and routes incoming tool calls to the appropriate one.

### `ServerController` (`App/Controllers/ServerController.swift`)

Central coordinator. Responsibilities:
- Creates and manages the `MCP.Server` instance (from `swift-sdk`)
- Advertises the server via Bonjour (`NWListener` + `NWBrowserDelegate`)
- Handles connection approval flow (shows `ConnectionApprovalView`, stores trusted clients in `AppStorage`)
- Toggles services on/off based on user switches in the menu
- Routes tool calls to the right `Service` and rejects them when the app is disabled

### Connection approval

When a new TCP client connects, `ServerController` checks if the client name is in the trusted-clients list. Unknown clients trigger `ConnectionApprovalWindowController`, which shows a floating window asking the user to Allow/Deny (with an optional "Always trust" checkbox).

### Key dependencies (Swift packages)

| Package | Purpose |
|---|---|
| `swift-sdk` (modelcontextprotocol) | MCP protocol types, `Server`, transport |
| `Ontology` (loopwork-ai) | Semantic Swift types (DateTime, etc.) for encoding tool results |
| `JSONSchema` (loopwork-ai) | Input schema definitions for tools |
| `MenuBarExtraAccess` | Programmatic show/hide of the menu bar extra popover |
| `swift-service-lifecycle` | Structured lifecycle management in the CLI target |

### Conditional compilation

`WeatherService` is gated behind `#if WEATHERKIT_AVAILABLE` — the WeatherKit entitlement is separate and not available in all build configurations.

### Security-scoped bookmarks

Two places use security-scoped bookmarks for persistent out-of-sandbox file access:
- **Messages** (`App/Services/Messages.swift`) — persistent read access to `~/Library/Messages/`
- **Claude Desktop config** (`App/Integrations/ClaudeDesktop.swift`) — read/write access to `claude_desktop_config.json`

Bookmark keys are stored in `UserDefaults` under `ksyed0.iCloudMCP.*` prefixes.

---

## PlanVisualizer Integration

Tracked documents live in `docs/` — see `plan_visualizer.md` for format requirements for `RELEASE_PLAN.md`, `TEST_CASES.md`, `BUGS.md`, `AI_COST_LOG.md`, and `progress.md`.

---

## Key Protocols (from AGENTS.md)

| Protocol                | Rule |
| ----------------------- | ---- |
| §8 Unit Testing         | All PlanVisualizer tests must pass before any commit |
| §11 Git Workflow        | `feature/*` → `develop` (PR) → `main` (PR). Never push directly to `main` or `develop` |

## Git Branching

```
feature/US-XXXX-short-name    → squash-merge into develop via PR
bugfix/BUG-XXXX-short-name    → squash-merge into develop via PR
release/X.Y.Z                 → merge into main via PR
```

## Commit Message Format

```
[TYPE] US-XXXX | TASK-XXXX: Short imperative description (max 72 chars)
```

Types: `feat`, `fix`, `test`, `docs`, `refactor`, `chore`, `style`, `perf`

## Session Close Checklist

- [ ] PlanVisualizer tests passing (`npm run plan:test`)
- [ ] All changes on a feature branch, PR opened to `develop`
- [ ] `progress.md` updated with results and blockers
- [ ] `docs/AI_COST_LOG.md` committed if Stop hook accumulated rows this session
