# Release Plan — iCloudMCP

Reverse-engineered from source as of 2026-05-04. All epics and stories reflect
capabilities present in the codebase. Status reflects implementation completeness,
not QA sign-off on the forked repo.

---

```
EPIC-0001: MCP Server Infrastructure & Transport
Description: Core Bonjour-based TCP server that hosts the MCP protocol, plus the icloudmcp-server CLI proxy binary that AI clients spawn. Together they form the invisible transport layer all service tools depend on.
Release Target: MVP
Status: Complete
Dependencies: None
```

```
US-0001 (EPIC-0001): As an AI client, I want to discover and connect to an MCP server advertised over Bonjour, so that I can call macOS tools without hardcoded ports.
Priority: High
Estimate: L
Status: Complete
Branch: feature/US-0001-bonjour-mcp-server
Dependencies: None
Acceptance Criteria:
  - [x] AC-0001: ServerController advertises an NWListener on service type _mcp._tcp in the local. domain
  - [x] AC-0002: Multiple simultaneous client connections are supported via per-connection actors
  - [x] AC-0003: Incoming tool call requests are routed to the correct Service by tool name
  - [x] AC-0004: When the app is disabled, tool calls return an explicit error message rather than hanging
  - [x] AC-0005: The listener auto-restarts on port conflict (EADDRINUSE / NWError code 48) using a random port
```

```
TASK-0001 (US-0001): Implement NWListener + Bonjour advertisement in ServerController
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-0001-bonjour-mcp-server
Notes:
```

```
US-0002 (EPIC-0001): As an AI client, I want to spawn a CLI binary that transparently bridges my stdio to the running iCloudMCP app, so that I do not need to manage TCP connections directly.
Priority: High
Estimate: L
Status: Complete
Branch: feature/US-0002-cli-stdio-proxy
Dependencies: US-0001
Acceptance Criteria:
  - [x] AC-0006: The icloudmcp-server binary discovers the Bonjour service within 30 seconds or exits with a clear error
  - [x] AC-0007: All stdin bytes (non-whitespace-only) are forwarded to the TCP connection
  - [x] AC-0008: All network bytes are forwarded to stdout, reassembled on newline message boundaries
  - [x] AC-0009: MCP heartbeat messages (12-byte magic-prefixed frames) are silently filtered and not written to stdout
  - [x] AC-0010: On connection close (peer reset or cancel) the proxy exits cleanly rather than looping
```

```
TASK-0002 (US-0002): Implement StdioProxy actor with bidirectional forwarding and heartbeat filtering
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-0002-cli-stdio-proxy
Notes:
```

---

```
EPIC-0002: Menu Bar Application Shell
Description: The macOS menu bar extra that owns the server lifecycle, presents the service toggle list, and provides access to settings and about screens.
Release Target: MVP
Status: Complete
Dependencies: EPIC-0001
```

```
US-0003 (EPIC-0002): As a user, I want a menu bar icon that lets me toggle the MCP server on/off and enable individual services, so that I control what data AI clients can access.
Priority: High
Estimate: M
Status: Complete
Branch: feature/US-0003-menu-bar-app
Dependencies: US-0001
Acceptance Criteria:
  - [x] AC-0011: The menu bar icon shows distinct On/Off states matching the server enabled state
  - [x] AC-0012: A master toggle enables or disables the entire MCP server
  - [x] AC-0013: Each service has an individual toggle; disabling a service excludes its tools from the server
  - [x] AC-0014: The menu exposes "Configure Claude Desktop", "Copy server command", Settings, About, and Quit actions
```

```
TASK-0003 (US-0003): Build ContentView with service toggles and menu actions
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-0003-menu-bar-app
Notes:
```

```
US-0004 (EPIC-0002): As a user, I want a Settings window where I can review and remove trusted clients, so that I can revoke previously granted automatic access.
Priority: Medium
Estimate: S
Status: Complete
Branch: feature/US-0004-settings-window
Dependencies: US-0003
Acceptance Criteria:
  - [x] AC-0015: Settings window lists all trusted client identifiers
  - [x] AC-0016: Individual clients can be removed via context menu or Delete key
  - [x] AC-0017: "Remove All" button with confirmation alert clears the entire trusted list
```

