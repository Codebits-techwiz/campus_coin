# 04 — System Flows

## 1. Register / Login / Admin Login

```mermaid
sequenceDiagram
    actor C as Client
    participant R as authRoutes
    participant M as authLimiter (10/15 min)
    participant S as authService
    participant DB as MongoDB (users)

    C->>R: POST /api/auth/register { name, email, password }
    R->>M: Rate limit check
    M-->>R: OK
    R->>S: register(data)
    S->>DB: Check email not duplicate
    S->>S: bcrypt.hash(password, 10)
    S->>DB: User.create({ name, email, passwordHash, role: 'student' })
    S->>S: jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' })
    S-->>R: { token, user (no hash) }
    R->>C: Set httpOnly cookie 'jwt'; 201 { user }

    C->>R: POST /api/auth/login { email, password }
    R->>M: Rate limit check
    R->>S: login(email, password)
    S->>DB: User.findOne({ email }).select('+passwordHash')
    S->>S: bcrypt.compare(password, hash)
    S->>S: delete user.passwordHash (explicit unset)
    S->>S: jwt.sign({ id }, JWT_SECRET)
    R->>C: Set httpOnly cookie 'jwt'; 200 { user }
```

> Admin login uses the **same** `POST /api/auth/login` endpoint. The cookie returned contains the admin's `id` and their `role` is read from the database on each request by `requireAuth`.

---

## 2. Password Reset (Student Self-Service)

> **Note:** A forgot-password service exists (`emailService.js` is present and `nodemailer` is installed). However, the forget-password route is **not mounted** in `server.js`. The flow described here is the admin-initiated reset only (which is fully implemented).

```mermaid
sequenceDiagram
    actor A as Admin
    participant R as adminRoutes
    participant S as adminService
    participant DB as MongoDB (users)

    A->>R: POST /api/admin/users/:id/reset-password (admin cookie)
    R->>S: resetStudentPassword(userId)
    S->>DB: User.findById(id).select('+passwordHash')
    S->>S: Verify role === 'student'
    S->>S: Generate 12-char random alphanumeric temp password
    S->>S: bcrypt.hash(tempPassword, 10)
    S->>DB: user.save() with new passwordHash
    S-->>R: { tempPassword (plain), email }
    R->>A: 200 { email, temporaryPassword } — plain password returned ONCE, hash never returned
```

---

## 3. Transaction Create (with Budget Alert and Anomaly Check)

```mermaid
sequenceDiagram
    actor C as Student
    participant R as transactionRoutes
    participant Z as Zod validate
    participant TC as transactionController
    participant TS as transactionService
    participant AI as aiCategorizerService
    participant AN as anomalyService
    participant BS as budgetService
    participant NS as notificationService
    participant AS as activityService
    participant DB as MongoDB

    C->>R: POST /api/transactions { amount, type, category, description, date }
    R->>Z: createTransactionSchema.parse(body)
    Z-->>R: valid
    R->>TC: createTransaction(req)
    TC->>TS: createTransaction(userId, body)
    TS->>TS: toCents(amount)
    TS->>AI: predictCategory(userId, description)
    AI->>DB: Load categories + categoryCorrections
    AI-->>TS: { suggestedCategoryId, confidence, source }
    TS->>AN: checkAndDetectAnomaly(userId, amount, category)
    AN->>DB: Query recent transactions for duplicates / spikes
    AN-->>TS: { isFlagged, flagReason }
    TS->>DB: Transaction.create({ ...data, aiSuggestedCategory, isFlagged, flagReason })
    TS->>BS: checkAndTriggerBudgetAlert(userId, categoryId, month)
    BS->>DB: Sum transactions vs budget limit
    alt Spending >= 80% of budget
        BS->>NS: createNotification(userId, 'budget_alert', ...)
        NS->>DB: Notification.create(...)
    end
    TS-->>TC: transaction (cents converted to display)
    TC->>AS: logActivity(userId, 'create', transaction._id) [fire-and-forget, not awaited]
    TC-->>C: 201 { transaction }
```

---

## 4. Recurring Cron Job (Daily Midnight)

```mermaid
flowchart TD
    A["node-cron fires at 00:00 daily"] --> B["recurringCron.js: processDueRecurringRules()"]
    B --> C["Find all active RecurringRules where nextRunDate <= now()"]
    C --> D{Any due rules?}
    D -- No --> E["Log: 0 rules processed"]
    D -- Yes --> F["For each rule: create Transaction with rule's category, type, amount"]
    F --> G{"frequency === 'weekly'?"}
    G -- Yes --> H["Advance nextRunDate by 7 days"]
    G -- No --> I["Advance nextRunDate by 1 month"]
    H --> J["RecurringRule.save()"]
    I --> J
    J --> K["Log: N rules processed"]
```

---

## 5. CSV Import — Preview and Confirm

