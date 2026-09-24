# 03 — API Reference

All routes are prefixed `/api/`. Authentication uses an `httpOnly` JWT cookie named `jwt`.

**Auth levels:**
- **Public** — No cookie required
- **Student** — Valid `jwt` cookie; any active user
- **Admin** — Valid `jwt` cookie **and** `role === 'admin'`

**Rate limits** (from `middleware/rateLimiter.js`):
- `authLimiter` — 10 requests per 15 minutes per IP
- `apiLimiter` — 100 requests per 15 minutes per IP (defined but **not globally applied** — only applied to auth routes)

---

## Auth — `/api/auth`

| Method | Path | Auth | Rate Limit | Validator | Description |
|---|---|---|---|---|---|
| POST | `/register` | Public | authLimiter (10/15 min) | `authValidator` (Zod) | Create a new student account. Returns a JWT cookie and user object. |
| POST | `/login` | Public | authLimiter (10/15 min) | — | Authenticate; returns JWT in `httpOnly` cookie. |

> **Note:** Admin login uses the same `/api/auth/login` route — role is determined by the stored `role` field.

---

## Users — `/api/users`

| Method | Path | Auth | Rate Limit | Validator | Description |
|---|---|---|---|---|---|
| GET | `/profile` | Student | — | — | Return the authenticated user's profile (no passwordHash). |
| PUT | `/profile` | Student | — | — | Update name, academicYear, monthlyAllowanceBaseline, monthlySavingsGoal, currency. |

---

## Categories — `/api/categories`

| Method | Path | Auth | Rate Limit | Validator | Description |
|---|---|---|---|---|---|
| GET | `/` | Student | — | — | List all categories available to the user (system defaults + own custom). |
| POST | `/` | Student | — | `categoryValidator` (Zod) | Create a personal custom category (owner = req.user). |
| PUT | `/:id` | Student | — | `categoryValidator` (Zod) | Update a custom category owned by the user. |
| DELETE | `/:id` | Student | — | — | Delete a custom category owned by the user. |

---

## Transactions — `/api/transactions`

| Method | Path | Auth | Rate Limit | Validator | Description |
|---|---|---|---|---|---|
| GET | `/` | Student | — | — | Paginated, filtered list. Query params: `search`, `dateFrom`, `dateTo`, `category`, `type`, `page`, `limit`. Returns active (non-deleted) transactions only. |
| POST | `/` | Student | — | `createTransactionSchema` (Zod) | Create a transaction. Triggers AI category suggestion, anomaly/duplicate check, budget alert check. Logs a `create` activity event. |
| GET | `/:id` | Student | — | — | Fetch a single transaction by ID. Logs a `view` activity event. |
| PUT | `/:id` | Student | — | `updateTransactionSchema` (Zod) | Update a transaction owned by the user. Logs an `edit` activity event. |
| DELETE | `/:id` | Student | — | — | Soft-delete a transaction (sets `deletedAt`). |
| POST | `/import-csv/preview` | Student | — | Multer (2 MB CSV) | Parse uploaded CSV; return preview of valid rows and any errors. Max 1000 rows. Sanitises formula injection. |
| POST | `/import-csv/confirm` | Student | — | — | Confirm and bulk-insert the previewed rows. |
| POST | `/scan-receipt` | Student | — | Multer (5 MB, in-memory) | Parse receipt file buffer; extract amount, merchant, date; predict category via AI. |

---

## Recurring Rules — `/api/recurring`

| Method | Path | Auth | Rate Limit | Validator | Description |
|---|---|---|---|---|---|
| GET | `/` | Student | — | — | List the user's recurring rules. |
| POST | `/` | Student | — | `createRecurringRuleSchema` (Zod) | Create a recurring rule (weekly or monthly). |
| PUT | `/:id` | Student | — | `updateRecurringRuleSchema` (Zod) | Update a recurring rule owned by the user. |
| DELETE | `/:id` | Student | — | — | Delete a recurring rule owned by the user. |

---

## Budgets — `/api/budgets`

| Method | Path | Auth | Rate Limit | Validator | Description |
|---|---|---|---|---|---|
| GET | `/` | Student | — | — | List the user's budgets for a month. Query param: `month` (YYYY-MM). Includes real-time spending progress. |
| POST | `/` | Student | — | `setBudgetSchema` (Zod) | Create a budget (unique per user × category × month). |
| DELETE | `/:id` | Student | — | — | Delete a budget owned by the user. |

---

## Notifications — `/api/notifications`

| Method | Path | Auth | Rate Limit | Validator | Description |
|---|---|---|---|---|---|
| GET | `/` | Student | — | — | List the user's notifications, newest first. |
| PATCH | `/:id/read` | Student | — | — | Mark a notification as read. Ownership enforced. |

---

## Dashboard — `/api/dashboard`

| Method | Path | Auth | Rate Limit | Validator | Description |
|---|---|---|---|---|---|
| GET | `/summary` | Student | — | — | Current-month totals (income, expense, net balance), budget progress, category breakdown, savings goal progress. |

---

## Reports — `/api/reports`

| Method | Path | Auth | Rate Limit | Validator | Description |
|---|---|---|---|---|---|
| GET | `/daily-weekly` | Student | — | `reportValidator` (Zod query) | Spending grouped by day or week. Filters: `dateFrom`, `dateTo`, `category`, `type`. |
| GET | `/monthly-summary` | Student | — | — | Per-category monthly totals for the current or specified month. |
| GET | `/export-pdf` | Student | — | — | Generate and stream a PDF report. |
| POST | `/export-pdf-email` | Student | — | — | Generate PDF report and email it to the user. |

---

