# WORKING DRAFT for the team. The final report must be written by the team.

# Consistency Check

This document tracks known inconsistencies between the documentation, the code, and the original SRS.

| Entity/Feature | Conflict Description | Resolution / Status |
|---|---|---|
| **Users / Profile** | The original SRS loosely mentioned `/users/me`, but the actual codebase routes use `/api/users/profile`. | Documentation has been updated to reflect the true `/api/users/profile` path. |
| **Transaction Templates vs Bookmarks** | The codebase contains both a `Bookmark` schema and a `TransactionTemplate` schema with identical shapes. | `TransactionTemplate` is the active modern implementation. `Bookmark` is preserved to prevent breaking legacy SRS requirements but is redundant. |
| **AI Endpoints** | Previous drafts mentioned `/ai/tips` but the exact routes are `/api/ai/saving-tips`, `/api/ai/saving-tips/:id/pin`, and `/api/ai/saving-tips/:id/dismiss`. | Fixed in current `api-reference.md`. |
| **Rate Limit Limits** | `api-reference.md` lists `authLimiter` vs `apiLimiter`, but `server.js` applies `apiLimiter` globally to `/api`. | This means Auth routes get double-dipped by both limiters, which is safe but slightly redundant. |
| **Validators** | 48 endpoints do not have explicitly mounted Zod validators. | Most of these are `GET` endpoints or endpoints taking only URL parameters (which are implicitly guarded by Mongoose CastError or custom param checking), or Admin actions without body payloads. |
