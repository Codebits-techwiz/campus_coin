# 03 – NFR Check

> **WORKING DRAFT for the team, not for submission.**
> Non-functional requirements N1–N9 checked against actual code on 2026-09-24.

---

## N1 – Safety (No Malicious or Unnecessary Downloads)

| Check | Finding | Evidence | Gap |
|-------|---------|---------|-----|
| No executable or binary served | ✅ Pass | Only JSON responses and PDFs via pdfkit stream (`pdfService.js:17`). | None. |
| File upload validation | ✅ Pass | Multer limits: `limits: { fileSize: 5 * 1024 * 1024 }` on both receipt scan (`transactionRoutes.js:13`) and AI predict (`aiRoutes.js:8`). Only `memoryStorage` used — no disk writes. | MIME type whitelist not checked (only size). A non-image file ≤5 MB would be accepted. |
| CSV formula injection | ✅ Pass | `csvImportService.js:10-17` neutralises cells starting with `=`, `+`, `-`, `@`. | None. |
| NoSQL injection | ✅ Pass | `express-mongo-sanitize` applied globally: `server.js:49`. | None. |
| Dependency safety | UNVERIFIED | `npm audit` not run in this audit. `multer@1.4.5-lts.1` is a patched LTS version. | Run `npm audit` before submission. |

---

## N2 – Accessibility

Backend is an API server — accessibility is a frontend concern. The backend provides:

- Semantic JSON responses with consistent `{ success, message, data }` envelope (`utils/response.js`).
- No HTML rendered server-side.

**UNVERIFIED** for frontend. Backend itself has no accessibility obligations beyond clean data contracts.

---

## N3 – User-Friendly

Backend measure: consistent error messages, meaningful HTTP status codes, validation feedback.

| Check | Finding | Evidence |
|-------|---------|---------|
| Consistent response envelope | ✅ Pass | `utils/response.js` — all controllers use `sendSuccess` / `sendError`. |
| Zod validation on all mutation routes | ✅ Pass | Auth, categories, budgets, recurring, transactions, AI, admin all have Zod validators in `validators/`. |
| Anti-enumeration on forgot-password | ✅ Pass | `authController.js:39-46` — always returns same message whether email exists or not. |
| 404 fallback for undefined routes | ✅ Pass | `server.js:83-88`. |

---

## N4 – Operability

| Check | Finding | Evidence |
|-------|---------|---------|
| Health check endpoint | ✅ Pass | `GET /api/health` (`server.js:52-59`) — returns `status: online`, version, timestamp. | No DB liveness probe in health check. |
| Swagger / API docs | ✅ Pass | `GET /api/docs` serves Swagger UI (`server.js:62`). Inline JSDoc on selected routes. | Coverage is partial — not all routes have full Swagger annotations. |
| Seed data for demo | ✅ Pass | `npm run seed` populates admin + 3 students + 6 months of transactions + budgets + recurring rules. |
| dev mode watch | ✅ Pass | `npm run dev` uses `node --watch` — automatic restart on file change. |

---

## N5 – Performance

### Database Indexes

| Collection | Index | Evidence | Adequate? |
|-----------|-------|---------|-----------|
| users | `email` (unique) | `User.js:23` | ✅ Yes |
| transactions | `user` (single) | `Transaction.js:16` | ✅ Yes |
| transactions | `{ user, date }` compound | `Transaction.js:78` | ✅ Yes |
| transactions | `{ user, category, date }` compound | `Transaction.js:79` | ✅ Yes |
| transactions | `deletedAt` | `Transaction.js:69` | ✅ Yes |
| categories | `{ owner, type }` | `Category.js:45` | ✅ Yes |
| categories | `{ isDefault }` | `Category.js:46` | ✅ Yes |
| budgets | `{ user, category, month }` (unique) | `Budget.js:42` | ✅ Yes |
| notifications | `{ user, isRead, createdAt }` | `Notification.js:42` | ✅ Yes |
| activityLogs | `{ user, at }` | `ActivityLog.js:41` | ✅ Yes |
| insights | `{ user, month }` (unique) | `Insight.js:45` | ✅ Yes |
| bookmarks | `{ user, refType, refId }` (unique) | `Bookmark.js:39` | ✅ Yes |
| categoryCorrections | `{ user, descriptionKeyword }` (unique) | `CategoryCorrection.js:37` | ✅ Yes |
| recurringRules | `nextRunDate` | `RecurringRule.js:46` | ✅ Yes |