```
TASK-0004 (US-0004): Implement GeneralSettingsView with trusted client list management
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-0004-settings-window
Notes:
```

---

```
EPIC-0003: Connection Approval & Client Security
Description: Per-connection approval flow that gates new client access behind user consent, with a persistent trusted-client allowlist stored in AppStorage.
Release Target: MVP
Status: Complete
Dependencies: EPIC-0001
```

```
US-0005 (EPIC-0003): As a user, I want a dialog to appear when an unknown client connects, so that I can allow or deny access before any tools are called.
Priority: High
Estimate: M
Status: Complete
Branch: feature/US-0005-connection-approval
Dependencies: US-0001
Acceptance Criteria:
  - [x] AC-0018: An approval dialog appears for every client whose name is not in the trusted list
  - [x] AC-0019: The dialog shows the client name, Allow and Deny buttons, and an "Always trust" checkbox
  - [x] AC-0020: Approving with "Always trust" persists the client name to AppStorage so future connections skip the dialog
  - [x] AC-0021: Denying closes the connection immediately
  - [x] AC-0022: Concurrent connection attempts for the same client are queued and resolved together
```

```
TASK-0005 (US-0005): Implement ConnectionApprovalWindowController and approval queue in ServerController
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-0005-connection-approval
Notes:
```

```
US-0006 (EPIC-0003): As a user, I want to receive a notification when a client successfully connects to iCloudMCP, so that I am aware of active connections even when the menu is closed.
Priority: Low
Estimate: S
Status: Complete
Branch: feature/US-0006-connection-notification
Dependencies: US-0005
Acceptance Criteria:
  - [x] AC-0023: A UNUserNotification fires when a new client connection is established and approved
  - [x] AC-0024: Notification permission is requested on first server start
```

```
TASK-0006 (US-0006): Add UNUserNotificationCenter integration to ServerController connection handler
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-0006-connection-notification
Notes:
```

---

```
EPIC-0004: Claude Desktop Integration
Description: One-click setup that writes the icloudmcp-server entry into claude_desktop_config.json, using security-scoped bookmarks to maintain persistent write access.
Release Target: MVP
Status: Complete
Dependencies: EPIC-0001
```

```
US-0007 (EPIC-0004): As a user, I want to click a menu item to automatically configure Claude Desktop to use iCloudMCP, so that I do not need to manually edit JSON.
Priority: High
Estimate: M
Status: Complete
Branch: feature/US-0007-claude-desktop-integration
Dependencies: US-0003
Acceptance Criteria:
  - [x] AC-0025: "Configure Claude Desktop" shows an alert summarising the change before writing the config
  - [x] AC-0026: The icloudmcp-server entry is upserted into the mcpServers map without disturbing other entries
  - [x] AC-0027: The config is written using a security-scoped bookmark; an NSSavePanel fallback fires if no bookmark exists
  - [x] AC-0028: "Copy server command to clipboard" places the full icloudmcp-server path on the pasteboard
```

```
TASK-0007 (US-0007): Implement ClaudeDesktop enum with security-scoped config read/write
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-0007-claude-desktop-integration
Notes:
```

---

```
EPIC-0005: Calendar Service
Description: EventKit-backed tools for listing calendars, querying events with rich filters, and creating new events with alarms and recurrence.
Release Target: MVP
Status: Complete
Dependencies: EPIC-0001
```

```
US-0008 (EPIC-0005): As an AI assistant, I want to list calendars and fetch events with flexible filters, so that I can answer scheduling questions.
Priority: High
Estimate: M
Status: Complete
Branch: feature/US-0008-calendar-read
Dependencies: US-0001
Acceptance Criteria:
  - [x] AC-0029: calendars_list returns all EKCalendar entries with title, source, color, and edit/subscribe flags
  - [x] AC-0030: events_fetch accepts start/end date ranges with lenient ISO 8601 parsing (date-only and datetime)
  - [x] AC-0031: events_fetch supports filtering by calendar name, text query, all-day, status, availability, hasAlarms, and isRecurring
  - [x] AC-0032: Calendar permission is checked before each read; an error is thrown if access is not granted
```

