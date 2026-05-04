# SOP: MCP Server & Transport Layer

**Layer:** Architecture (Layer 1)
**Owner:** ServerController + CLI StdioProxy
**Golden Rule:** Update this SOP before changing server lifecycle, transport, or connection approval logic.

---

## Goal

Advertise an MCP server on the local network via Bonjour so that any compatible AI client
can discover and connect to it without configuration.

---

## Components

### ServerController (`App/Controllers/ServerController.swift`)

Central coordinator. Owns:
- `NWListener` on `_mcp._tcp` (random port, local-only)
- `MCP.Server` instance (from `modelcontextprotocol/swift-sdk`)
- Per-connection actor lifecycle
- Connection approval queue (`activeApprovalDialogs`, `pendingApprovals`)
- Trusted client list (stored in `AppStorage` as JSON-encoded `Set<String>`)
- Tool call routing: dispatches `CallTool` requests to the matching `Service`

### ServerNetworkManager (nested in ServerController)

Manages `NWListener` + `NWBrowser`:
- Restarts the listener on port conflict (EADDRINUSE / error code 48) using `restartWithRandomPort()`
- Monitors listener health in a background task; auto-restarts on `.failed` or `.cancelled` state

### StdioProxy (`CLI/main.swift`)

The CLI proxy actor:
- Discovers the Bonjour service (30-second timeout)
- Opens a TCP connection to the app
- Concurrently forwards: stdin → network, network → stdout
- Filters 12-byte MCP heartbeat frames from network output
- Exits on `connectionClosed`; retries on `networkTimeout`

---

## Connection Approval Flow

```
Client connects (TCP)
    ↓
ServerController.handleNewConnection()
    ↓
Is client in trustedClients? → YES → proceed
    ↓ NO
Is approval dialog already showing for this client? → YES → queue
    ↓ NO
Show ConnectionApprovalWindowController
    ↓
User clicks Allow / Deny
    ↓ Allow
Was "Always trust" checked? → store in AppStorage
    ↓
Proceed with MCP handshake
```

---

## Known Issues

- **BUG-0001:** Service name not explicitly set in `NWListener.Service(type:domain:)` — CLI filter by endpoint string description is fragile.
- **BUG-0002:** CLI network-read timeout (1000 empty polls × 10ms = 10s) causes disconnection on slow tool calls.
- **BUG-0005:** Port conflict recovery severs active CLI connections; no graceful migration path.

---

## Edge Cases

| Scenario | Behaviour |
|---|---|
| App disabled by toggle | Tool calls return `"iCloudMCP is currently disabled"` error |
| Service not activated (no permission) | Tool call throws permission error |
| Client sends request before Initialize | MCP server buffers; SDK handles ordering |
| Multiple clients connected | Each gets its own per-connection actor |
| Listener in `.waiting` (port 48) | `restartWithRandomPort()` called automatically |
