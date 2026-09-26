# 04 – AI Usage Audit

> **WORKING DRAFT for the team, not for submission.**
> Audited against actual source code on 2026-09-24.

---

## Overview: What Is and Is Not AI

| Component | Classification | Reason |
|-----------|---------------|--------|
| Gemini LLM — Monthly Insights | **AI (External LLM)** | Uses Google Generative AI (`@google/generative-ai`) to produce natural-language narrative and tips. |
| Naive Bayes Categorizer | **AI (Local ML)** | Uses `natural` npm library's `BayesClassifier`. Trained dynamically on keyword rules + user corrections. No external API call. |
| Receipt Vision / OCR Scanner | **Claimed AI, actually rule-based** | `receiptOcrService.js` uses regex + string heuristics only. No OCR library, no vision model. Marketing claim does not match implementation. |
| Tips Engine | **NOT AI — Rule-Based** | `tipsEngineService.js` is entirely deterministic logic: threshold comparisons against aggregated numbers. No ML, no probabilistic model, no LLM. As required by the SRS, it is advisory only. |
| Anomaly Detection | **NOT AI — Statistical rules** | `anomalyService.js` uses mean + 2σ formula and 24h duplicate window. Classic statistics, not ML. |
| Forecast Service | **NOT AI — Statistical** | `forecastService.js` uses a 3-month simple moving average. Claims "linear regression" but is not. No ML model. |

---

## 1. Gemini LLM — Monthly Insights

**File:** `server/services/aiInsightsService.js`
**Route:** `GET /api/ai/monthly-insights`
**SRS Item:** I1 (plain-language narrative), I2 (flag above-average growth), I3 (actionable advice)
**Mandatory / Optional:** Optional (AI-Insights section of SRS is marked optional)

### How It Works

1. Aggregates current-month category expense totals and 3-month historical averages from MongoDB (no external call at this stage).
2. Builds a plain-data `facts` array: `[{ category, currentSpent, historicalAverage, percentageChange }]`.
3. If `GEMINI_API_KEY` is set and non-empty, calls `gemini-1.5-flash` with a structured prompt.
4. Parses JSON from the LLM response (regex-extract `{...}`).
5. Caches result in `insights` collection and returns it on subsequent calls.

### Data Sent to Third-Party API (Gemini)

```json
[
  { "category": "Food", "currentSpent": 320.50, "historicalAverage": 210.00, "percentageChange": 52.6 },
  { "category": "Transport", "currentSpent": 45.00, "historicalAverage": 48.50, "percentageChange": -7.2 }
]
```

**Confirmed: No name, email, student ID, or any PII is sent to Gemini. Only category names (generic strings like "Food") and numeric spending totals are included.**

Evidence: `aiInsightsService.js:85-106` builds the `facts` array; only `item.category.name` and computed numbers included. `User.name` and `User.email` are never referenced in the prompt or passed to the API.

### Required Config

```
GEMINI_API_KEY=<your-google-ai-studio-key>
```

Set in `.env`. If absent or empty, the LLM is skipped silently.

### Fallback When Unavailable

Template-based fallback generates plain-text `summaryText` and `tipText` based on the largest spending spike found in the facts. Evidenced at `aiInsightsService.js:143-156`. Server never returns an error to the client due to LLM unavailability.

### Output Advisory Label (SRS 1.5 Compliance)

✅ Disclaimer appended on every response (both LLM and template):

```js
disclaimer: 'Notice: This insight is an advisory suggestion generated based on your spending patterns, not certified financial advice.'
```

Evidence: `aiInsightsService.js:26` (cached path) and `:169` (new path).

### User Can Override

✅ Yes. The student can:
- Ignore the insight entirely.
- Use `PUT /api/transactions/:id` to correct any category.
- Submit feedback via `POST /api/ai/feedback` to train the categorizer.

The insight itself is read-only narrative — it cannot be "acted on" automatically.

### Failure Behaviour

If Gemini API call throws (network error, quota exceeded, malformed JSON response): the `catch` block at `aiInsightsService.js:138-140` logs a warning and sets `summaryText = ''` which triggers the template fallback at line 144. The user always receives a response.

---

## 2. Naive Bayes Categorizer

**File:** `server/services/aiCategorizerService.js`
**Routes:** `POST /api/ai/predict-category`, `POST /api/ai/feedback`
**SRS Items:** AC1 (suggest while typing), AC2 (learns from corrections), AC3 (manual override)
**Mandatory / Optional:** Optional (AI-Categorization section marked optional)

### How It Works

