# Bug Tracker — iCloudMCP

Bugs identified by code inspection of the forked codebase as of 2026-05-04.
All bugs were inherited from upstream (iMCP) unless noted otherwise.

---

BUG-0001: Bonjour endpoint filter may not match when device name differs from app name
Severity: Medium
Related Story: US-0002
Related Task: TASK-0002
Status: Open
Fix Branch: bugfix/BUG-0001-bonjour-endpoint-filter
Lesson Encoded: No

**Detail:** In `CLI/main.swift` the service discovery loop selects services using
`String(describing: $0.endpoint).contains("iCloudMCP")`. The Bonjour `NWListener.Service`
in `ServerController` is created without an explicit `name:` parameter, so the service
name defaults to the device hostname — which may not contain "iCloudMCP". The filter
will silently fall through to `results.first!`, which could connect to a different
`_mcp._tcp` service running on the same network (e.g. another MCP server). **Reproduced when:**
another MCP service is advertising on the same local network.

---

BUG-0002: CLI network-read timeout triggers on slow tool calls (screenshot, audio recording)
Severity: High
Related Story: US-0002
Related Task: TASK-0002
Status: Open
Fix Branch: bugfix/BUG-0002-cli-network-timeout
Lesson Encoded: No

**Detail:** `StdioProxy.handleNetworkToStdout` increments `consecutiveEmptyReads` on every
empty network poll (10ms sleep each). After 1000 consecutive empty reads (~10 seconds total)
it throws `StdioProxyError.networkTimeout` and terminates. Tool calls that inherently take
longer than 10 seconds — `capture_record_audio` (user-specified duration), `capture_take_screenshot`
(multi-monitor systems), or `maps_directions` on a slow network — will hit this limit and
cause the CLI to exit mid-call. **Reproduced when:** running `capture_record_audio` with a
duration greater than 10 seconds.

---

BUG-0003: Weather tools silently absent in builds without WeatherKit entitlement
Severity: Low
Related Story: US-0017
Related Task: TASK-0017
Status: Open
Fix Branch: bugfix/BUG-0003-weather-missing-capability-ui
Lesson Encoded: No

**Detail:** `WeatherService` is gated behind `#if WEATHERKIT_AVAILABLE`. In builds that
lack the WeatherKit entitlement (`com.apple.developer.weatherkit`) the service is simply
omitted from `ServiceRegistry.services` with no indication in the UI that it is unavailable.
Users who toggle the "Weather" switch (if it appears) receive no tools, and AI clients that
ask for weather-related capabilities get no error — the tool is simply not listed. The service
toggle should either be hidden or show an "Unavailable" badge when the entitlement is absent.

---

BUG-0004: Messages activation open-panel is non-recoverable if user cancels
Severity: Medium
Related Story: US-0014
Related Task: TASK-0014
Status: Open
Fix Branch: bugfix/BUG-0004-messages-activation-recovery
Lesson Encoded: No

**Detail:** `MessageService.activate()` shows an alert then an `NSOpenPanel` for users
whose Messages database is not accessible at the default path. If the user dismisses either
dialog, `activate()` throws `DatabaseAccessError.userDeclinedAccess` and the service is
marked inactive for the current session. Subsequent `messages_fetch` tool calls trigger
`activate()` again, re-showing the alert on every single call rather than failing with a
clear static message. This creates a loop of repeated system dialogs for users who have
denied access.

---

BUG-0005: Port conflict recovery (EADDRINUSE) disconnects existing CLI clients
Severity: Medium
Related Story: US-0001
Related Task: TASK-0001
Status: Open
Fix Branch: bugfix/BUG-0005-port-conflict-graceful-recovery
Lesson Encoded: No

**Detail:** When `NWListener` enters `.waiting` with error code 48 (EADDRINUSE),
`ServerController` calls `restartWithRandomPort()`, which creates a new `NWListener` on a
random port and starts a new Bonjour advertisement. Any `icloudmcp-server` CLI instances
connected to the old port have their TCP connections severed immediately. The CLI's
`connectionClosed` handling causes it to exit rather than reconnect; the AI client session
is terminated. Port conflict typically occurs when the app is relaunched while a previous
instance still holds the port. **Workaround:** restart the AI client after app relaunch.