```mermaid
sequenceDiagram
    actor C as Student
    participant R as transactionRoutes
    participant U as upload.js (Multer 2 MB)
    participant CS as csvImportService

    C->>R: POST /import-csv/preview (multipart, file=file.csv)
    R->>U: handleUploadMiddleware (validates .csv, <= 2 MB)
    U-->>R: req.file.buffer
    R->>CS: previewCsvImport(userId, buffer)
    CS->>CS: csv-parse (columns: true, trim: true)
    CS->>CS: Enforce max 1000 rows
    CS->>CS: Sanitise formula injection cells (=, +, -, @)
    CS->>CS: Map category names to ObjectIds (fallback to first available)
    CS-->>R: { totalRows, validRowCount, errors[], preview[] }
    R->>C: 200 { preview }

    C->>R: POST /import-csv/confirm { rows: [...validRows] }
    R->>CS: confirmCsvImport(userId, rows)
    CS->>CS: Map rows to Transaction documents
    CS->>DB: Transaction.insertMany(...)
    CS-->>R: { importedCount, message }
    R->>C: 201 { importedCount }
```

---

## 6. AI Categorization Priority and Feedback

```mermaid
flowchart TD
    A["POST /api/ai/categorize { description }"] --> B["predictCategory(userId, description)"]
    B --> C["Load user CategoryCorrections from DB"]
    C --> D{Description matches any learned keyword?}
    D -- Yes --> E["Return correction result — confidence: 0.95, source: user_learned_correction"]
    D -- No --> F["Train Naive Bayes on DEFAULT_KEYWORD_RULES + user corrections"]
    F --> G["classifier.getClassifications(description)"]
    G --> H{Match value > 0.0001 AND category exists?}
    H -- Yes --> I["Return NB result — confidence: 0.6–0.9, source: naive_bayes_ai"]
    H -- No --> J["Keyword matching loop over DEFAULT_KEYWORD_RULES"]
    J --> K{Any keyword match?}
    K -- Yes --> L["Return keyword result — confidence: 0.75, source: keyword_rule"]
    K -- No --> M["Return first available category — confidence: 0.3, source: default_fallback"]

    N["POST /api/ai/category-feedback { description, correctedCategoryId }"] --> O["recordCategoryFeedback()"]
    O --> P["CategoryCorrection.findOneAndUpdate — upsert=true, inc count"]
```

---

## 7. Monthly Insights (LLM vs Template Fallback)

```mermaid
flowchart TD
    A["GET /api/ai/monthly-insights ?month=YYYY-MM"] --> B["Insight.findOne user+month"]
    B --> C{Cached insight exists?}
    C -- Yes --> D["Return cached insight + disclaimer"]
    C -- No --> E["Aggregate current month category expenses from transactions"]
    E --> F["Aggregate 3-month historical average per category"]
    F --> G["Build facts array: { category, currentSpent, historicalAverage, pctChange }"]
    G --> H{GEMINI_API_KEY present and non-empty?}
    H -- Yes --> I["Call Gemini 1.5 Flash API with facts JSON"]
    I --> J{Response parseable?}
    J -- Yes --> K["summaryText + tipText from LLM; source = 'llm'"]
    J -- No --> L["LLM fallback: use template"]
    H -- No --> L
    L --> M{highestSpikeCategory AND spike > 15%?}
    M -- Yes --> N["Template: highlight spike category; source = 'template'"]
    M -- No --> O{Any facts?}
    O -- Yes --> P["Template: stable spending message"]
    O -- No --> Q["Template: no transactions yet message"]
    K --> R["Insight.create and cache"]
    N --> R
    P --> R
    Q --> R
    R --> S["Return insight + disclaimer text"]
```

---

## 8. Tips Engine (Rules + Pin/Dismiss)

```mermaid
flowchart TD
    A["GET /api/ai/saving-tips"] --> B["getSavingTips(userId, currentMonth)"]
    B --> C["Find existing tips in DB for this user+month"]
    C --> D{Tips exist in DB?}
    D -- Yes --> E["Return stored tips, filtered for non-dismissed, sorted by potentialSavings"]
    D -- No --> F["evaluateSavingRules(userId, month)"]
    F --> G["RULE 1: Category spend > 120% of 3-month average → spending_spike tip"]
    G --> H["RULE 2: Budget usage >= 80% → budget_warning tip"]
    H --> I["RULE 3: Total expense > monthlyAllowanceBaseline → savings_goal_at_risk tip"]
    I --> J{Any rule triggered?}
    J -- No --> K["Push fallback tip: 'Great tracking, keep logging'"]
    J -- Yes --> L["resolveTemplate(ruleType) from TipTemplates collection"]
    L --> M{Active TipTemplate in DB?}
    M -- Yes --> N["Substitute placeholders in admin template string"]
    M -- No --> O["Use built-in fallback string"]
    N --> P["Tip.create in DB"]
    O --> P
    K --> P
    P --> Q["Return tips sorted by potentialSavings desc"]

    R["POST /api/ai/saving-tips/:id/action { action: 'pinned'|'dismissed' }"] --> S["setUserTipAction(userId, tipId, action)"]
    S --> T["Verify tip belongs to user"]
    T --> U["TipAction.findOneAndUpdate upsert=true"]
```

