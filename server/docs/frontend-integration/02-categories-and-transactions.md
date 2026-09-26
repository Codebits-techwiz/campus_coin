
# 02 Categories & Transactions

## Categories (Student)
### GET `/api/categories`
- **Purpose:** Get all categories for user (defaults + custom). Call on initial dashboard load.
- **Success (200):**
  ```json
  {
    "success": true,
    "data": [
      { "_id": "cat1", "name": "Food", "icon": "🍔", "color": "#FF0000", "type": "expense", "isDefault": true }
    ]
  }
  ```

### POST `/api/categories`
- **Purpose:** Create a custom category
- **Payload:** `{"name":"Crypto","type":"income","icon":"🪙","color":"#FFD700"}`
- **Success (201):** Returns created object.

### PUT `/api/categories/:id`
- **Purpose:** Update a custom category. (Cannot update defaults).
- **Payload:** `{"name":"Crypto Edit"}`

### DELETE `/api/categories/:id`
- **Purpose:** Delete a custom category.

---
## Transactions (Student)
### GET `/api/transactions`
- **Purpose:** Get all transactions with filters
- **Query Params (Optional):** `?search=lunch&dateFrom=2026-09-01&dateTo=2026-09-30&page=1&limit=20`
- **Success (200):**
  ```json
  {
    "success": true,
    "data": {
      "transactions": [
        {
          "_id": "tx1",
          "amount": 15.50,
          "category": { "_id": "cat1", "name": "Food" },
          "date": "2026-09-25T12:00:00Z"
        }
      ],
      "pagination": { "total": 1, "page": 1, "pages": 1 }
    }
  }
  ```

### GET `/api/transactions/:id`
- **Purpose:** Get single transaction details. **Side-effect:** Automatically logs an "activity" view in the backend. Call this when opening the details modal.

### POST `/api/transactions`
- **Purpose:** Create transaction
- **Payload:** `{"category":"{{categoryId}}","type":"expense","amount":15.50,"description":"Lunch","date":"2026-09-25T12:00:00Z"}`

### PUT `/api/transactions/:id`
- **Purpose:** Update transaction
- **Payload:** `{"amount":20.00}`

### DELETE `/api/transactions/:id`
- **Purpose:** Soft-delete transaction

---
## Smart Import & OCR (Student)

### POST `/api/transactions/scan-receipt`
- **Purpose:** Upload receipt image for Gemini OCR.
- **Payload:** Form-Data with key `receipt` (File).
- **Success (200):** `{"success":true,"data":{"extractedData":{"amount":25.50,"merchant":"Target","date":"..."}}}`
- **UI Behavior:** Pre-fill the quick-add form with these values so the user can verify them before submitting to `POST /api/transactions`.

### POST `/api/transactions/import-csv/preview`
- **Purpose:** Upload CSV for parsing and AI categorization preview.
- **Payload:** Form-Data with key `file` (File).
- **Success (200):** Returns array of parsed rows in `data.preview`. Some rows will have `aiSuggestedCategory`.
- **UI Behavior:** Display an editable data grid of the rows. Allow the user to fix missing categories.

### POST `/api/transactions/import-csv/confirm`
- **Purpose:** Save the reviewed CSV rows.
- **Payload:** `{"rows":[{"categoryId":"...","type":"expense","amount":20,"date":"2026-10-01"}]}`

---
## Recurring Rules (Student)
### GET, POST, PUT, DELETE `/api/recurring` (and `/:id`)
- **Payload (POST):** `{"category":"...","type":"expense","amount":9.99,"frequency":"monthly","nextRunDate":"2026-10-15T00:00:00.000Z"}`
