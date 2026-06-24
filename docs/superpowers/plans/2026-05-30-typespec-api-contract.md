# TypeSpec API Contract For "Запись На Звонок"

## Summary

Create a Design First API contract for a small Cal.com-like booking app. The repository will get a TypeSpec setup that emits OpenAPI and defines the shared client/server boundary before frontend or backend implementation starts.

Chosen defaults:

- Availability is fixed in v1: owner is available every day from `09:00` to `18:00`.
- Event type `durationMinutes` is real booking duration.
- Slot start times are generated every 30 minutes.
- Time is exchanged as UTC ISO datetimes; owner profile includes an IANA timezone for local display and slot generation.
- Booking conflicts are detected by interval overlap, not only equal start time.

## Key API Changes

Define these domain models in TypeSpec:

- `Owner`: `id`, `name`, `title`, `timezone`.
- `EventType`: `id`, `title`, `description`, `durationMinutes`.
- `Slot`: `startAt`, `endAt`, `available`, optional `bookingId`.
- `Booking`: `id`, `eventTypeId`, guest name/email/notes, `startAt`, `endAt`, `createdAt`.
- `ErrorResponse`: stable `code`, `message`, optional `details`.

Define these endpoints:

- `GET /owner` returns the single predefined owner profile.
- `GET /event-types` returns public event types for guests.
- `POST /event-types` creates an event type for the owner/admin scenario.
- `GET /event-types/{eventTypeId}` returns one event type or `404`.
- `GET /event-types/{eventTypeId}/slots?from=...&to=...` returns available and occupied slots within the next 14-day booking window.
- `POST /bookings` creates a guest booking for a selected slot.
- `GET /bookings/upcoming` returns all upcoming bookings across event types for the owner/admin scenario.

Response rules:

- Successful booking creation returns `201` with `Booking`.
- Invalid input returns `400`.
- Missing event type returns `404`.
- Slot outside the 14-day window returns `400`.
- Slot already occupied or overlapping another booking returns `409`.

## Implementation Changes

Add a minimal TypeSpec project:

- `package.json` with TypeSpec CLI and OpenAPI emitter dev dependencies.
- `tspconfig.yaml` configured to emit OpenAPI 3.
- `main.tsp` containing service metadata, models, errors, routes, status-code unions, and validation decorators where TypeSpec supports them cleanly.
- Optional generated artifact path such as `generated/openapi/openapi.yaml`, produced by `npx tsp compile .`.

Keep the contract independent of frontend/backend stack. Do not add application runtime code in this step.

## Test Plan

Verify the contract with:

- `npm install`
- `npx tsp compile .`
- Confirm OpenAPI output is generated without diagnostics.
- Inspect generated OpenAPI for required paths:
  - `/owner`
  - `/event-types`
  - `/event-types/{eventTypeId}`
  - `/event-types/{eventTypeId}/slots`
  - `/bookings`
  - `/bookings/upcoming`
- Confirm error responses include `400`, `404`, and `409` where specified.
- Confirm booking and slot schemas expose UTC datetime fields as OpenAPI date-time strings.

## Assumptions

- No auth, tokens, sessions, users, or external calendar integrations.
- The owner is a single predefined profile, not managed through CRUD in v1.
- Admin endpoints are unauthenticated because the project intentionally has no authorization.
- Default owner timezone should be fixed in seed/runtime data, while the API contract only requires it to be a string IANA timezone.
- The 14-day booking window is enforced by backend behavior and documented in TypeSpec operation docs/errors.