---

## 9. Forecast

```mermaid
flowchart TD
    A["GET /api/ai/forecast"] --> B["getNextMonthForecast(userId)"]
    B --> C["Aggregate monthly income and expense totals for last 3 months"]
    C --> D["Calculate moving average for income and expense"]
    D --> E["projectedSavings = projectedIncome - projectedExpense"]
    E --> F["confidence = 'high' if >= 3 months of data; else 'moderate'"]
    F --> G["Return { forecastMonth, projections, confidence, historicalDataPoints }"]
```

---

## 10. Receipt OCR

```mermaid
flowchart TD
    A["POST /api/transactions/scan-receipt (multipart image, 5 MB limit)"] --> B["scanReceiptFile(userId, buffer)"]
    B --> C["buffer.toString('utf-8') — works for text receipts"]
    C --> D["Regex: extract amount (TOTAL: $25.50 pattern)"]
    D --> E["Regex: extract merchant (MERCHANT: name pattern)"]
    E --> F{Regex matched?}
    F -- No --> G["Use fallback mock values: amount=15.00, merchant='Campus Cafe & Bookstore'"]
    F -- Yes --> H["Use extracted values"]
    G --> I["predictCategory(userId, merchantName)"]
    H --> I
    I --> J["Return { scanned, extractedData: { merchant, amount, date, type, suggestedCategoryId } }"]
```

> **Limitation:** The OCR service uses regex on the text content of the buffer, not actual computer-vision OCR. Binary image files will always fall back to mock values.

---

## 11. Bookmarks

```mermaid
sequenceDiagram
    actor C as Student
    participant R as bookmarkRoutes
    participant S as bookmarkService
    participant DB as MongoDB

    C->>R: POST /api/bookmarks { refType, refId, note }
    R->>S: createBookmark(userId, { refType, refId, note })
    S->>DB: Fetch Tip or Insight by refId where user === userId
    alt Item not found or not owned by user
        S-->>R: 404 Error
    end
    S->>DB: Bookmark.create({ user, refType, refId, note })
    alt Duplicate (unique index violation)
        S-->>R: 409 Conflict
    end
    S-->>R: bookmark document
    R->>C: 201 { bookmark }

    C->>R: GET /api/bookmarks
    R->>S: getBookmarks(userId)
    S->>DB: Bookmark.find({ user })
    S->>DB: For each bookmark, fetch from Tip or Insight collection based on refType
    S-->>R: bookmarks with populated ref items
    R->>C: 200 { bookmarks }
```

---

## 12. Admin Actions

```mermaid
flowchart TD
    A["Admin request with jwt cookie"] --> B["requireAuth middleware — verify JWT"]
    B --> C["requireAdmin middleware — check role === 'admin'"]
    C --> D{Endpoint called}
    D --> E["GET /admin/stats — aggregate platform totals (no individual txns)"]
    D --> F["GET /admin/users — list students, no passwordHash, no transactions"]
    D --> G["PATCH /admin/users/:id/status — toggle isActive"]
    D --> H["POST /admin/users/:id/reset-password — generate temp password, return plain once"]
    D --> I["POST/PUT/DELETE /admin/categories — manage system defaults; DELETE blocked if txns reference it unless reassignTo provided"]
    D --> J["POST/PUT/PATCH/DELETE /admin/announcements — manage announcements; PATCH toggles isActive only"]
    D --> K["GET/POST/PUT/DELETE /admin/tip-templates — manage tip text templates used by tips engine"]
```

---

## 13. Activity Log

```mermaid
sequenceDiagram
    actor C as Student
    participant TC as transactionController
    participant AS as activityService
    participant DB as MongoDB (activitylogs)

    Note over TC,AS: On GET /:id (view)
    TC->>AS: logActivity(userId, 'view', txId)  [not awaited]
    AS->>DB: ActivityLog.create({ user, action:'view', entity:'transaction', entityId, at })

    Note over TC,AS: On POST / (create)
    TC->>AS: logActivity(userId, 'create', tx._id) [not awaited]
    AS->>DB: ActivityLog.create(...)

    Note over TC,AS: On PUT /:id (edit)
    TC->>AS: logActivity(userId, 'edit', txId) [not awaited]
    AS->>DB: ActivityLog.create(...)

    C->>DB: GET /api/activity/recent
    DB->>DB: ActivityLog.find({ user }).sort({ at:-1 }).limit(50)
    DB->>DB: Deduplicate by entityId (keep most recent per entity, stop at 10)
    DB->>DB: For each unique entityId, Transaction.findOne({ _id, user, deletedAt:null })
    DB-->>C: Array of { logId, action, at, transaction } — deleted txns silently skipped
```
