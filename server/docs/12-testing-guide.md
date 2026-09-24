# 12 — End-to-End Testing Guide (Complete Flow)

Yeh documentation aapko step-by-step guide karegi ke Campus Coin backend ko complete flow ke saath kaise test karna hai (Postman ya Frontend se). 

Pehle ensure karein ke aapne naya seed data load kar liya hai:
```bash
npm run seed
npm run dev
```

---

## 🟢 Flow 1: Authentication & User Setup
Subse pehle hum system me login karenge.

### 1.1 Admin Login
- **Endpoint:** `POST /api/auth/admin-login`
- **Body:**
  ```json
  {
    "email": "admin@campuscoin.com",
    "password": "password123"
  }
  ```
- **Check:** Response `200 OK` aani chahiye aur Postman me `jwt` cookie save ho jani chahiye. (Note: Yahan agar student login karega toh `401 Unauthorized` aayega).

### 1.2 Student Login (Primary Test User)
- **Endpoint:** `POST /api/auth/login`
- **Body:**
  ```json
  {
    "email": "student@campuscoin.com",
    "password": "password123"
  }
  ```
- **Check:** Response me `200 OK` aur student profile (John Doe) aayegi. Ab aapki Postman cookie replace ho gayi hai aur aap aage ke sab requests as a Student kar sakte hain.

### 1.3 Check Student Profile
- **Endpoint:** `GET /api/users/profile`
- **Check:** Aapko apni profile (`monthlyAllowanceBaseline: 150000`) nazar aani chahiye. Password hash response me nahi hona chahiye.

---

## 🔵 Flow 2: Transactions & Categories (Core Flow)
Ab hum expenses create aur view karenge.

### 2.1 View All Categories
- **Endpoint:** `GET /api/categories`
- **Check:** Seeded categories (Food, Transport, Allowance etc.) ki list aani chahiye. Kisi bhi ek category ka `_id` copy kar lein (e.g., Food).

### 2.2 Create a New Transaction (Trigger AI & Alerts)
- **Endpoint:** `POST /api/transactions`
- **Body:**
  ```json
  {
    "amount": 25.50,
    "type": "expense",
    "category": "<Paste_Food_Category_ID_Here>",
    "description": "Lunch at university cafe",
    "date": "2026-10-15T12:00:00.000Z"
  }
  ```
- **Check:** Response `201 Created` aana chahiye. 
- **Under the hood:**
  - AI ne check kiya hoga ke description me "cafe" hai.
  - Anomaly detection ne check kiya hoga.
  - Activity log me ek "create" event save ho gaya hoga.

### 2.3 View Recent Activity Feed
- **Endpoint:** `GET /api/activity/recent`
- **Check:** List ke top par aapka newly created transaction aana chahiye.

### 2.4 Soft Delete Transaction
- **Endpoint:** `DELETE /api/transactions/<Transaction_ID_From_Step_2.2>`
- **Check:** Response `200 OK`. Agar aap wapas `GET /api/transactions` karenge, toh yeh transaction list me nahi hoga (kyun ke `deletedAt` set ho gaya hai).

---

## 🟠 Flow 3: AI Insights & Saving Tips
Seed script ne pehle hi kaafi data insert kar diya hai taake AI aur Tips test ho sakein.

### 3.1 Get AI Saving Tips
- **Endpoint:** `GET /api/ai/saving-tips`
- **Check:** Aapko ek array milega jisme tips hongi. Kyun ke seed me humne jaan kar "Food" category me ek spike banaya tha aur budget 100% se ooper push kiya tha, aapko yeh tips zaroor milni chahiye:
  - `budget_warning` (Food budget over 80%)
  - `spending_spike` (Food spending is > 120% of 3-month avg)
- **Action:** Kisi ek tip ka `_id` copy karein.

### 3.2 Pin a Saving Tip
- **Endpoint:** `POST /api/ai/saving-tips/<Tip_ID_Here>/action`
- **Body:**
  ```json
  {
    "action": "pinned"
  }
  ```
- **Check:** Wapas `GET /api/ai/saving-tips` karein, yeh tip ab list me sab se ooper (`isPinned: true`) aayegi.

### 3.3 Get Monthly Insights (Gemini)
- **Endpoint:** `GET /api/ai/monthly-insights`
- **Check:** Agar `.env` me `GEMINI_API_KEY` daali hui hai, toh Gemini ka LLM narrative aayega. Warna humara template fallback aayega (e.g. "In 2026-09, your spending in Food rose sharply...").

---

## 🟣 Flow 4: Dashboard & Reports
Ab reports nikalenge.

### 4.1 Dashboard Summary
- **Endpoint:** `GET /api/dashboard/summary`
- **Check:** Current month ka Total Income, Total Expense, Net Balance, aur Top Category (jo ke Food hogi due to seed spike) return hoga.

### 4.2 Daily / Weekly Report
- **Endpoint:** `GET /api/reports/daily-weekly?type=expense`
- **Check:** Aapko expenses ka time-series data milega jo charts plot karne ke kaam aata hai.

### 4.3 PDF Export (Optional Testing)
- **Endpoint:** `GET /api/reports/export-pdf`
- **Check:** Ek PDF file download hogi browser ya Postman me.

---

## 🔴 Flow 5: Admin Controls
Kuch admin actions test karne ke liye, **Admin dobara login karein (Step 1.1)** taake admin cookie set ho jaye.

### 5.1 View Admin Stats
- **Endpoint:** `GET /api/admin/stats`
- **Check:** Platform ke total active users, total volume, aur top 5 categories show hongi.

### 5.2 Reset Student Password
- **Endpoint:** `POST /api/admin/users/<Student_John_Doe_ID>/reset-password`
- **Check:** Response me `temporaryPassword` aayega (e.g. `Xj9Kf2LmP4`). Is naye password se Student login kar ke verify karein.

### 5.3 Edit System Category
- **Endpoint:** `PUT /api/admin/categories/<Food_Category_ID>`
- **Body:**
  ```json
  {
    "name": "Food & Dining",
    "type": "expense",
    "icon": "🍔",
    "color": "#ff0000"
  }
  ```
- **Check:** System wide category name update ho jayega.

---

## 📝 Testing Checklist Summary

| Test Phase | Postman Collection / Route | Status (✔) |
|---|---|---|
| 1. Registration & Auth | `POST /api/auth/...` | [ ] |
| 2. Basic CRUD (CRUD Transactions, Categories) | `GET, POST, PUT, DELETE /api/transactions` | [ ] |
| 3. Budget Alerts | Spend over a set budget & check `GET /api/notifications` | [ ] |
| 4. AI Feature Checks | `/api/ai/categorize`, `/api/ai/saving-tips`, `/api/ai/monthly-insights` | [ ] |
| 5. CSV Import | `/import-csv/preview` (Upload mock CSV) | [ ] |
| 6. Admin Constraints | Access `/api/admin/stats` using Student login (Must fail 403) | [ ] |

Ye guide follow karne se aap apne frontend aur backend ka complete end-to-end integration test kar sakte hain.
