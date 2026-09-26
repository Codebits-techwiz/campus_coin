# WORKING DRAFT for the team. The final report must be written by the team.

# Installation & Environment Setup

The backend expects variables to be defined in a `.env` file at the root of `server/`.

| Variable | Required | Read Where? | Consequence if missing |
|---|---|---|---|
| `PORT` | Optional | `server.js` | Defaults to `5000` |
| `NODE_ENV` | Optional | `server.js`, `authController.js`, etc. | Defaults to `development`. If not `production`, cookies lack `Secure` flag and error handlers show stack traces. |
| `MONGODB_URI` | Required | `config/db.js` | Server crashes explicitly if the string is completely invalid (or defaults to localhost:27017). |
| `JWT_SECRET` | **Required** | `server.js`, `auth.js`, `authController.js` | **Server refuses to start and exits with code 1 immediately.** |
| `JWT_EXPIRES_IN` | Optional | `authController.js` | Defaults to `30d` |
| `COOKIE_EXPIRES_IN` | Optional | `authController.js` | Defaults to `30` (days) |
| `API_RATE_LIMIT_MAX` | Optional | `rateLimiter.js` | Defaults to 100 requests / 15 min |
| `AUTH_RATE_LIMIT_MAX` | Optional | `rateLimiter.js` | Defaults to 10 requests / 15 min |
| `GEMINI_API_KEY` | Optional | `aiInsightsService.js`, `csvImportService.js`, `receiptOcrService.js` | AI endpoints gracefully fallback to rule-based templates or return 422 errors if missing. |
| `SMTP_HOST` | Optional | `config/email.js` | Forgot-password emails will fail to send and throw an error. |
| `SMTP_PORT` | Optional | `config/email.js` | Defaults to 587. |
| `SMTP_USER` | Optional | `config/email.js` | Email operations fail without authentication. |
| `SMTP_PASS` | Optional | `config/email.js` | Email operations fail without authentication. |
| `SMTP_FROM_EMAIL` | Optional | `config/email.js` | Defaults to `noreply@campuscoin.com`. |
| `SMTP_FROM_NAME` | Optional | `config/email.js` | Defaults to `Campus Coin Admin`. |
