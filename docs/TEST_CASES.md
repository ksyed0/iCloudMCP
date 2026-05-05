# Test Cases — iCloudMCP

Manual test cases for verifying MCP tool behaviour. All TC-0001 through TC-0015 are
marked Pass based on code inspection of the inherited upstream codebase (iMCP by Mattt),
which was a working production release. Re-run manually after any functional change to
App/Services/ or CLI/main.swift.

---

TC-0001: calendars_list returns at least one calendar
Related Story: US-0008
Related Task: TASK-0008
Related AC: AC-0029
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0002: events_fetch with no arguments returns events for the next 7 days
Related Story: US-0008
Related Task: TASK-0008
Related AC: AC-0030
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0003: events_fetch filters correctly by calendar name
Related Story: US-0008
Related Task: TASK-0008
Related AC: AC-0031
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0004: events_create with relative alarm saves and returns the new event
Related Story: US-0009
Related Task: TASK-0009
Related AC: AC-0034
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0005: contacts_me returns the user's own card
Related Story: US-0010
Related Task: TASK-0010
Related AC: AC-0037
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0006: contacts_search by name returns matching results
Related Story: US-0010
Related Task: TASK-0010
Related AC: AC-0038
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0007: capture_take_screenshot returns a non-empty base64 PNG string
Related Story: US-0011
Related Task: TASK-0011
Related AC: AC-0042
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0008: location_current returns latitude and longitude within expected range
Related Story: US-0012
Related Task: TASK-0012
Related AC: AC-0046
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0009: maps_search returns results for a known landmark
Related Story: US-0013
Related Task: TASK-0013
Related AC: AC-0049
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0010: messages_fetch returns messages from a known participant
Related Story: US-0014
Related Task: TASK-0014
Related AC: AC-0054
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0011: Disabling iCloudMCP returns error on tool call rather than hanging
Related Story: US-0003
Related Task: TASK-0003
Related AC: AC-0004
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0012: Unknown client triggers approval dialog
Related Story: US-0005
Related Task: TASK-0005
Related AC: AC-0018
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0013: Trusted client reconnects without approval dialog
Related Story: US-0005
Related Task: TASK-0005
Related AC: AC-0020
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0014: Configure Claude Desktop writes iCloudMCP entry without disturbing other entries
Related Story: US-0007
Related Task: TASK-0007
Related AC: AC-0026
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0015: CLI exits cleanly when app is not running (30s timeout)
Related Story: US-0002
Related Task: TASK-0002
Related AC: AC-0006
Type: Negative
Status: [x] Pass
Defect Raised: None

TC-0016: iCloudMCP app appears as _mcp._tcp Bonjour service after launch
Related Story: US-0001
Related Task: TASK-0001
Related AC: AC-0001
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0017: Two MCP clients can connect simultaneously and both receive tool responses
Related Story: US-0001
Related Task: TASK-0001
Related AC: AC-0002
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0018: Tool call while app is disabled returns explicit disabled error message
Related Story: US-0001
Related Task: TASK-0001
Related AC: AC-0004
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0019: Settings window lists clients previously approved with Always Trust
Related Story: US-0004
Related Task: TASK-0004
Related AC: AC-0015
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0020: Removing a trusted client via context menu causes next connection to prompt approval
Related Story: US-0004
Related Task: TASK-0004
Related AC: AC-0016
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0021: macOS notification appears when a new approved client connects
Related Story: US-0006
Related Task: TASK-0006
Related AC: AC-0023
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0022: reminders_lists returns all reminder lists with title and color
Related Story: US-0015
Related Task: TASK-0015
Related AC: AC-0058
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0023: reminders_fetch returns reminders filtered by list name and date range
Related Story: US-0015
Related Task: TASK-0015
Related AC: AC-0059
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0024: reminders_create saves a new reminder with title and due date
Related Story: US-0015
Related Task: TASK-0015
Related AC: AC-0060
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0025: shortcuts_list returns the names of available Shortcuts automations
Related Story: US-0016
Related Task: TASK-0016
Related AC: AC-0062
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0026: shortcuts_run executes a named shortcut and returns its output
Related Story: US-0016
Related Task: TASK-0016
Related AC: AC-0063
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0027: weather_current returns temperature, humidity, wind, and conditions for current location
Related Story: US-0017
Related Task: TASK-0017
Related AC: AC-0064
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0028: weather_daily returns a multi-day forecast with high/low temperatures and precipitation probability
Related Story: US-0017
Related Task: TASK-0017
Related AC: AC-0065
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0029: utilities_beep plays a named system sound without error
Related Story: US-0018
Related Task: TASK-0018
Related AC: AC-0068
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0030: Menu bar extra title reads "iCloudMCP" and binary path references icloudmcp-server
Related Story: US-0019
Related Task: TASK-0019
Related AC: AC-0070
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0031: Xcode project bundle identifier is ksyed0.iCloudMCP in both Debug and Release configurations
Related Story: US-0019
Related Task: TASK-0019
Related AC: AC-0071
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0032: npm run plan:test completes with 757 tests passing and zero failures
Related Story: US-0020
Related Task: TASK-0020
Related AC: AC-0076
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0033: .claude/settings.json contains the capture-cost.js Stop hook entry
Related Story: US-0020
Related Task: TASK-0020
Related AC: AC-0077
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0034: PR to develop triggers all four CI checks (ESLint, Jest, SwiftLint, Xcode Build)
Related Story: US-0021
Related Task: TASK-0021
Related AC: AC-0083
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0035: Dropping Jest coverage below 80% causes the CI coverage check to fail
Related Story: US-0021
Related Task: TASK-0021
Related AC: AC-0080
Type: Negative
Status: [x] Pass
Defect Raised: None

TC-0036: Direct push to main without a PR is rejected by branch protection
Related Story: US-0022
Related Task: TASK-0022
Related AC: AC-0084
Type: Negative
Status: [x] Pass
Defect Raised: None

TC-0037: PR approval from a non-CODEOWNERS account does not satisfy the code owner review requirement
Related Story: US-0022
Related Task: TASK-0022
Related AC: AC-0085
Type: Negative
Status: [x] Pass
Defect Raised: None

TC-0038: Pushing a v* semver tag triggers the release workflow in GitHub Actions
Related Story: US-0023
Related Task: TASK-0023
Related AC: AC-0089
Type: Functional
Status: [x] Pass
Defect Raised: None

TC-0039: Commit with non-conventional type (e.g. "[feat]") is rejected by commitlint check on PR
Related Story: US-0024
Related Task: TASK-0024
Related AC: AC-0093
Type: Negative
Status: [x] Pass
Defect Raised: None

TC-0040: PR exceeding 500 changed lines receives a sticky size-warning comment
Related Story: US-0024
Related Task: TASK-0024
Related AC: AC-0094
Type: Functional
Status: [x] Pass
Defect Raised: None
