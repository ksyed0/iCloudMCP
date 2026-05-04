# SOP: Service Layer

**Layer:** Architecture (Layer 1)
**Owner:** `App/Services/`, `App/Models/Service.swift`
**Golden Rule:** Update this SOP before adding a new service or changing how tools are declared.

---

## Goal

Expose macOS system capabilities as discrete MCP tools, each gated behind an explicit
user permission that must be granted before any tool in that service is callable.

---

## Service Protocol

```swift
@preconcurrency
protocol Service {
    @ToolBuilder var tools: [Tool] { get }
    var isActivated: Bool { get async }   // true = permission granted
    func activate() async throws          // request permission from the user
}
```

Every service must:
1. Implement `isActivated` by checking the relevant system permission status
2. Implement `activate()` by calling the system API that presents the permission dialog
3. Declare all tools as `Tool` values in the `tools` computed property using `@ToolBuilder`

---

## Tool Declaration Pattern

```swift
Tool(
    name: "service_action",
    description: "One-sentence description for the AI client",
    inputSchema: .object(properties: [...], additionalProperties: false),
    annotations: .init(title: "Human Title", readOnlyHint: true, openWorldHint: false)
) { arguments in
    guard permissionGranted else { throw PermissionError() }
    // ... implementation
    return EncodableValue()   // serialised via Ontology to JSON-LD
}
```

**Naming convention:** `{service}_{verb}` — e.g. `calendar_events_fetch`, `contacts_search`

---

## Service Registry

`ServerController.ServiceRegistry.services` holds the ordered list of all active services.
Weather is conditionally included (`#if WEATHERKIT_AVAILABLE`).

Tool routing in `ServerController`:
```
CallTool(name: "maps_search") → iterate ServiceRegistry.services
    → for each service: call service.call(tool: name, with: arguments)
    → first non-nil return wins
```

---

## Permission Models

| Service | Framework | Permission |
|---|---|---|
| Calendar | EventKit | `EKEventStore.requestFullAccessToEvents()` |
| Contacts | Contacts | `CNContactStore.requestAccess(for: .contacts)` |
| Capture | ScreenCaptureKit / AVFoundation | Screen recording + camera + microphone |
| Location | CoreLocation | `requestWhenInUseAuthorization()` |
| Maps | MapKit | No permission required (uses device location indirectly) |
| Messages | SQLite direct | Sandbox exception + `NSOpenPanel` bookmark |
| Reminders | EventKit | `requestFullAccessToReminders()` |
| Shortcuts | Shortcuts framework | No special permission |
| Weather | WeatherKit | `com.apple.developer.weatherkit` entitlement |
| Utilities | NSSound | No permission required |

---

## Adding a New Service

1. Create `App/Services/NewService.swift` implementing `Service`
2. Add the singleton to `ServiceRegistry.services` in `ServerController.swift`
3. Add a toggle binding in `ServiceRegistry.configureServices(...)`
4. Add entitlement in `App.entitlements` if required
5. Add usage description string in `project.pbxproj` (`INFOPLIST_KEY_NS*UsageDescription`)
6. Create an EPIC + US in `docs/RELEASE_PLAN.md` and update `docs/ID_REGISTRY.md`