## AI — `/api/ai`

| Method | Path | Auth | Rate Limit | Validator | Description |
|---|---|---|---|---|---|
| POST | `/categorize` | Student | — | `aiValidator` (Zod) | Predict the category for a transaction description. Returns suggestion + confidence + source. |
| POST | `/category-feedback` | Student | — | `aiValidator` (Zod) | Submit a correction to the AI categorizer. Updates the `categoryCorrections` collection. |
| GET | `/monthly-insights` | Student | — | — | Generate (or return cached) LLM narrative insight for a month. Falls back to template if no API key. Appends disclaimer. |
| GET | `/saving-tips` | Student | — | — | Evaluate saving rules for the current month; return tips ranked by potentialSavings. |
| POST | `/saving-tips/:id/action` | Student | — | — | Pin or dismiss a saving tip. Body: `{ action: "pinned" | "dismissed" }`. |
| GET | `/forecast` | Student | — | — | Next-month financial projection based on 3-month moving average. |

---

## Bookmarks — `/api/bookmarks`

| Method | Path | Auth | Rate Limit | Validator | Description |
|---|---|---|---|---|---|
| GET | `/` | Student | — | — | List the user's bookmarks with the referenced Tip or Insight populated. |
| POST | `/` | Student | — | `createBookmarkSchema` (Zod) | Bookmark a Tip or Insight. Verifies the referenced item belongs to the user. Returns 409 on duplicate. |
| PATCH | `/:id` | Student | — | `updateBookmarkSchema` (Zod) | Edit the `note` field on a bookmark owned by the user. |
| DELETE | `/:id` | Student | — | — | Delete a bookmark owned by the user. |

---

## Announcements (Student) — `/api/announcements`

| Method | Path | Auth | Rate Limit | Validator | Description |
|---|---|---|---|---|---|
| GET | `/` | Student | — | — | List active announcements only (`isActive: true`). |

---

## Transaction Templates — `/api/templates`

| Method | Path | Auth | Rate Limit | Validator | Description |
|---|---|---|---|---|---|
| GET | `/` | Student | — | — | List the user's saved quick-entry transaction templates. |
| POST | `/` | Student | — | — | Create a transaction template. |
| PUT | `/:id` | Student | — | — | Update a template owned by the user. |
| DELETE | `/:id` | Student | — | — | Delete a template owned by the user. |

---

## Activity — `/api/activity`

| Method | Path | Auth | Rate Limit | Validator | Description |
|---|---|---|---|---|---|
| GET | `/recent` | Student | — | — | Last 10 distinct transactions the user viewed, created, or edited. Deduplicated by entity, newest first. Soft-deleted transactions omitted silently. |

---

## Admin — `/api/admin`

All routes require `role === 'admin'`. Admins **cannot** read individual student transaction data.

| Method | Path | Auth | Rate Limit | Validator | Description |
|---|---|---|---|---|---|
| GET | `/stats` | Admin | — | — | Platform-wide aggregated stats: active users, total income/expense volume, top 5 categories by usage count. |
| GET | `/users` | Admin | — | — | List all student accounts (no passwordHash, no transactions). |
| PATCH | `/users/:id/status` | Admin | — | `userStatusSchema` (Zod) | Enable or disable a student account. |
| POST | `/users/:id/reset-password` | Admin | — | — | Generate a random 12-char temporary password; hash and save it; return the plain password once. Students only. |
| POST | `/categories` | Admin | — | `createCategorySchema` (Zod) | Create a system-default category. |
| PUT | `/categories/:id` | Admin | — | `updateCategorySchema` (Zod) | Update a system-default category. |
| DELETE | `/categories/:id` | Admin | — | `deleteCategorySchema` (Zod) | Delete a system-default category. Blocked if transactions reference it unless query param `?reassignTo=<id>` is provided. |
| GET | `/announcements` | Admin | — | — | List all announcements (active and inactive). |
| POST | `/announcements` | Admin | — | `createAnnouncementSchema` (Zod) | Create an announcement. |
| PUT | `/announcements/:id` | Admin | — | `updateAnnouncementSchema` (Zod) | Full update of an announcement. |
| PATCH | `/announcements/:id` | Admin | — | `toggleAnnouncementSchema` (Zod) | Toggle `isActive` only. |
| DELETE | `/announcements/:id` | Admin | — | — | Permanently delete an announcement. |
| GET | `/tip-templates` | Admin | — | — | List all tip text templates. |
| POST | `/tip-templates` | Admin | — | `createTipTemplateSchema` (Zod) | Create a tip template. Tips engine uses active templates; built-in strings are the fallback. |
| PUT | `/tip-templates/:id` | Admin | — | `updateTipTemplateSchema` (Zod) | Update a tip template. |
| DELETE | `/tip-templates/:id` | Admin | — | — | Delete a tip template. |

---

## System

| Method | Path | Auth | Rate Limit | Description |
|---|---|---|---|---|
| GET | `/api/health` | Public | — | Liveness check. Returns `{ status: "online", version: "1.0.0", timestamp }`. |
| GET | `/api/docs` | Public | — | Interactive Swagger UI (OpenAPI 3.0). |

---

## Total Endpoint Count

| Module | Count |
|---|---|
| Auth | 2 |
| Users | 2 |
| Categories | 4 |
| Transactions | 8 |
| Recurring | 4 |
| Budgets | 3 |
| Notifications | 2 |
| Dashboard | 1 |
| Reports | 4 |
| AI | 6 |
| Bookmarks | 4 |
| Announcements (student) | 1 |
| Templates | 4 |
| Activity | 1 |
| Admin | 14 |
| System | 2 |
| **Total** | **62** |