### N+1 Query Risks

| Location | Issue | Severity |
|---------|-------|---------|
| `bookmarkService.js:24-29` | `Promise.all(bookmarks.map(async bm => Model.findOne(...)))` — one DB query per bookmark | ⚠️ Medium — acceptable if bookmark count is small (typical user <20). |
| `activityService.js:53-66` | Loop fetches each transaction individually after dedup | ⚠️ Medium — max 10 iterations; acceptable. |
| `tipsEngineService.js:140` | `forEach(async item => await resolveTemplate(...))` — **async not awaited** in forEach, so `resolveTemplate` DB queries fire concurrently but results ignored | 🔴 Bug — not just performance, correctness issue. |
| All report aggregations | MongoDB aggregation pipelines with `$lookup` and `$unwind` | ✅ Acceptable — server-side join, single round trip. |

### Pagination

| Endpoint | Paginated? | Evidence |
|---------|-----------|---------|
| `GET /api/transactions` | ✅ Yes | `page`, `limit` params, max 100 per page: `transactionService.js:39,59-60`. |
| `GET /api/notifications` | ❌ No | All notifications returned; no `page`/`limit`. Risk if user has hundreds. |
| `GET /api/bookmarks` | ❌ No | All bookmarks returned. |
| `GET /api/activity/recent` | N/A | Fixed limit of 10. |
| `GET /api/admin/users` | ❌ No | All students returned at once. Could be slow for large user base. |

---

## N6 – Scalability

| Check | Finding | Evidence |
|-------|---------|---------|
| Stateless design | ✅ Pass | Session state is in JWT cookie only — no server-side session store. Multiple instances can run behind a load balancer. |
| No in-process shared state | ✅ Pass | Naive Bayes classifier rebuilt per request (not cached in memory). Cron job runs in a single process — if running multiple instances, cron will fire multiple times. |
| No file system writes | ✅ Pass | All uploads use `multer.memoryStorage()` — nothing written to disk. |
| MongoDB connection | ✅ Pass | `config/db.js` uses Mongoose connection. No connection pooling configuration beyond Mongoose defaults (5 by default). |
| Multi-instance cron risk | ⚠️ Gap | `recurringCron.js` — if deployed with PM2 cluster mode or multiple pods, the same recurring transactions could be posted multiple times per day. | Fix: Use a distributed lock (e.g., MongoDB TTL-based lock) or move cron to a single dedicated worker. |

---

## N7 – Security (Only Own Transactions)

### Ownership Check Per Route

