# 10 — Core Test Cases

This table lists functional test cases based on the implemented codebase behaviour. The actual result and pass/fail columns are left blank for manual QA execution.

| ID | Module | Description | Pre-condition | Input / Action | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|---|---|
| TC-01 | Auth | Student Login | User exists in DB | POST to `/api/auth/login` with valid email and password | Returns 200, user object (no hash), sets `jwt` cookie | | |
| TC-02 | Auth | Admin Password Reset | Admin is logged in | POST to `/api/admin/users/:id/reset-password` | Returns 200, plain temp password is in response body | | |
| TC-03 | Security | Prevent Admin Data Access | Admin is logged in | Admin calls GET `/api/transactions` | Returns 403 Forbidden | | |
| TC-04 | Transactions | Create soft-delete | Transaction exists | DELETE `/api/transactions/:id` | Returns 200, `deletedAt` is set, row is hidden from GET list | | |
| TC-05 | CSV Import | Bulk Import Preview | User is logged in | POST CSV file with 5 valid rows to `/import-csv/preview` | Returns 200, preview array length 5, no DB insert | | |
| TC-06 | Budget | Trigger Alert | Budget set at $100 | Create expense of $85 in same category | Returns 201 for txn, creates `budget_alert` Notification | | |
| TC-07 | Recurring | Cron Execution | Rule exists, due today | System clock passes 00:00 (or trigger cron manually) | Transaction created, `nextRunDate` advanced | | |
| TC-08 | AI Tips | Generate Spending Spike Tip | Spend 150% of 3-month avg | GET `/api/ai/saving-tips` | Returns tips array containing a `spending_spike` tip | | |
| TC-09 | AI Tips | Pin a Tip | Tip exists | POST to tip action route with `{ action: "pinned" }` | Tip moves to top of list, `isPinned: true` | | |
| TC-10 | Bookmarks | Bookmark a Tip | Tip exists | POST `/api/bookmarks` with Tip ID | Bookmark created; subsequent GET populates Tip text | | |
| TC-11 | Admin | Delete Category in Use | Category is used by txns | DELETE `/api/admin/categories/:id` | Returns 400 Bad Request (blocked from deletion) | | |
| TC-12 | Admin | Delete Category with Reassign | Category is used | DELETE with `?reassignTo=<newId>` | Returns 200, txns are moved to `newId`, old deleted | | |
| TC-13 | Activity | Track View Event | Txn exists | GET `/api/transactions/:id` | `activitylogs` contains `view` event for this user/txn | | |
| TC-14 | Activity | Recent Feed Deduplication | Edit same txn 3 times | GET `/api/activity/recent` | Txn appears exactly once at the top of the feed | | |
| TC-15 | AI Insights | Template Fallback | No Gemini API key | GET `/api/ai/monthly-insights` | Returns 200, template text used, source="template" | | |