```
TASK-0008 (US-0008): Implement CalendarService with calendars_list and events_fetch tools
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-0008-calendar-read
Notes:
```

```
US-0009 (EPIC-0005): As an AI assistant, I want to create calendar events with alarms and availability settings, so that I can help users schedule commitments.
Priority: High
Estimate: M
Status: Complete
Branch: feature/US-0009-calendar-write
Dependencies: US-0008
Acceptance Criteria:
  - [x] AC-0033: events_create supports title, start/end, calendar, location, notes, URL, isAllDay, and availability
  - [x] AC-0034: Alarms can be relative (minutes offset), absolute (datetime), or proximity-based (geo-fence enter/leave)
  - [x] AC-0035: All-day events are stored at local midnight with correct day boundaries
  - [x] AC-0036: The new event is persisted via EKEventStore and returned as the serialised Event value
```

```
TASK-0009 (US-0009): Implement events_create tool with alarm type polymorphism
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-0009-calendar-write
Notes:
```

---

```
EPIC-0006: Contacts Service
Description: CNContactStore-backed tools for reading personal contact info, searching contacts, and creating or updating contact records.
Release Target: MVP
Status: Complete
Dependencies: EPIC-0001
```

```
US-0010 (EPIC-0006): As an AI assistant, I want to look up the user's own contact card and search the address book, so that I can personalise responses and access contact details.
Priority: High
Estimate: M
Status: Complete
Branch: feature/US-0010-contacts-service
Dependencies: US-0001
Acceptance Criteria:
  - [x] AC-0037: contacts_me fetches the unified "me" card with name, phones, emails, addresses, birthday, and relations
  - [x] AC-0038: contacts_search accepts name, phone, and/or email predicates combined with AND logic
  - [x] AC-0039: contacts_create persists a new CNMutableContact with at minimum a given name
  - [x] AC-0040: contacts_update fetches the contact by identifier, applies partial field updates, and saves via CNSaveRequest
  - [x] AC-0041: All contact operations run on a utility Task to avoid blocking the main actor
```

```
TASK-0010 (US-0010): Implement ContactsService with me, search, create, update tools
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-0010-contacts-service
Notes:
```

---

```
EPIC-0007: Capture Service
Description: ScreenCaptureKit and AVFoundation tools for taking screenshots, photos, and audio recordings, exposed as base64-encoded image/audio content.
Release Target: MVP
Status: Complete
Dependencies: EPIC-0001
```

```
US-0011 (EPIC-0007): As an AI assistant, I want to capture screenshots, photos, and audio recordings from the user's device, so that I can analyse visual and audio content.
Priority: High
Estimate: L
Status: Complete
Branch: feature/US-0011-capture-service
Dependencies: US-0001
Acceptance Criteria:
  - [x] AC-0042: capture_take_screenshot captures a screen, window, or application and returns a base64-encoded PNG
  - [x] AC-0043: capture_take_picture captures a still image from the default camera
  - [x] AC-0044: capture_record_audio captures audio for a specified duration and returns base64-encoded audio data
  - [x] AC-0045: Screen recording permission is requested via ScreenCaptureKit; camera/microphone permissions via AVFoundation
```

```
TASK-0011 (US-0011): Implement CaptureService with ScreenCaptureKit and AVFoundation backends
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-0011-capture-service
Notes:
```

---

```
EPIC-0008: Location & Maps Services
Description: CoreLocation tools for device position and geocoding, plus MapKit tools for place search, directions, ETA, exploration, and static map generation.
Release Target: MVP
Status: Complete
Dependencies: EPIC-0001
```

```
US-0012 (EPIC-0008): As an AI assistant, I want to get the device's current location and convert between addresses and coordinates, so that I can answer location-aware questions.
Priority: High
Estimate: S
Status: Complete
Branch: feature/US-0012-location-service
Dependencies: US-0001
Acceptance Criteria:
  - [x] AC-0046: location_current returns latitude, longitude, and accuracy after requesting When-In-Use authorisation
  - [x] AC-0047: location_geocode converts a free-text address string to one or more coordinate results
  - [x] AC-0048: location_reverse-geocode converts coordinates to a human-readable placemark
```