| Route | Ownership Enforced? | Evidence |
|-------|--------------------|---------| 
| `GET /api/transactions` | ✅ Yes | `filter.user = userId` always set: `transactionService.js:41`. |
| `GET /api/transactions/:id` | ✅ Yes | `{ _id, user: userId, deletedAt: null }`: `transactionService.js:21`. |
| `PUT /api/transactions/:id` | ✅ Yes | `{ _id, user: userId, deletedAt: null }`: `transactionService.js:133`. |
| `DELETE /api/transactions/:id` | ✅ Yes | `{ _id, user: userId, deletedAt: null }`: `transactionService.js:169`. |
| `GET /api/categories` | ✅ Yes | `$or: [{ isDefault: true }, { owner: userId }]`: `categoryService.js:12-19`. |
| `PUT /api/categories/:id` | ✅ Yes | Checks `category.owner.toString() !== userId`: `categoryService.js:64`. |
| `DELETE /api/categories/:id` | ✅ Yes | Same owner check: `categoryService.js:91`. |
| `GET /api/budgets` | ✅ Yes | `Budget.find({ user: userId, ... })`: `budgetService.js:28`. |
| `DELETE /api/budgets/:id` | ✅ Yes | `{ _id: budgetId, user: userId }`: `budgetService.js:90`. |
| `GET/POST/DELETE /api/bookmarks` | ✅ Yes | Ownership verified on tip/insight before create: `bookmarkService.js:44`. Update/delete scoped to `{ _id, user: userId }`. |
| `GET /api/ai/monthly-insights` | ✅ Yes | `userId` from `req.user.id` — only user's own transactions aggregated. |
| `GET /api/ai/saving-tips` | ✅ Yes | `userId` scoped throughout `tipsEngineService`. |
| `POST /api/ai/saving-tips/:id/pin|dismiss` | ✅ Yes | `Tip.findOne({ _id: tipId, user: userId })`: `tipsEngineService.js:209`. |
| `GET /api/activity/recent` | ✅ Yes | Activity filtered by `user: userId`; tx lookup adds `user: userId` check. |
| `GET /api/admin/stats` | ✅ Yes (admin) | Aggregates platform totals — no individual user transactions exposed. |

### Additional Security Measures

| Measure | Status | Evidence |
|---------|--------|---------|
| Password hashing | ✅ bcrypt (10 rounds) | `crypto.js` → `utils/crypto.js`. Seed uses `bcrypt.genSalt(10)`. |
| Password never returned | ✅ | `User.js:28` — `select: false`. `toJSON` transform deletes it: `User.js:73`. |
| Reset token stored as SHA-256 hash | ✅ | `authService.js:41` — plain token emailed, only hash stored. |
| Admin check — disabled user still logs in | ❌ Gap | `auth.js:8` fetches user and sets `req.user` but does **not check `isActive`**. A disabled student can still authenticate and use the API. |
| Cookie `secure` flag | ⚠️ Gap | `authController.js:7` — cookie set without `secure: true`. In production over HTTPS this should be set. |
| Rate limiting — non-auth routes | ⚠️ Gap | `authLimiter` applied to auth routes only. All other API routes have no rate limiting. `apiLimiter` is defined in `rateLimiter.js` but never used in any route file. |
| Helmet | ✅ | `server.js:38` — applied globally. |
| CORS | ✅ | `server.js:39-44` — restricted to `CLIENT_URL` from env. |

---

## N8 – Availability

| Check | Finding | Evidence |
|-------|---------|---------|
| Health endpoint | ✅ | `GET /api/health` returns 200. | No DB liveness probe. |
| Cron job error handling | ⚠️ | Cron errors caught and logged (`recurringCron.js:16`), server continues. | No retry logic. |
| Gemini API failure | ✅ | `aiInsightsService.js:138-140` — LLM errors caught, falls back to template. Server never crashes due to external API failure. |
| Email failure | ⚠️ | `emailService.js` — if SMTP is misconfigured and `SMTP_USER` is set, `nodemailer.parseTransport` throws at construction. App will return 500 to share-email and forgot-password calls. | Fix `parseTransport` → `createTransport`. |
| Centralized error handler | ✅ | `middleware/errorHandler.js` + `server.js:91`. Prevents unhandled errors from crashing express. |

---

## N9 – Compatibility

| Check | Finding | Evidence |
|-------|---------|---------|
| Node.js version | UNVERIFIED | No `.nvmrc` or `engines` field in `package.json`. Recommend adding `"engines": { "node": ">=18" }`. |
| ESM modules | ✅ | `"type": "module"` in `package.json:5`. All files use `import/export`. | `budgetService.js` contains rogue `require()` calls — breaks in ESM. |
| Cross-platform | ✅ Pass | No `path.sep` or OS-specific code found. Uses `node --watch` (Node 18+). |
| MongoDB version | UNVERIFIED | No minimum version specified. `$stdDevPop` (used in `anomalyService.js:54`) requires MongoDB 3.2+. Assume compatible. |
| REST API contract | ✅ | JSON responses with `Content-Type: application/json`. CORS configured. | None. |
