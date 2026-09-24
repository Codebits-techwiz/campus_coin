# 09 — SRS Traceability Matrix

This matrix audits the original Software Requirements Specification (SRS) items against the actual implemented codebase.

| Req # | Feature Description | Status | File Evidence |
|---|---|---|---|
| 1 | Bookmarks for saving TIPS and monthly INSIGHTS (refType tip\|insight, refId, note), not transaction templates. | **Implemented** | `models/Bookmark.js`, `routes/bookmarkRoutes.js`, `services/bookmarkService.js`, `validators/bookmarkValidator.js` |
| 2 | Tips with pin and dismiss (tipActions collection) and ranking by potentialSavings. | **Implemented** | `models/TipAction.js`, `routes/aiRoutes.js`, `services/tipsEngineService.js` |
| 3 | Notifications: GET list and PATCH :id/read. | **Implemented** | `models/Notification.js`, `routes/notificationRoutes.js`, `controllers/notificationController.js` |
| 4 | GET dashboard/summary. | **Implemented** | `routes/dashboardRoutes.js`, `services/dashboardService.js`, `controllers/dashboardController.js` |
| 5 | GET reports/daily-weekly and report filters (dateFrom, dateTo, category, type). | **Implemented** | `routes/reportRoutes.js`, `services/reportService.js`, `validators/reportValidator.js` |
| 6 | Anomaly detection and duplicate detection on transaction create. | **Implemented** | `services/anomalyService.js`, `services/transactionService.js` (called during create) |
| 7 | Recently viewed/edited (activity/recent). | **Implemented** | `models/ActivityLog.js`, `services/activityService.js`, `routes/activityRoutes.js` |
| 8 | GET announcements for students. | **Implemented** | `models/Announcement.js`, `routes/announcementRoutes.js`, `controllers/announcementController.js` |
| 9 | Student CSV import with preview and confirm step. | **Implemented** | `routes/transactionRoutes.js`, `services/csvImportService.js` |
| 10 | Admin: category CRUD, announcement CRUD, user status, user password reset, tip templates. | **Implemented** | `routes/adminRoutes.js`, `services/adminService.js`, `validators/adminValidator.js`, `models/TipTemplate.js` |
| 11 | Breadcrumbs, Sitemap, Dark Mode | **Frontend** | Backend scope only |

---

## Other Core Application Features Traced

| Module | Status | File Evidence |
|---|---|---|
| Registration & Student/Admin Login | **Implemented** | `routes/authRoutes.js`, `services/authService.js`, `validators/authValidator.js` |
| JWT `httpOnly` Cookie Security | **Implemented** | `middleware/auth.js`, `services/authService.js` |
| Soft-Delete Transactions | **Implemented** | `services/transactionService.js` (filters `deletedAt: null`) |
| Monthly Budgets with Real-time Progress | **Implemented** | `services/budgetService.js` (aggregates transaction sum per category limit) |
| Cron Job for Recurring Transactions | **Implemented** | `jobs/recurringCron.js`, `services/recurringService.js` |
| AI Categorizer (Naive Bayes + Keyword Fallback) | **Implemented** | `services/aiCategorizerService.js` (uses `natural` package) |
| LLM Monthly Spending Narrative & Fallback | **Implemented** | `services/aiInsightsService.js` (uses `@google/generative-ai`) |
| Financial Forecasting (Linear Regression / Moving Avg) | **Implemented** | `services/forecastService.js` |
| PDF Export & Email Sending | **Implemented** | `services/pdfService.js`, `services/emailService.js` (uses `pdfkit` & `nodemailer`) |
| Receipt OCR Data Extraction | **Implemented** | `services/receiptOcrService.js` (regex parsing of buffer strings) |
