# 06 — Security

## Implemented Security Measures

| Measure | Where Implemented | Detail |
|---|---|---|
| **HTTP Security Headers** | `server.js` → `helmet()` | Adds Content-Security-Policy, HSTS, X-Frame-Options, X-Content-Type-Options and others on every response |
| **CORS with credentials** | `server.js` → `cors({ origin: CLIENT_URL, credentials: true })` | Only the configured `CLIENT_URL` origin may send credentialed (cookie) requests; all other origins are blocked |
| **httpOnly JWT Cookie** | `services/authService.js` | JWT is stored in an `httpOnly`, `sameSite`, `secure` cookie — JavaScript on the client cannot read it |
| **JWT Verification** | `middleware/auth.js` → `requireAuth` | Every protected route verifies the cookie with `jwt.verify(token, JWT_SECRET)` before proceeding |
| **Role-Based Access Control** | `routes/adminRoutes.js` → `requireAdmin` inline middleware | All admin endpoints check `req.user.role === 'admin'` after `requireAuth`. Students cannot reach admin routes |
| **Admin/Student Data Isolation** | `services/adminService.js` | Admin stats use platform-wide aggregations only. `getUsers()` explicitly omits `passwordHash` and never fetches transactions |
| **Password Hashing** | `utils/crypto.js`, `services/authService.js`, `services/adminService.js` | `bcrypt.hash(password, 10)` — salted hashes; plaintext passwords are never stored or logged |
| **Sensitive Field Exclusion — select: false** | `models/User.js` | `passwordHash`, `resetTokenHash`, `resetTokenExpires` have `select: false` — not returned from any `.find()` unless `.select('+passwordHash')` is used explicitly |
| **Sensitive Field Exclusion — toJSON transform** | `models/User.js` | A `toJSON` transform deletes `passwordHash`, `resetTokenHash`, `resetTokenExpires`, and `__v` from every serialised user document — second safety net |
| **Explicit hash unset after login** | `services/authService.js` | After comparing the password, `delete user.passwordHash` is called before returning the user object |
| **Temp password — plain returned once, hash stored** | `services/adminService.js` → `resetStudentPassword` | Admin password reset generates a random 12-char password, immediately hashes it with bcrypt, stores only the hash, and returns the plaintext exactly once |
| **NoSQL Injection Prevention** | `server.js` → `express-mongo-sanitize` | Strips `$` and `.` characters from all request body, query, and param fields before they reach any service or model |
| **Rate Limiting** | `middleware/rateLimiter.js` | `authLimiter`: 10 requests / 15 min per IP (applied to `/api/auth/*`). `apiLimiter`: 100 requests / 15 min (defined but not globally applied — only on auth) |
| **CSV Formula Injection Prevention** | `services/csvImportService.js` → `sanitizeCell` | Any CSV cell beginning with `=`, `+`, `-`, or `@` is prefixed with `'` before being saved |
| **Input Validation** | `middleware/validate.js` + `validators/` (Zod) | All POST/PUT/PATCH bodies are validated with Zod schemas before reaching the controller |
| **File Upload Restrictions** | `middleware/upload.js` (CSV) and inline multer (receipt) | CSV: `.csv` extension and `text/csv` MIME, 2 MB limit. Receipt: 5 MB limit, in-memory storage |
| **Ownership Enforcement** | All service functions | Every query scopes to `user: userId` so a student can never access another student's data |
| **Bookmark Ownership Verification** | `services/bookmarkService.js` | Before creating a bookmark, the referenced Tip or Insight is fetched with `user: userId` — returns 404 if it does not belong to the requesting user |
| **Soft Delete Consistency** | All transaction queries | All transaction lookups include `deletedAt: null` — soft-deleted records are never returned to users |
| **Error Leak Prevention** | `middleware/errorHandler.js` | Returns `err.message` but does not expose stack traces to the client in production (stack is only logged server-side) |

---

## Honest Security Gaps

| Gap | Detail | Risk Level |
|---|---|---|
| **No global rate limit** | `apiLimiter` (100/15 min) is defined in `rateLimiter.js` but is **not applied globally** in `server.js` — only auth routes have rate limiting. All other routes (transactions, AI, reports) are unprotected from flooding. | High |
| **JWT secret fallback to `'secret'`** | `middleware/auth.js` and `services/authService.js` fall back to `process.env.JWT_SECRET \|\| 'secret'`. If `JWT_SECRET` is missing from `.env`, a trivially guessable key is used. | High |
| **No HTTPS enforcement** | Helmet adds HSTS but there is no redirect from HTTP to HTTPS in the application layer. The `secure` cookie flag depends on the deployment environment. | Medium |
| **Receipt OCR is regex-only** | Binary image files are not decoded; the OCR service uses `buffer.toString('utf-8')` and regex. Malicious binary content is not sanitised beyond this. | Low |
| **No refresh token** | JWT tokens have a fixed 7-day expiry with no refresh mechanism. A stolen cookie is valid for up to 7 days without revocation. | Medium |
| **No logout endpoint** | There is no route to clear the `jwt` cookie. The user can only log out by the frontend clearing the cookie client-side. A stolen cookie cannot be server-side revoked. | Medium |
| **No CSRF protection** | `sameSite` on the cookie is not explicitly set to `strict` or `lax` in the code (depends on `authService.js` implementation). CSRF attacks may be possible from cross-site forms. | Medium |
| **Seed password is weak** | Both seeded accounts (`admin@campuscoin.com` and `student@campuscoin.com`) use `password123`. Running the seed script in production would create predictable credentials. | High (in prod) |
| **`MONGO_URI` key mismatch in seed** | `seed.js` reads `process.env.MONGO_URI` but `.env.example` and `config/db.js` use `process.env.MONGODB_URI`. If only `MONGODB_URI` is set, the seed script falls back to a different default URI. | Low |
| **No input length limits on free-text fields** | Description, note, and name fields have no `maxlength` constraint at the validator level (only the bookmark `note` field has `maxlength: 500` in the schema). Very long strings could waste storage. | Low |