```
TASK-0012 (US-0012): Implement LocationService with CLLocationManager and CLGeocoder
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-0012-location-service
Notes:
```

```
US-0013 (EPIC-0008): As an AI assistant, I want to search for places, get turn-by-turn directions, estimate travel time, and generate static map images, so that I can assist with navigation and exploration.
Priority: High
Estimate: L
Status: Complete
Branch: feature/US-0013-maps-service
Dependencies: US-0012
Acceptance Criteria:
  - [x] AC-0049: maps_search returns ranked place results from MKLocalSearch for a given query and optional region
  - [x] AC-0050: maps_directions returns step-by-step route instructions for driving, walking, or transit
  - [x] AC-0051: maps_explore uses MKLocalSearchCompleter to return typeahead suggestions for a partial query
  - [x] AC-0052: maps_eta returns estimated travel time between two points for the requested transport type
  - [x] AC-0053: maps_generate returns a base64-encoded PNG static map for given coordinates, span, and options
```

```
TASK-0013 (US-0013): Implement MapsService with MKLocalSearch, MKDirections, and MKMapSnapshotter
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-0013-maps-service
Notes:
```

---

```
EPIC-0009: Messages Service
Description: Read-only access to the Messages app conversation history via direct SQLite access to chat.db, using a sandbox exception and security-scoped bookmark for persistent access.
Release Target: MVP
Status: Complete
Dependencies: EPIC-0001
```

```
US-0014 (EPIC-0009): As an AI assistant, I want to search Messages conversation history by participant, date range, and content, so that I can answer questions about past conversations.
Priority: High
Estimate: M
Status: Complete
Branch: feature/US-0014-messages-service
Dependencies: US-0001
Acceptance Criteria:
  - [x] AC-0054: messages_fetch filters by participant handles (E.164 phone or email), date range, text query, and limit
  - [x] AC-0055: The service first attempts direct access to the default chat.db path; falls back to a stored bookmark
  - [x] AC-0056: If neither path works, an alert and NSOpenPanel guide the user to select the database file manually
  - [x] AC-0057: A security-scoped bookmark is stored in UserDefaults after manual selection for future launches
```

```
TASK-0014 (US-0014): Implement MessageService with SQLite3 direct access and security-scoped bookmark flow
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-0014-messages-service
Notes:
```

---

```
EPIC-0010: Reminders & Shortcuts Services
Description: EventKit-backed reminders tools and an Shortcuts-runner for listing and executing user automations.
Release Target: MVP
Status: Complete
Dependencies: EPIC-0001
```

```
US-0015 (EPIC-0010): As an AI assistant, I want to list reminder lists and fetch or create reminders, so that I can help users manage tasks.
Priority: Medium
Estimate: S
Status: Complete
Branch: feature/US-0015-reminders-service
Dependencies: US-0001
Acceptance Criteria:
  - [x] AC-0058: reminders_lists returns all EKCalendar reminder lists with title and colour
  - [x] AC-0059: reminders_fetch returns incomplete or completed reminders filtered by list and date range
  - [x] AC-0060: reminders_create saves a new EKReminder with title, due date, notes, and optional priority
  - [x] AC-0061: Reminders permission (fullAccessToReminders) is requested on activate
```

```
TASK-0015 (US-0015): Implement RemindersService with lists, fetch, and create tools
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-0015-reminders-service
Notes:
```

```
US-0016 (EPIC-0010): As an AI assistant, I want to list and run Shortcuts automations, so that I can trigger complex user-defined workflows.
Priority: Medium
Estimate: S
Status: Complete
Branch: feature/US-0016-shortcuts-service
Dependencies: US-0001
Acceptance Criteria:
  - [x] AC-0062: shortcuts_list returns the names of available Shortcuts automations
  - [x] AC-0063: shortcuts_run executes a named Shortcut and returns its output
```

```
TASK-0016 (US-0016): Implement ShortcutsService with list and run tools
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-0016-shortcuts-service
Notes:
```

---

