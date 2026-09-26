# WORKING DRAFT for the team. The final report must be written by the team.

# API Reference

| Method | Path | Auth Level | Rate Limit | Validator | Note |
|---|---|---|---|---|---|
| GET | /api/activity/recent | Student | Standard (apiLimiter) | NO VALIDATOR | |
| GET | /api/admin/stats | Admin | Standard (apiLimiter) | NO VALIDATOR | |
| GET | /api/admin/users | Admin | Standard (apiLimiter) | NO VALIDATOR | |
| PATCH | /api/admin/users/:id/status | Admin | Standard (apiLimiter) | NO VALIDATOR | |
| POST | /api/admin/users/:id/reset-password | Admin | Standard (apiLimiter) | NO VALIDATOR | |
| POST | /api/admin/categories | Admin | Standard (apiLimiter) | NO VALIDATOR | |
| PUT | /api/admin/categories/:id | Admin | Standard (apiLimiter) | NO VALIDATOR | |
| DELETE | /api/admin/categories/:id | Admin | Standard (apiLimiter) | NO VALIDATOR | |
| GET | /api/admin/announcements | Admin | Standard (apiLimiter) | NO VALIDATOR | |
| POST | /api/admin/announcements | Admin | Standard (apiLimiter) | NO VALIDATOR | |
| PUT | /api/admin/announcements/:id | Admin | Standard (apiLimiter) | NO VALIDATOR | |
| PATCH | /api/admin/announcements/:id | Admin | Standard (apiLimiter) | NO VALIDATOR | |
| DELETE | /api/admin/announcements/:id | Admin | Standard (apiLimiter) | NO VALIDATOR | |
| GET | /api/admin/tip-templates | Admin | Standard (apiLimiter) | NO VALIDATOR | |
| POST | /api/admin/tip-templates | Admin | Standard (apiLimiter) | NO VALIDATOR | |
| PUT | /api/admin/tip-templates/:id | Admin | Standard (apiLimiter) | NO VALIDATOR | |
| DELETE | /api/admin/tip-templates/:id | Admin | Standard (apiLimiter) | NO VALIDATOR | |
| POST | /api/ai/predict-category | Student | Standard (apiLimiter) | Yes | |
| POST | /api/ai/feedback | Student | Standard (apiLimiter) | Yes | |
| GET | /api/ai/monthly-insights | Student | Standard (apiLimiter) | NO VALIDATOR | |
| GET | /api/ai/monthly-insights/history | Student | Standard (apiLimiter) | NO VALIDATOR | |
| GET | /api/ai/saving-tips | Student | Standard (apiLimiter) | NO VALIDATOR | |
| POST | /api/ai/saving-tips/:id/pin | Student | Standard (apiLimiter) | Yes | |
| POST | /api/ai/saving-tips/:id/dismiss | Student | Standard (apiLimiter) | Yes | |
| GET | /api/ai/forecast | Student | Standard (apiLimiter) | NO VALIDATOR | |
| GET | /api/announcement | Student | Standard (apiLimiter) | NO VALIDATOR | |
| POST | /api/auth/register | Public | Strict (authLimiter) | Yes | |
| POST | /api/auth/login | Public | Strict (authLimiter) | Yes | |
| POST | /api/auth/admin-login | Public | Strict (authLimiter) | Yes | |
| POST | /api/auth/logout | Public | Strict (authLimiter) | NO VALIDATOR | |
| POST | /api/auth/forgot-password | Public | Strict (authLimiter) | Yes | |
| POST | /api/auth/reset-password | Public | Strict (authLimiter) | Yes | |
| GET | /api/bookmark | Student | Standard (apiLimiter) | NO VALIDATOR | |
| POST | /api/bookmark | Student | Standard (apiLimiter) | NO VALIDATOR | |
| PATCH | /api/bookmark/:id | Student | Standard (apiLimiter) | NO VALIDATOR | |
| DELETE | /api/bookmark/:id | Student | Standard (apiLimiter) | NO VALIDATOR | |
| GET | /api/budget | Student | Standard (apiLimiter) | NO VALIDATOR | |
| POST | /api/budget | Student | Standard (apiLimiter) | Yes | |
| DELETE | /api/budget/:id | Student | Standard (apiLimiter) | NO VALIDATOR | |
| GET | /api/category | Student | Standard (apiLimiter) | NO VALIDATOR | |
| POST | /api/category | Student | Standard (apiLimiter) | Yes | |
| PUT | /api/category/:id | Student | Standard (apiLimiter) | Yes | |
| DELETE | /api/category/:id | Student | Standard (apiLimiter) | NO VALIDATOR | |
| GET | /api/dashboard/summary | Student | Standard (apiLimiter) | NO VALIDATOR | |
| GET | /api/notification | Student | Standard (apiLimiter) | NO VALIDATOR | |
| PATCH | /api/notification/:id/read | Student | Standard (apiLimiter) | NO VALIDATOR | |
| GET | /api/recurring | Student | Standard (apiLimiter) | NO VALIDATOR | |
| POST | /api/recurring | Student | Standard (apiLimiter) | Yes | |
| PUT | /api/recurring/:id | Student | Standard (apiLimiter) | Yes | |
| DELETE | /api/recurring/:id | Student | Standard (apiLimiter) | NO VALIDATOR | |
| GET | /api/report/category-breakdown | Student | Standard (apiLimiter) | NO VALIDATOR | |
| GET | /api/report/trend-6months | Student | Standard (apiLimiter) | NO VALIDATOR | |
| GET | /api/report/daily-weekly | Student | Standard (apiLimiter) | NO VALIDATOR | |
| GET | /api/report/export-pdf | Student | Standard (apiLimiter) | NO VALIDATOR | |
| POST | /api/report/share-email | Student | Standard (apiLimiter) | Yes | |
| GET | /api/transaction | Student | Standard (apiLimiter) | NO VALIDATOR | |
| POST | /api/transaction | Student | Standard (apiLimiter) | Yes | |
| GET | /api/transaction/:id | Student | Standard (apiLimiter) | NO VALIDATOR | |
| PUT | /api/transaction/:id | Student | Standard (apiLimiter) | Yes | |
| DELETE | /api/transaction/:id | Student | Standard (apiLimiter) | NO VALIDATOR | |
| POST | /api/transaction/import-csv/preview | Student | Standard (apiLimiter) | NO VALIDATOR | |
| POST | /api/transaction/import-csv/confirm | Student | Standard (apiLimiter) | NO VALIDATOR | |
| POST | /api/transaction/scan-receipt | Student | Standard (apiLimiter) | NO VALIDATOR | |
| GET | /api/transactionTemplate | Student | Standard (apiLimiter) | NO VALIDATOR | |
| POST | /api/transactionTemplate | Student | Standard (apiLimiter) | Yes | |
| PUT | /api/transactionTemplate/:id | Student | Standard (apiLimiter) | Yes | |
| DELETE | /api/transactionTemplate/:id | Student | Standard (apiLimiter) | NO VALIDATOR | |
| GET | /api/users/profile | Student | Standard (apiLimiter) | NO VALIDATOR | |
| PUT | /api/users/profile | Student | Standard (apiLimiter) | Yes | |

**Total Routes (Computed):** 69
**Routes without Validator (Computed):** 49
