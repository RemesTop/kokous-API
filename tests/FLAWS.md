# Flaw Analysis Report

The following flaws and architectural issues were identified in the Meeting Room Booking API.

## 1. Functional Flaws

### 1.1 Idempotency Violation in Delete Operation
*   **Severity:** Medium
*   **Description:** The technical specification requires the DELETE operation to be idempotent ("jos varaus on jo poistettu, järjestelmä reagoi johdonmukaisesti ilman virhetilaa").
*   **Current Behavior:** Deleting an already deleted booking returns `404 Not Found`.
*   **Expected Behavior:** It should return `204 No Content` (or `200 OK`) to indicate the resource is gone, as requested.

### 1.2 Missing Validation for User Name
*   **Severity:** Low
*   **Description:** The Zod schema `z.string()` allows empty strings.
*   **Current Behavior:** A booking can be created with `user: ""`.
*   **Recommendation:** Update schema to `z.string().min(1)`.

## 2. Architectural & Best Practice Issues

### 2.1 Missing Foreign Key Enforcement
*   **Severity:** High (Database Integrity)
*   **Description:** SQLite does not enable Foreign Key constraints by default. The application currently initializes the database without executing `PRAGMA foreign_keys = ON;`.
*   **Risk:** While the Service layer checks for room existence, any direct database operation or potential race condition could lead to "orphaned" bookings pointing to non-existent rooms.

### 2.2 Concurrency / Race Condition Risk
*   **Severity:** High (Scalability/Robustness)
*   **Description:** The application uses a "Check-then-Act" pattern in `BookingsService` (`findOverlapping` then `create`) without wrapping these operations in a Database Transaction.
*   **Risk:** Although `better-sqlite3` is synchronous (mitigating this in a single-threaded Node process), this design pattern is fundamentally broken for concurrent systems. If the application were ever scaled to multiple processes or if the DB driver were asynchronous, this would allow Double Bookings.
*   **Recommendation:** Wrap the check and insert in `db.transaction()`.

### 2.3 Fragile Error Handling
*   **Severity:** Medium (Maintainability)
*   **Description:** The Controller relies on string matching (e.g., `error.message.includes('not found')`) to determine HTTP status codes.
*   **Risk:** If a developer changes the error message in the Service (e.g., correcting a typo), the API will start returning `500 Internal Server Error` instead of `404` or `409`.
*   **Recommendation:** Use custom Error classes (e.g., `NotFoundError`, `ConflictError`) or checking instance types.

### 2.4 Time Synchronization
*   **Severity:** Low
*   **Description:** Client-provided `startTime` is compared against `new Date()` (server time) for past checks.
*   **Risk:** If the server's clock drifts or if the client is essentially "now", network latency or clock skew might cause valid "now" bookings to be rejected as "past".