```
EPIC-0011: Weather & Utilities Services
Description: WeatherKit-backed weather forecast tools (conditionally compiled) and a minimal utilities service for system sounds.
Release Target: MVP
Status: Complete
Dependencies: EPIC-0001
```

```
US-0017 (EPIC-0011): As an AI assistant, I want to retrieve current conditions and multi-day/hourly/minute-by-minute forecasts, so that I can answer weather questions.
Priority: Medium
Estimate: M
Status: Complete
Branch: feature/US-0017-weather-service
Dependencies: US-0001
Acceptance Criteria:
  - [x] AC-0064: weather_current returns conditions, temperature, humidity, wind, UV index, and visibility
  - [x] AC-0065: weather_daily returns a multi-day forecast with high/low temps and precipitation probability
  - [x] AC-0066: weather_hourly returns an hour-by-hour breakdown for the requested period
  - [x] AC-0067: weather_minute returns minute-by-minute precipitation data for the next hour
```

```
TASK-0017 (US-0017): Implement WeatherService using WeatherKit behind WEATHERKIT_AVAILABLE flag
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-0017-weather-service
Notes:
```

```
US-0018 (EPIC-0011): As an AI assistant, I want to play a system sound, so that I can give the user an audible notification.
Priority: Low
Estimate: S
Status: Complete
Branch: feature/US-0018-utilities-service
Dependencies: US-0001
Acceptance Criteria:
  - [x] AC-0068: utilities_beep plays a named NSSound from the system sound library
  - [x] AC-0069: An enum of valid sound names is exposed in the tool input schema
```

```
TASK-0018 (US-0018): Implement UtilitiesService with utilities_beep tool
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-0018-utilities-service
Notes:
```

---

```
EPIC-0012: iCloudMCP Fork & Rebranding
Description: Fork the upstream iMCP project, rename all artefacts to iCloudMCP, update bundle identifiers and ownership references, and set up the PlanVisualizer toolchain for this repo.
Release Target: MVP
Status: Complete
Dependencies: None
```

```
US-0019 (EPIC-0012): As the project owner, I want all iMCP references renamed to iCloudMCP throughout the codebase, so that the fork has a distinct identity and does not conflict with the upstream app.
Priority: High
Estimate: S
Status: Complete
Branch: main
Dependencies: None
Acceptance Criteria:
  - [x] AC-0070: All user-visible strings (menu bar title, About window, dialogs) read "iCloudMCP"
  - [x] AC-0071: Bundle identifiers updated to ksyed0.iCloudMCP and ksyed0.icloudmcp-server
  - [x] AC-0072: UserDefaults keys updated to ksyed0.iCloudMCP.* prefix
  - [x] AC-0073: Xcode project and scheme renamed from iMCP.xcodeproj to iCloudMCP.xcodeproj
  - [x] AC-0074: CLI binary target renamed from imcp-server to icloudmcp-server
```

```
TASK-0019 (US-0019): Run sed replacements across Swift sources, pbxproj, xcscheme, and README
Type: Dev
Assignee: Agent
Status: Done
Branch: main
Notes:
```

```
US-0020 (EPIC-0012): As the project team, I want PlanVisualizer installed and configured, so that we have automated dashboard tracking for costs, stories, and bugs.
Priority: Medium
Estimate: S
Status: Complete
Branch: main
Dependencies: US-0019
Acceptance Criteria:
  - [x] AC-0075: plan-visualizer.config.json references project name iCloudMCP and repo ksyed0/iCloudMCP
  - [x] AC-0076: npm run plan:test passes all 757 tests
  - [x] AC-0077: .claude/settings.json includes the capture-cost.js Stop hook
  - [x] AC-0078: AGENTS.md references plan_visualizer.md for document format requirements
```

```
TASK-0020 (US-0020): Install PlanVisualizer, create config, and merge CLAUDE.md
Type: Infra
Assignee: Agent
Status: Done
Branch: main
Notes:
```

---

```
EPIC-0013: CI/CD Pipeline & Developer Tooling
Description: Full CI pipeline enforcing lint, test coverage, Swift build, commit message format, and PR hygiene. Includes automated release workflow, branch protection with code-owner gating, Dependabot, and GitHub secret scanning.
Release Target: MVP
Status: Complete
Dependencies: EPIC-0012
```