1. Checks `CategoryCorrection` collection for user-specific keyword matches (confidence 0.95).
2. Instantiates a new `natural.BayesClassifier` and trains it with 60+ default keyword rules + user corrections.
3. Classifies input description text and returns the best label with a normalized confidence score (0.6–0.9).
4. Falls back to substring keyword matching (confidence 0.75).
5. Final fallback: returns `Miscellaneous` (confidence 0.3).

### Data Sent to Third-Party API

**None.** This component is entirely local. The `natural` library runs in-process. No HTTP call is made.

### Required Config

None beyond the running Node.js server. `natural` is a bundled npm dependency.

### Fallback When Unavailable

Not applicable — no external dependency. If `natural` throws, the error propagates to the controller → centralized error handler → 500 response.

### Output Advisory Label (SRS 1.5 Compliance)

✅ The suggestion is returned as `suggestedCategoryId` with a `confidence` score. The student can accept or reject. The field name itself ("suggested") communicates its advisory nature. The result does not auto-apply to any transaction — the student must explicitly choose it.

### User Can Override

✅ Yes. The student submits `PUT /api/transactions/:id` with their chosen `category`. Override is recorded via `POST /api/ai/feedback` and improves future predictions.

### Failure Behaviour

If `CategoryCorrection.find()` or `Category.find()` fail (DB error), the error propagates to the controller. No silent failure — client receives 500.

---

## 3. Receipt Vision / OCR Scanner

**File:** `server/services/receiptOcrService.js`
**Route:** `POST /api/transactions/scan-receipt`
**SRS Items:** Not explicitly listed in SRS. Extra feature.
**Mandatory / Optional:** Not in SRS — extra feature.

### How It Works (Actual, Not Advertised)

1. Reads `fileBuffer.toString('utf-8')` — converts binary to UTF-8 string.
2. Applies regex `/(TOTAL|TOTAL DUE|AMOUNT|USD|\$)\s*:?\s*\$?\s*(\d+(?:\.\d{2})?)/i` to extract amount.
3. Applies regex `/MERCHANT:\s*([A-Za-z0-9\s]+)/i` to extract merchant name.
4. If binary image (JPG/PNG), the UTF-8 conversion produces garbage — regex finds no match — fallback values used: `amount: 15.0`, `merchant: "Campus Cafe & Bookstore"`.
5. Calls `predictCategory(userId, merchantName)` from the Naive Bayes categorizer.

**There is no vision model, no image decoding, no OCR library.** The feature processes text files only.

### Data Sent to Third-Party API

**None.** The only external AI call would be via the Naive Bayes categorizer which is local. No image or file content is sent outside the server.

### Required Config

None. Feature works (for text files) with no additional config.

### Output Advisory Label (SRS 1.5 Compliance)

✅ Results returned as `extractedData.suggestedCategoryId` with `confidence` — clearly a suggestion. Student must confirm before saving.

### User Can Override

✅ Yes. Scan result is returned to frontend; student manually creates the transaction with any category.

### Failure Behaviour

If file buffer is null/empty, `textContent` is `''`, all regex fail, fallback mock values returned. No crash.

---

## Tip: The Rule-Based Tips Engine Is NOT AI

> **Statement for the record:** `server/services/tipsEngineService.js` is a deterministic rule engine, not an AI or ML component.
>
> It applies three fixed threshold comparisons against aggregated numeric data:
> 1. Category spend > 120% of 3-month average.
> 2. Budget category usage ≥ 80%.
> 3. Total expense > monthly allowance baseline.
>
> No probabilistic model, no training data, no external API call, no LLM. Results are reproducible and fully explainable. Admin-configurable templates allow wording customisation only — the rules themselves are hard-coded.
>
> All outputs are advisory and dismissible by the student (SRS 1.5 ✅).

---

## AI Usage Register

> **Instructions for the team:** Fill in the last two columns (`Human review status` and `Human modification`) before submission. Leave empty if unchanged from generated output.

