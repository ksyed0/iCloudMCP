# Architecture Overview — iCloudMCP

iCloudMCP exposes macOS personal data to AI clients via the Model Context Protocol.
It consists of two binaries that communicate over a local Bonjour-advertised TCP connection.

---

## System Architecture

```mermaid
flowchart TB
    %% ── AI Clients ──────────────────────────────────────────────────────────
    subgraph CLIENTS["AI Clients  (stdio · JSON-RPC)"]
        direction LR
        CD["Claude Desktop"]
        CC["Claude Code"]
        CU["Cursor"]
        AM["Amp"]
    end

    %% ── CLI Proxy ───────────────────────────────────────────────────────────
    subgraph CLI_BOX["icloudmcp-server  (CLI binary)"]
        PROXY["StdioProxy\n──────────────\nDiscovers app via Bonjour\n_mcp._tcp · local.\nBridges stdin/stdout ↔ TCP\nFilters MCP heartbeat frames"]
    end

    %% ── App ─────────────────────────────────────────────────────────────────
    subgraph APP["iCloudMCP.app  (menu bar)"]
        direction TB

        subgraph CTRL["ServerController"]
            direction LR
            SRV["MCP Server\nNWListener · Bonjour"]
            APPR["Connection Approval\nTrusted-client allowlist\nAppStorage"]
        end

        subgraph UI["UI Layer"]
            direction LR
            MBE["ContentView\nMenu bar extra"]
            SET["SettingsView\nTrusted clients"]
            ABT["AboutWindow"]
        end

        subgraph SVCS["Service Layer  (29 MCP tools total)"]
            direction TB
            CAL["📅 Calendar\ncalendars_list\nevents_fetch\nevents_create"]
            CON["👤 Contacts\ncontacts_me\ncontacts_search\ncontacts_create\ncontacts_update"]
            CAP["📷 Capture\ncapture_take_picture\ncapture_record_audio\ncapture_take_screenshot"]
            LOC["📍 Location\nlocation_current\nlocation_geocode\nlocation_reverse-geocode"]
            MAP["🗺 Maps\nmaps_search · maps_directions\nmaps_explore · maps_eta\nmaps_generate"]
            MSG["💬 Messages\nmessages_fetch"]
            REM["🔔 Reminders\nreminders_lists\nreminders_fetch\nreminders_create"]
            SHC["⚡ Shortcuts\nshortcuts_list\nshortcuts_run"]
            WTH["🌤 Weather ¹\nweather_current\nweather_daily\nweather_hourly\nweather_minute"]
            UTL["🔈 Utilities\nutilities_beep"]
        end
    end

    %% ── Apple Frameworks ────────────────────────────────────────────────────
    subgraph FWKS["Apple Frameworks"]
        direction TB
        EK["EventKit"]
        CN["Contacts framework"]
        AV["ScreenCaptureKit\nAVFoundation"]
        CL["CoreLocation\nCLGeocoder"]
        MK["MapKit\nMKLocalSearch\nMKDirections\nMKMapSnapshotter"]
        SQ["SQLite3\n~/Library/Messages/chat.db"]
        SK["Shortcuts framework"]
        WK["WeatherKit ¹\nApple Weather API"]
        NS["NSSound\nAppKit"]
    end

    %% ── iCloud ──────────────────────────────────────────────────────────────
    subgraph ICLOUD["iCloud  (Apple-managed sync)"]
        direction LR
        IC_CAL["☁ iCloud Calendar"]
        IC_REM["☁ iCloud Reminders"]
        IC_CON["☁ iCloud Contacts"]
        IC_MSG["☁ iMessage / iCloud"]
    end

    %% ── Integration ─────────────────────────────────────────────────────────
    subgraph INT["Integration"]
        CDF["Claude Desktop\nclaude_desktop_config.json\n(security-scoped bookmark)"]
    end

    %% ── Edges ───────────────────────────────────────────────────────────────
    CD & CC & CU & AM -->|"stdio  JSON-RPC"| PROXY
    PROXY -->|"TCP  JSON-RPC\nBonjour discovery"| SRV
    SRV --> APPR
    SRV --> SVCS
    MBE --> CTRL
    MBE --> UI
    SET --> APPR

    CAL --> EK
    REM --> EK
    CON --> CN
    CAP --> AV
    LOC --> CL
    MAP --> MK
    MSG --> SQ
    SHC --> SK
    WTH --> WK
    UTL --> NS

    EK <-->|syncs| IC_CAL
    EK <-->|syncs| IC_REM
    CN <-->|syncs| IC_CON
    SQ <-->|syncs| IC_MSG

    CD -->|"Configure Claude Desktop"| CDF
    CDF -->|"sets icloudmcp-server path"| CLI_BOX
```

> ¹ WeatherKit is conditionally compiled (`#if WEATHERKIT_AVAILABLE`) and requires the
> `com.apple.developer.weatherkit` entitlement. It is omitted from builds without it.

---

## Transport Detail

```mermaid
sequenceDiagram
    participant Client as AI Client<br/>(e.g. Claude Desktop)
    participant CLI as icloudmcp-server<br/>(stdio proxy)
    participant Bonjour as Bonjour<br/>_mcp._tcp
    participant App as iCloudMCP.app<br/>(MCP server)

    App->>Bonjour: Advertise _mcp._tcp (NWListener)
    Client->>CLI: spawn process (stdio)
    CLI->>Bonjour: Browse _mcp._tcp (30s timeout)
    Bonjour-->>CLI: Endpoint discovered
    CLI->>App: TCP connect
    App->>App: Connection approval check
    Note over App: Unknown client → show approval dialog<br/>Trusted client → proceed immediately
    App-->>CLI: MCP Initialize response
    CLI-->>Client: Forward via stdout

    loop Tool calls
        Client->>CLI: JSON-RPC request (stdin)
        CLI->>App: Forward via TCP
        App->>App: Route to Service → call Apple framework
        App-->>CLI: JSON-RPC response (TCP)
        CLI-->>Client: Forward via stdout
    end
```

---

## Permission Model

Each service gate-checks the relevant macOS permission before any tool call.
Permissions are requested via the standard macOS system dialog on first activation.

| Service | Framework | Permission |
|---|---|---|
| Calendar | EventKit | Full Calendar access |
| Reminders | EventKit | Full Reminders access |
| Contacts | CNContactStore | Contacts access |
| Capture | ScreenCaptureKit / AVFoundation | Screen recording + Camera + Microphone |
| Location | CoreLocation | When-in-use location |
| Maps | MapKit | None (uses location implicitly) |
| Messages | SQLite direct | Sandbox exception + NSOpenPanel bookmark |
| Shortcuts | Shortcuts framework | None |
| Weather | WeatherKit | `weatherkit` entitlement |
| Utilities | AppKit | None |

---

## Key Invariants

- The CLI binary is **not** an MCP server — it is a pure stdio↔TCP bridge. All server logic lives in the app.
- **Only the app process** holds macOS permissions. The CLI has no entitlements of its own.
- All communication is **local-only** (`acceptLocalOnly = true`, IPv4, no peer-to-peer).
- Tool results are encoded as **JSON-LD** via the `Ontology` package (schema.org types).
- The Bonjour service name defaults to the device hostname — see `architecture/SERVER.md` and BUG-0001.
