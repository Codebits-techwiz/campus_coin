# 07 — Installation & Setup

## Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| Node.js | >= 18.0 | ESM (`"type": "module"`) is used throughout |
| npm | >= 9.0 | Bundled with Node.js 18+ |
| MongoDB | >= 6.0 | Local instance or MongoDB Atlas URI |

---

## Environment Variables

Create a `.env` file in `server/` (copy from `.env.example`). Every `process.env.*` reference found in the application source is listed below.

| Variable | Required | Default if missing | Description |
|---|---|---|---|
| `PORT` | Optional | `5000` | TCP port the Express server binds to |
| `NODE_ENV` | Optional | `development` | Logged at startup; affects no business logic |
| `CLIENT_URL` | Optional | `http://localhost:3000` | The CORS origin allowed to send credentialed requests |
| `MONGODB_URI` | **Required** | `mongodb://127.0.0.1:27017/campus_coin` | MongoDB connection string; if missing the application falls back to a local default and will fail if MongoDB is not running locally |
| `JWT_SECRET` | **Required** | `secret` | Secret key for signing JWTs. **If missing, the fallback `'secret'` is used — a critical security risk in any shared environment** |
| `JWT_EXPIRES_IN` | Optional | `7d` (hardcoded in `authService.js`) | JWT expiry. The `.env.example` lists this but it is hardcoded to `7d` in the service; changing the `.env` value alone has no effect |
| `COOKIE_EXPIRES_DAYS` | Optional | Referenced in `.env.example` only; not read by `authService.js` | Cookie max-age is currently not set from env — the cookie is session-based unless `authService.js` is updated |
| `SMTP_HOST` | Optional | `smtp.gmail.com` | SMTP server hostname for `nodemailer` |
| `SMTP_PORT` | Optional | `587` | SMTP port |
| `SMTP_USER` | Optional | — | SMTP authentication username (email address). If missing, `emailService.js` skips sending and logs a warning |
| `SMTP_PASS` | Optional | — | SMTP authentication password / app-password |
| `FROM_EMAIL` | Optional | `noreply@campuscoin.edu` | Sender address for outgoing emails |
| `GEMINI_API_KEY` | Optional | — | Google Gemini API key. **If empty or missing, the monthly insights endpoint silently falls back to the template generator.** No error is thrown |

> **Note:** `seed.js` reads `process.env.MONGO_URI` (not `MONGODB_URI`). If you set only `MONGODB_URI`, the seed script falls back to `mongodb://localhost:27017/campuscoin` — a **different** database name than the main app. Set **both** to avoid confusion, or patch the seed script.

---

## Install

```bash
cd server
npm install
```

---

## Seed the Database

```bash
npm run seed
```

This will:
1. Clear existing data in `users`, `categories`, `transactions`, and `announcements`
2. Create 2 user accounts (see `08-credentials.md`)
3. Create 5 default system categories
4. Insert 6 months × ~22 transactions per month for the student account
5. Create 1 welcome announcement

---

## Run

**Development (with watch mode — auto-restart on file changes):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The server prints:
```
[Scheduler] Node-cron daily recurring rules job registered.
MongoDB Connected: 127.0.0.1
[Campus Coin API] Server running in development mode on port 5000
```

---

## Swagger UI

After starting the server, navigate to:

```
http://localhost:5000/api/docs
```

The interactive documentation lists all routes and allows sending requests directly. Authentication uses the `jwt` cookie — log in first via Postman (or the front end), then Swagger will include the cookie automatically.

---

## Testing with Postman

1. **Send your first login request:**
   ```
   POST http://localhost:5000/api/auth/login
   Body (JSON): { "email": "student@campuscoin.com", "password": "password123" }
   ```

2. **Cookie storage:** Postman automatically saves the `jwt` `httpOnly` cookie returned in the `Set-Cookie` response header. All subsequent requests to the same host will include it automatically.

3. **No `Authorization: Bearer` header is used.** Campus Coin uses cookie-based auth exclusively. Do not add an `Authorization` header — it will be ignored.

4. **For endpoints that require a file** (CSV import, receipt scan), set the request body to `form-data` and attach the file with the key name `file`.

5. **Admin routes** require logging in as `admin@campuscoin.com`. The same cookie mechanism applies.

---

## Health Check

```
GET http://localhost:5000/api/health
```

Returns `200` with `{ status: "online", version: "1.0.0", timestamp }`.
