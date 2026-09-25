
# 00 START HERE: Frontend Integration Guide

This guide is written specifically for frontend developers integrating the React application with the Campus Coin backend. 

## 1. Base URL & Environments
- **Development:** `http://localhost:5000`
- **Production:** Check your `.env` (usually injected as `VITE_API_URL`).

## 2. Authentication Model (Crucial)
**The JWT is stored in an `httpOnly` cookie.** It will NEVER appear in the JSON response body, and you MUST NOT store it in `localStorage`.

### Frontend Configuration
You must configure your HTTP client to send credentials with every request.
- **Using Axios:**
  ```javascript
  import axios from 'axios';
  const api = axios.create({
    baseURL: 'http://localhost:3001',
    withCredentials: true // CRITICAL
  });
  ```
- **Using Fetch:**
  ```javascript
  fetch('http://localhost:3001/api/users/profile', {
    credentials: 'include' // CRITICAL
  });
  ```

### CORS Requirements
The backend is locked to the `CLIENT_URL` environment variable (e.g., `http://localhost:5173`). Your dev server MUST run on this exact port/URL, or CORS will block the request.

### Session Restoration
How to know if a user is logged in on app load (hard refresh)?
Call `GET /api/users/profile` immediately.
- If it returns **200 OK**, you have an active session. Put the user in your global state.
- If it returns **401 Unauthorized**, the cookie is missing or expired. Redirect to login.

## 3. Standard Envelopes
The API ALWAYS wraps responses in a predictable envelope.

**Success Envelope:**
```json
{
  "success": true,
  "message": "Human readable success string (optional)",
  "data": { ... } // Or an array []
}
```

**Error Envelope:**
```json
{
  "success": false,
  "error": "Short human readable error reason",
  "errors": [ ... ] // Optional: Array of specific field validation errors
}
```

## 4. HTTP Status Codes Used
- **200 OK:** Success.
- **201 Created:** Success, resource was created.
- **400 Bad Request:** Validation failed. Check the `errors` array for field-specific messages.
- **401 Unauthorized:** Missing/expired cookie, or wrong password.
- **403 Forbidden:** You are logged in, but not allowed to do this (e.g. disabled account, or not an Admin).
- **404 Not Found:** Resource doesn't exist, OR you don't own it.
- **422 Unprocessable Entity:** File upload or AI parsing failed.
- **429 Too Many Requests:** Rate limited (mostly on Auth routes).
- **500 Internal Server Error:** Backend crash.

## 5. Money Handling (No Cents Math!)
**CRITICAL:** The frontend must send and receive amounts in **DISPLAY UNITS** (e.g., `15.50`), not cents. 
Do not do cents multiplication in React! The backend's controller layer converts to cents automatically before saving, and converts back to display units before responding. 
*Proof: `formatTransaction` in `transactionService.js` uses `toAmount(tx.amount)`.*

## 6. Known Limitations
- **No Websockets:** Notifications are not pushed in real-time. The frontend must poll `GET /api/notifications` periodically, or refresh it on key navigations.
- **Single Active Session:** The cookie overwrites previous sessions.

## 7. Hardcoded Enums to Use
When sending data to the backend, use these exact strings:
- **Transaction Types:** `"income"`, `"expense"`
- **User Roles:** `"student"`, `"admin"`
- **Recurring Frequencies:** `"daily"`, `"weekly"`, `"monthly"`, `"yearly"`
- **Bookmark Ref Types:** `"tip"`, `"insight"`
- **Tip Rule Types (Admin):** `"spending_spike"`, `"recurring_increase"`, `"low_balance"`
