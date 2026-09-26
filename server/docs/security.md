# WORKING DRAFT for the team. The final report must be written by the team.

# Security Posture

## Implemented Measures

| Measure | Implementation File | Description |
|---|---|---|
| **HttpOnly Cookies** | `authController.js` | JWTs are stored in HttpOnly, SameSite cookies (with Secure flag in production) protecting against XSS token theft. |
| **NoSQL Injection Protection** | `server.js` | Express-mongo-sanitize middleware recursively strips payload keys starting with `$` or `.` |
| **Global Rate Limiting** | `rateLimiter.js` | Prevents basic DoS (100 req / 15 mins). |
| **Auth Rate Limiting** | `rateLimiter.js` | Strict limit (10 req / 15 mins) on login/register to prevent brute force. |
| **Role Escalation Protection** | `authController.js` | Destructuring explicitly ignores the `role` field on registration payloads. |
| **Admin Route Isolation** | `auth.js` | `requireAdmin` middleware checks JWT roles before permitting access. |
| **Resource Ownership Verification** | `budgetService.js`, `transactionTemplateService.js` | Backend ensures categories, budgets, and templates belong to the invoking user before permitting CRUD. |
| **JWT Secret Guardian** | `server.js` | Hard-fails and crashes server on startup if `JWT_SECRET` is missing. |
| **Zod Schema Validation** | `validate.js` | Strictly sanitizes types, throwing 400 Bad Request if incorrect payloads/ObjectIds are supplied. |
| **Disabled User Check** | `auth.js`, `authController.js` | `protect` middleware rejects requests from disabled accounts instantly, even with valid cookies. |

## Remaining Security Gaps (Honest Assessment)
1. **CSRF Protection**: No explicit Anti-CSRF tokens exist yet (though SameSite cookies mitigate this mostly).
2. **Device Fingerprinting**: Token theft via network snooping (if HTTPS is stripped) isn't caught since the token isn't tied to an IP/Device hash.
3. **Password History**: No check to prevent a user from reusing the same compromised password repeatedly.
