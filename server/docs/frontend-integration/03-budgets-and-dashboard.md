
# 03 Budgets & Dashboard

## Dashboard Summary (Student)
### GET `/api/dashboard/summary`
- **Purpose:** High-level metrics for dashboard (Income/Expense/Balance + Recent Txs).
- **Success (200):**
  ```json
  {
      "greeting": "Hello, John Doe!",
      "user": { "name": "John Doe", "academicYear": "Sophomore", "currency": "USD" },
      "month": "2026-09",
      "totals": { "income": 6778, "expense": 5498.76, "balance": 1279.24 },
      "topCategory": { "id": "6ab...", "name": "Hostel/Rent", "icon": "🏠", "color": "#9c27b0", "amount": 2500 },
      "budgetVsActual": [
        {
          "category": { "name": "Food", "icon": "🍔", "color": "#ff9800", "type": "expense" },
          "month": "2026-09",
          "limitAmount": 200,
          "currentSpent": 592.31,
          "remaining": 0,
          "percentageUsed": 296.2
        }
      ],
      "topTips": [
        {
          "ruleType": "spending_spike",
          "text": "Your Food spending is >120% of your 3-month baseline. Cutting back could save up to $560.78.",
          "potentialSavings": 560.78
        }
      ]
    }
  }
  ```

## Budgets (Student)
### GET `/api/budgets`
- **Query Params:** `?month=2026-09`
- **Purpose:** Shows limits vs actuals so you can draw progress bars.
- **Success (200):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "bud1",
        "limitAmount": 500.00,
        "currentSpent": 450.00,
        "category": { "name": "Food" }
      }
    ]
  }
  ```

### POST `/api/budgets`
- **Payload:** `{"category":"{{categoryId}}","month":"2026-09","limitAmount":500.00}`

### DELETE `/api/budgets/:id`

## Notifications (Student)
### GET `/api/notifications`
- **Purpose:** Polled to get budget alerts and anomaly warnings.
- **Success (200):**
  ```json
  {
    "success": true,
    "data": {
      "notifications": [
        {
          "_id": "not1",
          "title": "Budget Alert",
          "message": "You reached 80% of Food budget",
          "type": "budget_alert",
          "isRead": false
        }
      ],
      "unreadCount": 1
    }
  }
  ```

### PATCH `/api/notifications/:id/read`
- **Purpose:** Mark as read.