| File | Purpose | AI-Assisted | Difficulty to Explain (L/M/H) | Human Review Status | Human Modification |
|------|---------|------------|-------------------------------|--------------------|--------------------|
| `server/server.js` | Express app bootstrap, route mounting, middleware | Yes, Antigravity | L | | |
| `server/config/db.js` | MongoDB connection | Yes, Antigravity | L | | |
| `server/config/swagger.js` | Swagger spec config | Yes, Antigravity | L | | |
| `server/config/constants.js` | ROLES, CURRENCIES, HTTP_STATUS enums | Yes, Antigravity | L | | |
| `server/models/User.js` | User schema with password/token security | Yes, Antigravity | L | | |
| `server/models/Transaction.js` | Transaction schema with soft-delete and indexes | Yes, Antigravity | L | | |
| `server/models/Category.js` | Category schema (default + user-owned) | Yes, Antigravity | L | | |
| `server/models/Budget.js` | Budget schema with unique compound index | Yes, Antigravity | L | | |
| `server/models/RecurringRule.js` | Recurring rule schema | Yes, Antigravity | L | | |
| `server/models/Insight.js` | AI insight cache schema | Yes, Antigravity | L | | |
| `server/models/Tip.js` | Rule-based tip schema | Yes, Antigravity | L | | |
| `server/models/TipAction.js` | Pin/dismiss action schema | Yes, Antigravity | L | | |
| `server/models/TipTemplate.js` | Admin tip template schema | Yes, Antigravity | L | | |
| `server/models/Bookmark.js` | Bookmark (tip or insight) schema | Yes, Antigravity | L | | |
| `server/models/Notification.js` | In-app notification schema | Yes, Antigravity | L | | |
| `server/models/ActivityLog.js` | Recently viewed/edited transaction log | Yes, Antigravity | L | | |
| `server/models/CategoryCorrection.js` | User AI categorization feedback schema | Yes, Antigravity | M | | |
| `server/models/Announcement.js` | Admin announcement schema | Yes, Antigravity | L | | |
| `server/models/TransactionTemplate.js` | Quick-entry template schema (extra feature) | Yes, Antigravity | L | | |
| `server/middleware/auth.js` | JWT cookie verification, `req.user` population | Yes, Antigravity | M | | |
| `server/middleware/rateLimiter.js` | Auth + API rate limiters | Yes, Antigravity | L | | |
| `server/middleware/upload.js` | Multer CSV/file upload handler | Yes, Antigravity | L | | |
| `server/middleware/validate.js` | Zod schema validation middleware | Yes, Antigravity | L | | |
| `server/middleware/errorHandler.js` | Centralized Express error handler | Yes, Antigravity | L | | |
| `server/utils/crypto.js` | bcrypt hash and compare helpers | Yes, Antigravity | L | | |
| `server/utils/money.js` | `toCents` / `toAmount` integer-cent helpers | Yes, Antigravity | L | | |
| `server/utils/response.js` | `sendSuccess` / `sendError` response envelope | Yes, Antigravity | L | | |
| `server/services/authService.js` | Register, login, admin-login, password reset | Yes, Antigravity | M | | |
| `server/services/userService.js` | Profile read/update | Yes, Antigravity | L | | |
| `server/services/categoryService.js` | Category CRUD with ownership and reassign safety | Yes, Antigravity | M | | |
| `server/services/transactionService.js` | Transaction CRUD, soft-delete, pagination, anomaly hook | Yes, Antigravity | M | | |
| `server/services/recurringService.js` | Recurring rule CRUD + batch processing | Yes, Antigravity | M | | |
| `server/services/budgetService.js` | Budget upsert, real-time spend aggregation, alert engine | Yes, Antigravity | H | | |
| `server/services/dashboardService.js` | Dashboard aggregation (greeting, totals, top cat) | Yes, Antigravity | M | | |
| `server/services/reportService.js` | Category breakdown, 6-month trend, daily/weekly reports | Yes, Antigravity | M | | |
| `server/services/pdfService.js` | PDF report generation via pdfkit | Yes, Antigravity | M | | |
| `server/services/emailService.js` | Nodemailer report share + password reset email | Yes, Antigravity | M | | |
| `server/services/bookmarkService.js` | Bookmark CRUD with cross-collection ownership check | Yes, Antigravity | M | | |
| `server/services/notificationService.js` | Notification read/list | Yes, Antigravity | L | | |
| `server/services/activityService.js` | Activity log write + dedup recent-10 read | Yes, Antigravity | M | | |
| `server/services/aiInsightsService.js` | Gemini LLM insight generation with template fallback | Yes, Antigravity | H | | |
| `server/services/aiCategorizerService.js` | Naive Bayes + keyword categorizer with feedback loop | Yes, Antigravity | H | | |
| `server/services/receiptOcrService.js` | Regex-based receipt text parser (not real OCR) | Yes, Antigravity | M | | |
| `server/services/tipsEngineService.js` | Deterministic rule-based saving tips engine | Yes, Antigravity | H | | |
| `server/services/anomalyService.js` | Statistical anomaly + duplicate detection | Yes, Antigravity | H | | |
| `server/services/forecastService.js` | 3-month moving average next-month forecast | Yes, Antigravity | M | | |
| `server/services/csvImportService.js` | CSV parse, validate, preview, confirm import | Yes, Antigravity | M | | |
| `server/services/adminService.js` | Admin user/category/announcement/template management | Yes, Antigravity | M | | |
| `server/services/transactionTemplateService.js` | Quick-entry template CRUD | Yes, Antigravity | L | | |
| `server/controllers/authController.js` | Auth request/response handling | Yes, Antigravity | L | | |
| `server/controllers/userController.js` | User profile request/response | Yes, Antigravity | L | | |
| `server/controllers/categoryController.js` | Category request/response | Yes, Antigravity | L | | |
| `server/controllers/transactionController.js` | Transaction request/response + CSV import | Yes, Antigravity | M | | |
| `server/controllers/recurringController.js` | Recurring rule request/response | Yes, Antigravity | L | | |
| `server/controllers/budgetController.js` | Budget request/response | Yes, Antigravity | L | | |
| `server/controllers/dashboardController.js` | Dashboard request/response | Yes, Antigravity | L | | |
| `server/controllers/reportController.js` | Reports + PDF + email share | Yes, Antigravity | L | | |
| `server/controllers/aiController.js` | AI predict, feedback, insights, tips, forecast, scan | Yes, Antigravity | M | | |
| `server/controllers/bookmarkController.js` | Bookmark request/response | Yes, Antigravity | L | | |
| `server/controllers/notificationController.js` | Notification request/response | Yes, Antigravity | L | | |
| `server/controllers/activityController.js` | Activity recent request/response | Yes, Antigravity | L | | |
| `server/controllers/adminController.js` | Admin management request/response | Yes, Antigravity | M | | |
| `server/controllers/announcementController.js` | Public announcement request/response | Yes, Antigravity | L | | |
| `server/controllers/transactionTemplateController.js` | Template request/response | Yes, Antigravity | L | | |
| `server/routes/authRoutes.js` | Auth route definitions | Yes, Antigravity | L | | |
| `server/routes/userRoutes.js` | User route definitions | Yes, Antigravity | L | | |
| `server/routes/categoryRoutes.js` | Category route definitions | Yes, Antigravity | L | | |
| `server/routes/transactionRoutes.js` | Transaction + CSV + receipt scan routes | Yes, Antigravity | L | | |
| `server/routes/recurringRoutes.js` | Recurring rule routes | Yes, Antigravity | L | | |
| `server/routes/budgetRoutes.js` | Budget routes | Yes, Antigravity | L | | |
| `server/routes/dashboardRoutes.js` | Dashboard routes | Yes, Antigravity | L | | |
| `server/routes/reportRoutes.js` | Report routes | Yes, Antigravity | L | | |
| `server/routes/aiRoutes.js` | AI routes | Yes, Antigravity | L | | |
| `server/routes/adminRoutes.js` | Admin routes with role guard | Yes, Antigravity | M | | |
| `server/routes/bookmarkRoutes.js` | Bookmark routes | Yes, Antigravity | L | | |
| `server/routes/notificationRoutes.js` | Notification routes | Yes, Antigravity | L | | |
| `server/routes/activityRoutes.js` | Activity recent route | Yes, Antigravity | L | | |
| `server/routes/announcementRoutes.js` | Announcement routes | Yes, Antigravity | L | | |
| `server/routes/transactionTemplateRoutes.js` | Template routes | Yes, Antigravity | L | | |
| `server/validators/authValidator.js` | Zod schemas for auth endpoints | Yes, Antigravity | L | | |
| `server/validators/userValidator.js` | Zod schemas for user update | Yes, Antigravity | L | | |
| `server/validators/categoryValidator.js` | Zod schemas for category | Yes, Antigravity | L | | |
| `server/validators/transactionValidator.js` | Zod schemas for transactions | Yes, Antigravity | M | | |
| `server/validators/recurringValidator.js` | Zod schemas for recurring rules | Yes, Antigravity | L | | |
| `server/validators/budgetValidator.js` | Zod schemas for budgets | Yes, Antigravity | L | | |
| `server/validators/reportValidator.js` | Zod schema for share-email | Yes, Antigravity | L | | |
| `server/validators/aiValidator.js` | Zod schemas for AI endpoints | Yes, Antigravity | L | | |
| `server/validators/adminValidator.js` | Zod schemas for all admin operations | Yes, Antigravity | M | | |
| `server/validators/bookmarkValidator.js` | Zod schema for bookmark | Yes, Antigravity | L | | |
| `server/jobs/recurringCron.js` | Node-cron scheduler for recurring transactions | Yes, Antigravity | M | | |
| `server/seed/seed.js` | Database seed with deterministic RNG | Yes, Antigravity | M | | |
| `server/restore.js` | (Utility file — not audited in detail) | Yes, Antigravity | L | | |
