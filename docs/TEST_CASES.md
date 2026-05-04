# Test Cases — iCloudMCP

Manual test cases for verifying MCP tool behaviour. PlanVisualizer has no automated
Xcode test runner — these are executed manually against a running iCloudMCP.app build.
Run via MCP Inspector (`npx @modelcontextprotocol/inspector`) or Claude Desktop.

---

TC-0001: calendars_list returns at least one calendar
Related Story: US-0008
Related Task: TASK-0008
Related AC: AC-0029
Type: Functional
Status: [ ] Not Run
Defect Raised: None

TC-0002: events_fetch with no arguments returns events for the next 7 days
Related Story: US-0008
Related Task: TASK-0008
Related AC: AC-0030
Type: Functional
Status: [ ] Not Run
Defect Raised: None

TC-0003: events_fetch filters correctly by calendar name
Related Story: US-0008
Related Task: TASK-0008
Related AC: AC-0031
Type: Functional
Status: [ ] Not Run
Defect Raised: None

TC-0004: events_create with relative alarm saves and returns the new event
Related Story: US-0009
Related Task: TASK-0009
Related AC: AC-0034
Type: Functional
Status: [ ] Not Run
Defect Raised: None

TC-0005: contacts_me returns the user's own card
Related Story: US-0010
Related Task: TASK-0010
Related AC: AC-0037
Type: Functional
Status: [ ] Not Run
Defect Raised: None

TC-0006: contacts_search by name returns matching results
Related Story: US-0010
Related Task: TASK-0010
Related AC: AC-0038
Type: Functional
Status: [ ] Not Run
Defect Raised: None

TC-0007: capture_take_screenshot returns a non-empty base64 PNG string
Related Story: US-0011
Related Task: TASK-0011
Related AC: AC-0042
Type: Functional
Status: [ ] Not Run
Defect Raised: None

TC-0008: location_current returns latitude and longitude within expected range
Related Story: US-0012
Related Task: TASK-0012
Related AC: AC-0046
Type: Functional
Status: [ ] Not Run
Defect Raised: None

TC-0009: maps_search returns results for a known landmark
Related Story: US-0013
Related Task: TASK-0013
Related AC: AC-0049
Type: Functional
Status: [ ] Not Run
Defect Raised: None

TC-0010: messages_fetch returns messages from a known participant
Related Story: US-0014
Related Task: TASK-0014
Related AC: AC-0054
Type: Functional
Status: [ ] Not Run
Defect Raised: None

TC-0011: Disabling iCloudMCP returns error on tool call rather than hanging
Related Story: US-0003
Related Task: TASK-0003
Related AC: AC-0004
Type: Functional
Status: [ ] Not Run
Defect Raised: None

TC-0012: Unknown client triggers approval dialog
Related Story: US-0005
Related Task: TASK-0005
Related AC: AC-0018
Type: Functional
Status: [ ] Not Run
Defect Raised: None

TC-0013: Trusted client reconnects without approval dialog
Related Story: US-0005
Related Task: TASK-0005
Related AC: AC-0020
Type: Functional
Status: [ ] Not Run
Defect Raised: None

TC-0014: Configure Claude Desktop writes iCloudMCP entry without disturbing other entries
Related Story: US-0007
Related Task: TASK-0007
Related AC: AC-0026
Type: Functional
Status: [ ] Not Run
Defect Raised: None

TC-0015: CLI exits cleanly when app is not running (30s timeout)
Related Story: US-0002
Related Task: TASK-0002
Related AC: AC-0006
Type: Negative
Status: [ ] Not Run
Defect Raised: None
