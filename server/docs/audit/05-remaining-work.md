# 05 – Remaining Work

> **WORKING DRAFT for the team, not for submission.**
> Prioritised backlog produced from audit on 2026-09-24.
> Effort: **S** = < 1 hour · **M** = 1–4 hours · **L** = 4+ hours.

---

## P0 — Mandatory SRS Item Missing or Broken (Fix Before Demo)

| # | Item | SRS Ref | Effort | Description & Fix |
|---|------|---------|--------|-------------------|
| P0-1 | **Budget aggregation crashes at runtime** | B2, B3, D3 | S | `budgetService.js` lines 34 and 117 use `new (require('mongoose').Types.ObjectId)(userId)` inside an ES Module. `require` is not defined in ESM — this throws `ReferenceError` at runtime, crashing every budget read (`GET /api/budgets`), the entire dashboard's budget-vs-actual widget, and every new expense transaction's budget alert check. **Fix:** Add `import mongoose from 'mongoose';` at top of `budgetService.js` (already imported in other services). Replace both occurrences with `new mongoose.Types.ObjectId(userId)`. |
| P0-2 | **Nodemailer API call is wrong — email fails silently** | A4, R5, K2 | S | `emailService.js:9` calls `nodemailer.parseTransport(...)` which does not exist in the nodemailer API. The correct method is `nodemailer.createTransport(...)`. In dev mode this is masked because `!process.env.SMTP_USER` short-circuits to console log. In production with SMTP configured, the transporter object creation will throw and forgot-password and share-email endpoints will return 500. **Fix:** Change `nodemailer.parseTransport` to `nodemailer.createTransport` at `emailService.js:9`. |
| P0-3 | **Dashboard topTips returns hardcoded placeholder strings** | D2, T2 | S | `dashboardService.js:112-125` returns two static hardcoded tip objects (`id: 'tip_1'`, `id: 'tip_2'`) that are never from the real tips engine. This means the dashboard widget always shows the same fake tips regardless of the student's actual spending. **Fix:** Import `getSavingTipsForUser` from `tipsEngineService` in `dashboardService.js`. Call it with `userId`, slice the result to top 3, and replace the hardcoded array. |
| P0-4 | **Disabled users can still log in and use the API** | M3 | S | `adminService.js:46-53` sets `user.isActive = false`. However `auth.js:8` only checks that the user exists (`if (!req.user)`) — it does not check `isActive`. A disabled student account can still authenticate and access all student endpoints. **Fix:** Add `if (!req.user.isActive) return res.status(403).json({ success: false, error: 'Account is disabled' });` after line 9 in `auth.js`. |

---

## P1 — Defect or Security Issue (Fix Before Submission)

| # | Item | SRS Ref | Effort | Description & Fix |
|---|------|---------|--------|-------------------|
| P1-1 | **`forEach(async)` in tips engine — template resolution race** | T1, T2 | S | `tipsEngineService.js:140` — `currentSpendAgg.forEach(async (item) => { ... await resolveTemplate(...) })`. `Array.prototype.forEach` ignores the returned promise. `resolveTemplate` fires DB queries that are not awaited — the results may or may not appear in `tipsToEnsure` before the function continues. **Fix:** Replace `currentSpendAgg.forEach(async (item) => { ... })` with `for (const item of currentSpendAgg) { ... }` to properly await each async call. |
| P1-2 | **HTTP cookie missing `secure` flag** | A3, N7 | S | `authController.js:7,17,27` — cookie set without `secure: true`. In a production HTTPS deployment the browser will not enforce secure-only transmission. **Fix:** Use `res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: ... })`. |
| P1-3 | **No rate limiting on non-auth API endpoints** | N7 | S | `rateLimiter.js` defines `apiLimiter` (100 req/15 min) but it is **never applied to any route**. All routes except auth have no rate limiting. A malicious client could brute-force category names, flood the AI endpoints, or exhaust Gemini quota. **Fix:** Apply `apiLimiter` globally in `server.js` before route mounts: `app.use('/api', apiLimiter);` (exclude `/api/auth` which already has the stricter `authLimiter`). |
| P1-4 | **AI insights endpoint has no per-user throttle** | I1, N5 | S | `GET /api/ai/monthly-insights` can be called repeatedly for the current month. While the result is cached in DB, a fresh call for a past month not yet cached would trigger a Gemini API call each time. A malicious or buggy client could exhaust the Gemini API quota rapidly. **Fix (short-term):** Apply `apiLimiter` (P1-3 fix covers this). **Fix (long-term):** Add a per-user per-day rate limit on the AI insights endpoint. |
| P1-5 | **Naive Bayes classifier rebuilt on every request** | AC1, N5 | M | `aiCategorizerService.js:65-85` — a new `natural.BayesClassifier` is instantiated and fully trained on every call to `predictCategory`. As the `CategoryCorrection` table grows (more corrections = more training data), this becomes increasingly slow. **Fix:** Cache the trained classifier per user in a `Map<userId, { classifier, etag }>` and only retrain when new corrections are added. Invalidate cache on `POST /api/ai/feedback`. |
| P1-6 | **CSV import skips anomaly detection and budget alerts** | A6, B3 | M | `csvImportService.confirmCsvImport` uses `Transaction.insertMany()` directly — bypassing `transactionService.createTransaction` which triggers anomaly detection and budget alert checks. Bulk imports of large amounts could exceed budgets without any notification. **Fix:** Either call `createTransaction` per row (slower but complete), or call `checkAndTriggerBudgetAlert` + `checkAndDetectAnomaly` in a post-import loop. |
| P1-7 | **Receipt OCR falsely advertised as vision/AI** | Extra feature | S | `receiptOcrService.js` cannot process real image files (JPG/PNG/PDF). Any uploaded image receives hardcoded fallback values. This is misleading to evaluators if demonstrated live with a real receipt photo. **Fix (honest):** Add a comment in the UI that the scan feature processes structured text receipts only, or integrate a real OCR (e.g., Tesseract.js) for genuine image parsing. |
| P1-8 | **No endpoint to list flagged transactions** | S3 | S | `anomalyService.js` sets `isFlagged: true` and `flagReason` on transactions, but there is no dedicated API endpoint to retrieve all flagged transactions. The student cannot easily see which entries were auto-flagged. **Fix:** Add a query option to `GET /api/transactions?flagged=true` or add `GET /api/transactions/flagged` that filters `{ isFlagged: true, user: userId }`. |