```
US-0021 (EPIC-0013): As a developer, I want automated lint and test checks to run on every PR, so that regressions and style violations are caught before code reaches develop or main.
Priority: High
Estimate: M
Status: Complete
Branch: feature/US-0021-ci-pipeline
Dependencies: US-0020
Acceptance Criteria:
  - [x] AC-0079: ESLint runs on all PRs to main and develop; merge is blocked on lint errors
  - [x] AC-0080: Jest runs with --coverage; merge blocked if lines, functions, or statements fall below 80%
  - [x] AC-0081: SwiftLint strict runs against App/ and CLI/ Swift sources
  - [x] AC-0082: Xcode Debug build is verified on a macOS-15 runner on every PR
  - [x] AC-0083: All four checks are required status checks on both main and develop
```

```
TASK-0021 (US-0021): Create .github/workflows/ci.yml with ESLint, Jest coverage, SwiftLint, and Xcode build jobs
Type: Infra
Assignee: Agent
Status: Done
Branch: feature/US-0021-ci-pipeline
Notes:
```

```
US-0022 (EPIC-0013): As the project owner, I want branch protection rules and CODEOWNERS so that only I can approve PRs and no one can push directly to main or develop.
Priority: High
Estimate: S
Status: Complete
Branch: feature/US-0022-branch-protection
Dependencies: US-0021
Acceptance Criteria:
  - [x] AC-0084: main and develop both require at least one approved PR before merge
  - [x] AC-0085: .github/CODEOWNERS assigns * @ksyed0; require_code_owner_reviews is true on both branches
  - [x] AC-0086: Stale reviews are dismissed when new commits are pushed to an open PR
  - [x] AC-0087: Force push and branch deletion are disabled on both protected branches
  - [x] AC-0088: enforce_admins is false, giving the owner an override path
```

```
TASK-0022 (US-0022): Create .github/CODEOWNERS and update branch protection via GitHub API
Type: Infra
Assignee: Agent
Status: Done
Branch: feature/US-0022-branch-protection
Notes:
```

```
US-0023 (EPIC-0013): As a release engineer, I want a tag-triggered workflow that builds, notarizes, and publishes a draft GitHub Release, so that releases are reproducible and do not require a manual Xcode export.
Priority: Medium
Estimate: M
Status: Complete
Branch: feature/US-0023-release-workflow
Dependencies: US-0021
Acceptance Criteria:
  - [x] AC-0089: Workflow triggers on v* semver tags pushed to any branch
  - [x] AC-0090: Developer ID signing certificate is imported from APPLE_CERTIFICATE secret into an ephemeral keychain, cleaned up in an always() step
  - [x] AC-0091: Scripts/release.sh runs the archive, notarize, and export phases
  - [x] AC-0092: A draft GitHub Release is created with the notarized .zip; draft status requires owner to publish
```

```
TASK-0023 (US-0023): Create .github/workflows/release.yml with code signing, notarization, and gh release create
Type: Infra
Assignee: Agent
Status: Done
Branch: feature/US-0023-release-workflow
Notes: Requires 7 secrets to be configured in repo Settings → Secrets → Actions before first use
```

```
US-0024 (EPIC-0013): As a developer, I want commit message linting, PR size warnings, Dependabot, and secret scanning so that code hygiene and supply-chain security are enforced automatically.
Priority: Medium
Estimate: S
Status: Complete
Branch: feature/US-0024-repo-hygiene
Dependencies: US-0021
Acceptance Criteria:
  - [x] AC-0093: commitlint enforces conventional commit format (feat/fix/chore/docs/refactor/perf/style/test/ci/build/revert) on all PR commits
  - [x] AC-0094: PR size check posts a sticky warning comment at >500 changed lines; hard-fails the check at >1500 lines
  - [x] AC-0095: Dependabot runs weekly for npm and Swift PM packages, targeting develop
```

```
TASK-0024 (US-0024): Add commitlint.config.js, pr-size.yml, dependabot.yml, and enable security scanning via API
Type: Infra
Assignee: Agent
Status: Done
Branch: feature/US-0024-repo-hygiene
Notes:
```