---

## P2 — Optional Gap / Enhancement (Nice to Have)

| # | Item | SRS Ref | Effort | Description |
|---|------|---------|--------|-------------|
| P2-1 | **Weekly aggregation missing from daily-weekly report** | R3 | M | `reportService.getDailyWeeklySummaries` returns only daily grouped data. Weekly summary not implemented. Add `$isoWeek` grouping in a second aggregation pipeline and return `weekly` array in the response. |
| P2-2 | **AI categorizer not called during CSV import** | AC4 | M | `csvImportService.js:88-94` matches category by exact name only. Rows with unrecognized categories fall back to Miscellaneous without attempting AI prediction. Call `predictCategory(userId, row.description)` for unmatched rows and include `aiSuggestedCategory` in the preview output. |
| P2-3 | **Bookmark PDF export / share not implemented** | K2 | M | Only the full report has PDF export. Bookmark-specific PDF or share-by-email for a saved tip/insight is not implemented. Add `GET /api/bookmarks/export-pdf` to generate a PDF of all pinned bookmarks. |
| P2-4 | **Image export missing from reports** | R5 | L | SRS R5 says "export PDF or image". Only PDF is implemented. PNG/image export would require a headless browser (puppeteer) or a chart-to-image library. |
| P2-5 | **No pagination on notifications, admin users list, bookmarks** | N5, N6 | S | `GET /api/notifications`, `GET /api/admin/users`, `GET /api/bookmarks` return all records. Add `page` + `limit` query params with a max cap similar to transactions. |
| P2-6 | **Health endpoint has no DB liveness check** | N8 | S | `GET /api/health` returns `online` even if MongoDB is disconnected. Add `mongoose.connection.readyState === 1` check and return `db: 'connected'` or `db: 'disconnected'`. |
| P2-7 | **Insight cannot be regenerated for current month** | I1 | S | Once cached, `GET /api/ai/monthly-insights` always returns the cached version. If Gemini key was missing on first call (template used) and key is later added, the student cannot force a re-run. Add `?force=true` query param to bust the cache and regenerate. |
| P2-8 | **Forecast method labelled incorrectly** | S2 | S | `forecastService.js:61` returns `method: '3_month_moving_average_linear_regression'` but the code computes a plain moving average, not linear regression. Rename to `'3_month_moving_average'` to be accurate. |
| P2-9 | **Cron job unsafe for multi-instance deployment** | N6 | L | `recurringCron.js` runs in every process instance. Under PM2 cluster or Kubernetes, the same recurring transactions would be posted multiple times per midnight. Implement a MongoDB-based distributed lock or move cron to a dedicated process/worker. |
| P2-10 | **No `engines` field in package.json** | N9 | S | `package.json` has no `"engines": { "node": ">=18" }` field. Add to prevent accidental deployment on incompatible Node versions. |
| P2-11 | **List-all-insights endpoint missing** | I4 | S | Insight history can only be retrieved one month at a time via `?month=YYYY-MM`. Add `GET /api/ai/monthly-insights/history` that returns all cached insights for the authenticated user, sorted by month descending. |
| P2-12 | **ReadMe.doc, zip, hosted URL, demo video not present in workspace** | P9, P10, P11 | L | Deliverables P9–P11 require team action outside the codebase. Must be created before final submission. |
| P2-13 | **Swagger coverage is partial** | N4 | M | Only a subset of routes have full Swagger annotations. Several student-facing routes (transactions, budgets, categories) have minimal or no `@swagger` JSDoc. Complete the Swagger spec for all routes to enable auto-generated API documentation. |

---

## Summary by Priority

| Priority | Count | Blocking? |
|----------|-------|-----------|
| P0 | 4 | Yes — will cause demo failures |
| P1 | 8 | Yes — security or correctness defects |
| P2 | 13 | No — enhancements and completeness gaps |
| **Total** | **25** | |
