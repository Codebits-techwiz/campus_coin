# Campus Coin - Comprehensive API Testing Guide

WORKING DRAFT for the team. The final report must be written by the team.

This document serves as a strict manual testing flow. Follow the sequence precisely from Step 1 to Step 16. The real responses from earlier steps populate variables required by subsequent steps.

## Special Testing Procedures

### Two-Account Setup (Ownership Testing)

Certain endpoints specify an 'Ownership test'. To run these:

1. Complete the endpoint's primary positive test using your main student account (e.g. `student@campuscoin.com`).

2. Log out via `POST /api/auth/logout`.

3. Log in as a secondary user (e.g. `jane@campuscoin.com` with `password123`).

4. Re-run the endpoint using the ID from the first account and confirm it blocks access (returns 403 or 404).

### Disabled-User Flow

1. Login as Admin (`admin@campuscoin.com`).

2. Target a student user ID via `GET /api/admin/users`.

3. Disable the user via `PATCH /api/admin/users/{{id}}/status` with `{"isActive": false}`.

4. Attempt to log in as the disabled user. Confirm you receive a `403` or `401` error blocking access.

5. If the disabled user had an existing active cookie, attempt any protected route (like `/api/users/profile`). Ensure it is rejected.

### Invalid ObjectId Validation (DEF-001)

Test at least 3 endpoints that take an `:id` param using `"invalid-id"` instead of a 24-character hex string (e.g., `DELETE /api/categories/invalid-id`). Confirm the system correctly maps the CastError to a `400 Invalid ID format` instead of throwing a `500 Internal Server Error`.

### Budget Alert Thresholds

1. Create a transaction using `POST /api/transactions` that exceeds 80% of a defined category budget limit (from seed data).

2. Check `GET /api/notifications` to confirm an 80% warning was generated.

3. Add another transaction pushing the total past 100%. Check notifications to confirm a 100% alert was generated.

### AI Fallback Testing

1. Stop the backend server.

2. Remove or rename the `GEMINI_API_KEY` variable in your `.env` file.

3. Restart the server.

4. Call `GET /api/ai/monthly-insights` or `GET /api/ai/saving-tips`.

5. Confirm the response still returns `200 OK` using fallback logic (e.g., `source: 'template'` or static heuristic generation), avoiding a fatal crash.

---

## 1. Auth

### 1.1 POST /api/auth/register

- **Purpose:** Register a new student account
- **Auth required:** Public
- **Depends on:** None
- **Validator file:** registerSchema
- **Request payload:**
  ```json
  {
    "name": "Test Student",
    "email": "test_register@campuscoin.com",
    "password": "password123"
  }
  ```
- **Success response (201):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "_id": "60d5ec...",
      "name": "Test Student",
      "email": "test_register@campuscoin.com",
      "role": "student"
    }
  }
  ```
- **Error responses:**
  - **400 Validation failed:** {"success":false,"error":"Validation failed","errors":[]}
  - **409 Email exists:** {"success":false,"error":"User already exists"}
- **Test steps:**
  1. Send payload with unused email
  2. Check response for token cookie


### 1.2 POST /api/auth/login

- **Purpose:** Log in as a student
- **Auth required:** Public
- **Depends on:** None
- **Validator file:** loginSchema
- **Request payload:**
  ```json
  {
    "email": "student@campuscoin.com",
    "password": "password123"
  }
  ```
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Logged in successfully",
    "data": {
      "_id": "...",
      "role": "student"
    }
  }
  ```
- **Error responses:**
  - **401 Invalid credentials:** {"success":false,"error":"Invalid email or password"}
- **Test steps:**
  1. Send login payload
  2. Observe 'jwt' cookie set in Postman


### 1.3 POST /api/auth/admin-login

- **Purpose:** Log in as an admin
- **Auth required:** Public
- **Depends on:** None
- **Validator file:** loginSchema
- **Request payload:**
  ```json
  {
    "email": "admin@campuscoin.com",
    "password": "password123"
  }
  ```
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Admin logged in successfully",
    "data": {
      "role": "admin"
    }
  }
  ```
- **Error responses:**
  - **403 Not an admin:** {"success":false,"error":"Access denied. Admin only."}
- **Test steps:**
  1. Send admin login payload
  2. Observe 'jwt' cookie set for admin


### 1.4 POST /api/auth/logout

- **Purpose:** Log out user and clear cookie
- **Auth required:** Public (clears existing cookie)
- **Depends on:** None
- **Validator file:** None
- **Request payload:**
  ```json
  {}
  ```
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send request
  2. Observe 'jwt' cookie is cleared


### 1.5 POST /api/auth/forgot-password

- **Purpose:** Request password reset token (mock email)
- **Auth required:** Public
- **Depends on:** None
- **Validator file:** forgotPasswordSchema
- **Request payload:**
  ```json
  {
    "email": "student@campuscoin.com"
  }
  ```
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Password reset link sent to email",
    "data": {
      "token": "abc123token"
    }
  }
  ```
- **Error responses:**
  - **404 User not found:** {"success":false,"error":"User not found"}
- **Test steps:**
  1. Send email
  2. Copy token from response (since emails are mocked in dev)
  - *Action:* Save `data.token` as `{{resetToken}}` for future steps.


### 1.6 POST /api/auth/reset-password

- **Purpose:** Reset password using token
- **Auth required:** Public
- **Depends on:** 1.5 (resetToken)
- **Validator file:** resetPasswordSchema
- **Request payload:**
  ```json
  {
    "token": "{{resetToken}}",
    "newPassword": "newpassword123"
  }
  ```
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Password has been reset successfully"
  }
  ```
- **Error responses:**
  - **400 Invalid token:** {"success":false,"error":"Invalid or expired reset token"}
- **Test steps:**
  1. Send request with token
  2. Verify success message


## 2. Profile

### 2.1 GET /api/users/profile

- **Purpose:** Get current student profile
- **Auth required:** Student
- **Depends on:** 1.2 (Login as student)
- **Validator file:** None
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Profile retrieved",
    "data": {
      "name": "John Doe",
      "email": "student@campuscoin.com"
    }
  }
  ```
- **Error responses:**
  - **401 Unauthorized:** {"success":false,"error":"Not authorized to access this route"}
- **Test steps:**
  1. Ensure you are logged in as student@campuscoin.com
  2. Send request
  3. Verify data matches profile


### 2.2 PUT /api/users/profile

- **Purpose:** Update student profile
- **Auth required:** Student
- **Depends on:** 1.2 (Login as student)
- **Validator file:** updateProfileSchema
- **Request payload:**
  ```json
  {
    "name": "John Updated",
    "academicYear": "Senior",
    "monthlySavingsGoal": 30000
  }
  ```
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Profile updated successfully",
    "data": {
      "name": "John Updated"
    }
  }
  ```
- **Error responses:**
  - **400 Validation failed:** {"success":false,"error":"Validation failed"}
- **Test steps:**
  1. Send update payload
  2. Verify response data reflects changes


## 3. Categories

### 3.1 GET /api/categories

- **Purpose:** Get all categories for user (defaults + custom)
- **Auth required:** Student
- **Depends on:** 1.2 (Login as student)
- **Validator file:** None
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Categories retrieved successfully",
    "data": [
      {
        "_id": "60d...",
        "name": "Food",
        "isDefault": true
      }
    ]
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send GET request
  2. Observe array of categories
  - *Action:* Save `data[0]._id` as `{{defaultCategoryId}}` for future steps.


### 3.2 POST /api/categories

- **Purpose:** Create a custom category
- **Auth required:** Student
- **Depends on:** 1.2 (Login as student)
- **Validator file:** createCategorySchema
- **Request payload:**
  ```json
  {
    "name": "Crypto Trading",
    "type": "income",
    "icon": "🪙",
    "color": "#FFD700"
  }
  ```
- **Success response (201):**
  ```json
  {
    "success": true,
    "message": "Category created successfully",
    "data": {
      "_id": "abc...",
      "name": "Crypto Trading",
      "isDefault": false
    }
  }
  ```
- **Error responses:**
  - **400 Validation failed:** {"success":false,"error":"Validation failed"}
- **Test steps:**
  1. Send payload
  2. Save new category ID
  - *Action:* Save `data._id` as `{{customCategoryId}}` for future steps.


### 3.3 PUT /api/categories/{{customCategoryId}}

- **Purpose:** Update a custom category
- **Auth required:** Student
- **Depends on:** 3.2 (customCategoryId)
- **Validator file:** updateCategorySchema
- **Request payload:**
  ```json
  {
    "name": "Crypto Trading Edit",
    "color": "#000000"
  }
  ```
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Category updated successfully",
    "data": {
      "name": "Crypto Trading Edit"
    }
  }
  ```
- **Error responses:**
  - **404 Not found:** {"success":false,"error":"Category not found or you do not have permission to modify it"}
  - **400 Invalid ID:** {"success":false,"error":"Invalid ID format"}
- **Test steps:**
  1. Send request with custom category ID
  2. Verify name updated
- **Ownership test:** Repeat this step logged in as the second seeded student and confirm you get 403/404/an empty result, not another student's data.


### 3.4 DELETE /api/categories/{{customCategoryId}}

- **Purpose:** Delete a custom category
- **Auth required:** Student
- **Depends on:** 3.2 (customCategoryId)
- **Validator file:** None
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Category deleted successfully"
  }
  ```
- **Error responses:**
  - **404 Not found:** {"success":false,"error":"Category not found or you do not have permission"}
- **Test steps:**
  1. Send DELETE request
  2. Verify successful deletion message
- **Ownership test:** Repeat this step logged in as the second seeded student and confirm you get 403/404/an empty result, not another student's data.


## 4. Transactions

### 4.1 POST /api/transactions

- **Purpose:** Create a transaction manually
- **Auth required:** Student
- **Depends on:** 3.1 (defaultCategoryId)
- **Validator file:** createTransactionSchema
- **Request payload:**
  ```json
  {
    "category": "{{defaultCategoryId}}",
    "type": "expense",
    "amount": 12.5,
    "description": "Lunch",
    "date": "2026-09-25T12:00:00.000Z"
  }
  ```
- **Success response (201):**
  ```json
  {
    "success": true,
    "message": "Transaction created successfully",
    "data": {
      "_id": "tx1...",
      "amount": 1250
    }
  }
  ```
- **Error responses:**
  - **400 Validation failed:** {"success":false,"error":"Validation failed"}
- **Test steps:**
  1. Send payload with defaultCategoryId
  2. Save transaction ID
  - *Action:* Save `data._id` as `{{transactionId}}` for future steps.


### 4.2 GET /api/transactions

- **Purpose:** Get all transactions with filters
- **Auth required:** Student
- **Depends on:** 1.2 (Login as student)
- **Validator file:** transactionFilterSchema
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Transactions retrieved successfully",
    "data": {
      "transactions": [
        {
          "_id": "tx1..."
        }
      ],
      "pagination": {
        "total": 1
      }
    }
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send GET request
  2. Optionally add ?limit=5&page=1 query params


### 4.3 GET /api/transactions/{{transactionId}}

- **Purpose:** Get single transaction and log view activity
- **Auth required:** Student
- **Depends on:** 4.1 (transactionId)
- **Validator file:** None
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Transaction retrieved successfully",
    "data": {
      "_id": "{{transactionId}}"
    }
  }
  ```
- **Error responses:**
  - **404 Not found:** {"success":false,"error":"Transaction not found"}
- **Test steps:**
  1. Send GET request with transactionId
- **Ownership test:** Repeat this step logged in as the second seeded student and confirm you get 403/404/an empty result, not another student's data.


### 4.4 PUT /api/transactions/{{transactionId}}

- **Purpose:** Update a transaction
- **Auth required:** Student
- **Depends on:** 4.1 (transactionId)
- **Validator file:** updateTransactionSchema
- **Request payload:**
  ```json
  {
    "amount": 15
  }
  ```
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Transaction updated successfully",
    "data": {
      "amount": 1500
    }
  }
  ```
- **Error responses:**
  - **404 Not found:** {"success":false,"error":"Transaction not found"}
- **Test steps:**
  1. Send PUT payload
- **Ownership test:** Repeat this step logged in as the second seeded student and confirm you get 403/404/an empty result, not another student's data.


### 4.5 DELETE /api/transactions/{{transactionId}}

- **Purpose:** Soft-delete a transaction
- **Auth required:** Student
- **Depends on:** 4.1 (transactionId)
- **Validator file:** None
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Transaction deleted successfully"
  }
  ```
- **Error responses:**
  - **404 Not found:** {"success":false,"error":"Transaction not found"}
- **Test steps:**
  1. Send DELETE request
- **Ownership test:** Repeat this step logged in as the second seeded student and confirm you get 403/404/an empty result, not another student's data.


### 4.6 POST /api/transactions/import-csv/preview

- **Purpose:** Preview CSV data and trigger AI categorizer
- **Auth required:** Student
- **Depends on:** 1.2 (Login as student)
- **Validator file:** None (multer)
- **Request payload:** Form-Data ({"file":"buffer.csv"})
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "CSV parsed successfully...",
    "data": {
      "preview": []
    }
  }
  ```
- **Error responses:**
  - **400 Too many rows:** {"success":false,"error":"CSV exceeds maximum allowed limit of 1000 rows."}
- **Test steps:**
  1. Select form-data
  2. Add 'file' key of type File
  3. Upload a sample CSV


### 4.7 POST /api/transactions/import-csv/confirm

- **Purpose:** Confirm and save CSV preview data
- **Auth required:** Student
- **Depends on:** 4.6 (copy preview array)
- **Validator file:** None (custom validation)
- **Request payload:**
  ```json
  {
    "rows": [
      {
        "categoryId": "{{defaultCategoryId}}",
        "type": "expense",
        "amount": 20,
        "date": "2026-10-01",
        "description": "CSV row"
      }
    ]
  }
  ```
- **Success response (201):**
  ```json
  {
    "success": true,
    "message": "Successfully imported 1 transactions from CSV.",
    "data": {
      "importedCount": 1
    }
  }
  ```
- **Error responses:**
  - **400 Invalid category:** {"success":false,"error":"Category ... is invalid or not owned by user."}
- **Test steps:**
  1. Copy the valid rows array from step 4.6 into the 'rows' property of the request body
  2. Send request


### 4.8 POST /api/transactions/scan-receipt

- **Purpose:** Upload receipt image for Gemini OCR extraction
- **Auth required:** Student
- **Depends on:** 1.2 (Login as student)
- **Validator file:** None (multer)
- **Request payload:** Form-Data ({"receipt":"receipt.png"})
- **Success response (200):**
  ```json
  {
    "success": true,
    "data": {
      "extractedData": {
        "amount": 25.5,
        "merchant": "Target"
      }
    }
  }
  ```
- **Error responses:**
  - **422 OCR Failed:** {"success":false,"error":"Could not read receipt"}
- **Test steps:**
  1. Select form-data
  2. Add 'receipt' key of type File
  3. Upload a clear image of a receipt


## 5. Recurring rules

### 5.1 POST /api/recurring

- **Purpose:** Create a recurring transaction rule
- **Auth required:** Student
- **Depends on:** 3.1 (defaultCategoryId)
- **Validator file:** createRecurringRuleSchema
- **Request payload:**
  ```json
  {
    "category": "{{defaultCategoryId}}",
    "type": "expense",
    "amount": 9.99,
    "description": "Spotify",
    "frequency": "monthly",
    "nextRunDate": "2026-10-15T00:00:00.000Z"
  }
  ```
- **Success response (201):**
  ```json
  {
    "success": true,
    "message": "Recurring rule created",
    "data": {
      "_id": "rec1..."
    }
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send POST request
  2. Save recurring rule ID
  - *Action:* Save `data._id` as `{{recurringId}}` for future steps.


### 5.2 GET /api/recurring

- **Purpose:** List all recurring rules
- **Auth required:** Student
- **Depends on:** 1.2 (Login as student)
- **Validator file:** None
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "rec1...",
        "frequency": "monthly"
      }
    ]
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send GET request


### 5.3 PUT /api/recurring/{{recurringId}}

- **Purpose:** Update recurring rule
- **Auth required:** Student
- **Depends on:** 5.1 (recurringId)
- **Validator file:** updateRecurringRuleSchema
- **Request payload:**
  ```json
  {
    "isActive": false
  }
  ```
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Recurring rule updated",
    "data": {
      "isActive": false
    }
  }
  ```
- **Error responses:**
  - **404 Not found:** {"success":false,"error":"Rule not found"}
- **Test steps:**
  1. Send PUT payload
- **Ownership test:** Repeat this step logged in as the second seeded student and confirm you get 403/404/an empty result, not another student's data.


### 5.4 DELETE /api/recurring/{{recurringId}}

- **Purpose:** Delete a recurring rule
- **Auth required:** Student
- **Depends on:** 5.1 (recurringId)
- **Validator file:** None
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Recurring rule deleted"
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send DELETE request
- **Ownership test:** Repeat this step logged in as the second seeded student and confirm you get 403/404/an empty result, not another student's data.


## 6. Budgets

### 6.1 POST /api/budgets

- **Purpose:** Set or update a monthly budget for a category
- **Auth required:** Student
- **Depends on:** 3.1 (defaultCategoryId)
- **Validator file:** setBudgetSchema
- **Request payload:**
  ```json
  {
    "category": "{{defaultCategoryId}}",
    "month": "2026-09",
    "limitAmount": 500
  }
  ```
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Budget set successfully",
    "data": {
      "_id": "bud1..."
    }
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send payload
  2. Save budget ID
  - *Action:* Save `data._id` as `{{budgetId}}` for future steps.


### 6.2 GET /api/budgets

- **Purpose:** Get all budgets for a month (or current month)
- **Auth required:** Student
- **Depends on:** 1.2 (Login as student)
- **Validator file:** budgetQuerySchema
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "bud1...",
        "limitAmount": 50000
      }
    ]
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send GET request
  2. Optionally add ?month=2026-09


### 6.3 DELETE /api/budgets/{{budgetId}}

- **Purpose:** Delete a budget constraint
- **Auth required:** Student
- **Depends on:** 6.1 (budgetId)
- **Validator file:** None
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Budget deleted successfully"
  }
  ```
- **Error responses:**
  - **404 Not found:** {"success":false,"error":"Budget not found"}
- **Test steps:**
  1. Send DELETE request
- **Ownership test:** Repeat this step logged in as the second seeded student and confirm you get 403/404/an empty result, not another student's data.


## 7. Notifications

### 7.1 GET /api/notifications

- **Purpose:** Get user notifications (budget alerts, etc)
- **Auth required:** Student
- **Depends on:** 1.2 (Login as student)
- **Validator file:** None
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "data": {
      "notifications": [
        {
          "_id": "not1...",
          "title": "Budget Alert",
          "isRead": false
        }
      ],
      "unreadCount": 1
    }
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send GET request
  2. Identify an unread notification ID
  - *Action:* Save `data.notifications[0]._id` as `{{notificationId}}` for future steps.


### 7.2 PATCH /api/notifications/{{notificationId}}/read

- **Purpose:** Mark notification as read
- **Auth required:** Student
- **Depends on:** 7.1 (notificationId)
- **Validator file:** None
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Notification marked as read"
  }
  ```
- **Error responses:**
  - **404 Not found:** {"success":false,"error":"Notification not found"}
- **Test steps:**
  1. Send PATCH request
- **Ownership test:** Repeat this step logged in as the second seeded student and confirm you get 403/404/an empty result, not another student's data.


## 8. Dashboard

### 8.1 GET /api/dashboard/summary

- **Purpose:** Get high-level dashboard metrics for the current month
- **Auth required:** Student
- **Depends on:** 1.2 (Login as student)
- **Validator file:** None
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "data": {
      "currentMonth": {
        "income": 150000,
        "expenses": 50000,
        "balance": 100000
      },
      "recentTransactions": []
    }
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send GET request
  2. Observe aggregated totals


## 9. Reports

### 9.1 GET /api/reports/category-breakdown

- **Purpose:** Get expenses grouped by category
- **Auth required:** Student
- **Depends on:** 1.2 (Login as student)
- **Validator file:** reportQuerySchema
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "cat1...",
        "name": "Food",
        "total": 4500
      }
    ]
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send GET request


### 9.2 GET /api/reports/trend-6months

- **Purpose:** Get income vs expense trend over 6 months
- **Auth required:** Student
- **Depends on:** 1.2 (Login as student)
- **Validator file:** None
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "2026-09",
        "income": 150000,
        "expense": 50000
      }
    ]
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send GET request


### 9.3 GET /api/reports/daily-weekly

- **Purpose:** Get daily/weekly spending averages
- **Auth required:** Student
- **Depends on:** 1.2 (Login as student)
- **Validator file:** reportQuerySchema
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "data": {
      "dailyAverage": 1500,
      "weeklyAverage": 10500
    }
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send GET request


### 9.4 GET /api/reports/export-pdf

- **Purpose:** Generate and download a PDF report
- **Auth required:** Student
- **Depends on:** 1.2 (Login as student)
- **Validator file:** reportQuerySchema
- **Request payload:** None
- **Success response (200):**
  ```json
  "<binary PDF stream>"
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send GET request
  2. Click 'Save Response' in Postman to save the PDF file


### 9.5 POST /api/reports/share-email

- **Purpose:** Email monthly report to user
- **Auth required:** Student
- **Depends on:** 1.2 (Login as student)
- **Validator file:** shareEmailSchema
- **Request payload:**
  ```json
  {
    "recipientEmail": "student@campuscoin.com",
    "month": "2026-09"
  }
  ```
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Report sent successfully via email"
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send POST request with email payload


## 10. AI

### 10.1 POST /api/ai/predict-category

- **Purpose:** Predict category based on text description
- **Auth required:** Student
- **Depends on:** 1.2 (Login as student)
- **Validator file:** predictCategorySchema
- **Request payload:**
  ```json
  {
    "description": "Uber ride to campus"
  }
  ```
- **Success response (200):**
  ```json
  {
    "success": true,
    "data": {
      "suggestedCategoryId": "cat1...",
      "categoryName": "Transport",
      "confidence": 0.95
    }
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send payload


### 10.2 POST /api/ai/feedback

- **Purpose:** Submit user correction for AI categorizer
- **Auth required:** Student
- **Depends on:** 3.1 (defaultCategoryId)
- **Validator file:** feedbackSchema
- **Request payload:**
  ```json
  {
    "description": "Uber ride to campus",
    "correctedCategoryId": "{{defaultCategoryId}}"
  }
  ```
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Feedback recorded"
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send payload with correction


### 10.3 GET /api/ai/monthly-insights

- **Purpose:** Get AI-generated narrative insights for the month
- **Auth required:** Student
- **Depends on:** 1.2 (Login as student)
- **Validator file:** monthQuerySchema
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "ins1...",
      "text": "Your spending dropped by 10%...",
      "source": "gemini"
    }
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send GET request
  2. Observe the insight ID
  - *Action:* Save `data._id` as `{{insightId}}` for future steps.


### 10.4 GET /api/ai/monthly-insights/history

- **Purpose:** Get past AI insights history
- **Auth required:** Student
- **Depends on:** 1.2 (Login as student)
- **Validator file:** None
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "ins1...",
        "month": "2026-09"
      }
    ]
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send GET request


### 10.5 GET /api/ai/saving-tips

- **Purpose:** Get contextual AI saving tips
- **Auth required:** Student
- **Depends on:** 1.2 (Login as student)
- **Validator file:** None
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "tip1...",
        "text": "Cut down on food expenses",
        "isPinned": false
      }
    ]
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send GET request
  2. Copy a tip ID
  - *Action:* Save `data[0]._id` as `{{tipId}}` for future steps.


### 10.6 POST /api/ai/saving-tips/{{tipId}}/pin

- **Purpose:** Pin a saving tip to dashboard
- **Auth required:** Student
- **Depends on:** 10.5 (tipId)
- **Validator file:** tipIdParamSchema
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Tip pinned"
  }
  ```
- **Error responses:**
  - **404 Not found:** {"success":false,"error":"Tip not found"}
- **Test steps:**
  1. Send POST request
- **Ownership test:** Repeat this step logged in as the second seeded student and confirm you get 403/404/an empty result, not another student's data.


### 10.7 POST /api/ai/saving-tips/{{tipId}}/dismiss

- **Purpose:** Dismiss a saving tip permanently
- **Auth required:** Student
- **Depends on:** 10.5 (tipId)
- **Validator file:** tipIdParamSchema
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Tip dismissed"
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send POST request
- **Ownership test:** Repeat this step logged in as the second seeded student and confirm you get 403/404/an empty result, not another student's data.


### 10.8 GET /api/ai/forecast

- **Purpose:** Predict next month spending
- **Auth required:** Student
- **Depends on:** 1.2 (Login as student)
- **Validator file:** None
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "data": {
      "predictedExpenses": 52000,
      "expectedSavings": 98000
    }
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send GET request


## 11. Bookmarks

### 11.1 POST /api/bookmarks

- **Purpose:** Bookmark a tip or insight
- **Auth required:** Student
- **Depends on:** 10.5 (tipId)
- **Validator file:** createBookmarkSchema
- **Request payload:**
  ```json
  {
    "refType": "tip",
    "refId": "{{tipId}}",
    "note": "Try this next week"
  }
  ```
- **Success response (201):**
  ```json
  {
    "success": true,
    "message": "Bookmark created successfully",
    "data": {
      "_id": "bk1...",
      "note": "Try this next week"
    }
  }
  ```
- **Error responses:**
  - **409 Duplicate:** {"success":false,"error":"You have already bookmarked this item"}
- **Test steps:**
  1. Send POST payload
  - *Action:* Save `data._id` as `{{bookmarkId}}` for future steps.


### 11.2 GET /api/bookmarks

- **Purpose:** Get all user bookmarks
- **Auth required:** Student
- **Depends on:** 1.2 (Login as student)
- **Validator file:** None
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "bk1...",
        "note": "Try this next week"
      }
    ]
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send GET request


### 11.3 PATCH /api/bookmarks/{{bookmarkId}}

- **Purpose:** Update bookmark note
- **Auth required:** Student
- **Depends on:** 11.1 (bookmarkId)
- **Validator file:** updateBookmarkSchema
- **Request payload:**
  ```json
  {
    "note": "Updated note"
  }
  ```
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Bookmark updated successfully",
    "data": {
      "note": "Updated note"
    }
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send PATCH request
- **Ownership test:** Repeat this step logged in as the second seeded student and confirm you get 403/404/an empty result, not another student's data.


### 11.4 DELETE /api/bookmarks/{{bookmarkId}}

- **Purpose:** Delete bookmark
- **Auth required:** Student
- **Depends on:** 11.1 (bookmarkId)
- **Validator file:** None
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Bookmark deleted successfully"
  }
  ```
- **Error responses:**
  - **404 Not found:** {"success":false,"error":"Bookmark not found"}
- **Test steps:**
  1. Send DELETE request
- **Ownership test:** Repeat this step logged in as the second seeded student and confirm you get 403/404/an empty result, not another student's data.


## 12. Announcements (Student)

### 12.1 GET /api/announcements

- **Purpose:** Get active system announcements
- **Auth required:** Student
- **Depends on:** 1.2 (Login as student)
- **Validator file:** None
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "data": [
      {
        "title": "Welcome",
        "message": "..."
      }
    ]
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send GET request


## 13. Activity

### 13.1 GET /api/activity/recent

- **Purpose:** Get user recently viewed/created items
- **Auth required:** Student
- **Depends on:** 1.2 (Login as student)
- **Validator file:** None
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "data": [
      {
        "action": "view",
        "resourceId": "tx1...",
        "resourceType": "transaction"
      }
    ]
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send GET request (must have viewed a transaction earlier in step 4.3)


## 14. Admin

### 14.1 POST /api/auth/admin-login

- **Purpose:** Login as Admin to acquire admin JWT
- **Auth required:** Public
- **Depends on:** None
- **Validator file:** loginSchema
- **Request payload:**
  ```json
  {
    "email": "admin@campuscoin.com",
    "password": "password123"
  }
  ```
- **Success response (200):**
  ```json
  {
    "success": true,
    "data": {
      "role": "admin"
    }
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Login as admin via Auth route to prepare for following tests


### 14.2 GET /api/admin/stats

- **Purpose:** Get system-wide dashboard stats
- **Auth required:** Admin
- **Depends on:** 14.1 (Admin login)
- **Validator file:** None
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "data": {
      "totalUsers": 4,
      "totalTransactions": 120
    }
  }
  ```
- **Error responses:**
  - **403 Forbidden:** {"success":false,"error":"Access denied. Admin only."}
- **Test steps:**
  1. Send GET request


### 14.3 GET /api/admin/users

- **Purpose:** List all platform users
- **Auth required:** Admin
- **Depends on:** 14.1 (Admin login)
- **Validator file:** None
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "u1...",
        "email": "student@campuscoin.com"
      }
    ]
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send GET request
  2. Copy a student ID to test disabled flow
  - *Action:* Save `data[1]._id` as `{{studentUserId}}` for future steps.


### 14.4 PATCH /api/admin/users/{{studentUserId}}/status

- **Purpose:** Disable or enable a user
- **Auth required:** Admin
- **Depends on:** 14.3 (studentUserId)
- **Validator file:** userStatusSchema
- **Request payload:**
  ```json
  {
    "isActive": false
  }
  ```
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "User status updated",
    "data": {
      "isActive": false
    }
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send PATCH request to disable student


### 14.5 POST /api/admin/users/{{studentUserId}}/reset-password

- **Purpose:** Admin forcibly resets a user password
- **Auth required:** Admin
- **Depends on:** 14.3 (studentUserId)
- **Validator file:** None
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Temporary password generated...",
    "data": {
      "temporaryPassword": "temp..."
    }
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send POST request


### 14.6 POST /api/admin/categories

- **Purpose:** Create a global default category
- **Auth required:** Admin
- **Depends on:** 14.1 (Admin login)
- **Validator file:** createCategorySchema
- **Request payload:**
  ```json
  {
    "name": "System Groceries",
    "type": "expense",
    "icon": "🛒",
    "color": "#FF0000"
  }
  ```
- **Success response (201):**
  ```json
  {
    "success": true,
    "message": "System category created",
    "data": {
      "_id": "sysCat1..."
    }
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send POST request
  - *Action:* Save `data._id` as `{{sysCategoryId}}` for future steps.


### 14.7 PUT /api/admin/categories/{{sysCategoryId}}

- **Purpose:** Update global category
- **Auth required:** Admin
- **Depends on:** 14.6 (sysCategoryId)
- **Validator file:** updateCategorySchema
- **Request payload:**
  ```json
  {
    "name": "System Groceries Edit"
  }
  ```
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "System category updated"
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send PUT request


### 14.8 DELETE /api/admin/categories/{{sysCategoryId}}

- **Purpose:** Delete global category
- **Auth required:** Admin
- **Depends on:** 14.6 (sysCategoryId)
- **Validator file:** deleteCategorySchema
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "System category deleted"
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send DELETE request


### 14.9 POST /api/admin/announcements

- **Purpose:** Create system announcement
- **Auth required:** Admin
- **Depends on:** 14.1 (Admin login)
- **Validator file:** createAnnouncementSchema
- **Request payload:**
  ```json
  {
    "title": "Maintenance",
    "message": "Server down at midnight"
  }
  ```
- **Success response (201):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "ann1..."
    }
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send POST payload
  - *Action:* Save `data._id` as `{{announcementId}}` for future steps.


### 14.10 GET /api/admin/announcements

- **Purpose:** Get all announcements (active + inactive)
- **Auth required:** Admin
- **Depends on:** 14.1 (Admin login)
- **Validator file:** None
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "ann1..."
      }
    ]
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send GET request


### 14.11 PUT /api/admin/announcements/{{announcementId}}

- **Purpose:** Edit announcement
- **Auth required:** Admin
- **Depends on:** 14.9 (announcementId)
- **Validator file:** updateAnnouncementSchema
- **Request payload:**
  ```json
  {
    "title": "Maintenance Update"
  }
  ```
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Announcement updated"
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send PUT payload


### 14.12 PATCH /api/admin/announcements/{{announcementId}}

- **Purpose:** Toggle announcement active status
- **Auth required:** Admin
- **Depends on:** 14.9 (announcementId)
- **Validator file:** toggleAnnouncementSchema
- **Request payload:**
  ```json
  {
    "isActive": false
  }
  ```
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Announcement deactivated"
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send PATCH payload


### 14.13 DELETE /api/admin/announcements/{{announcementId}}

- **Purpose:** Delete announcement
- **Auth required:** Admin
- **Depends on:** 14.9 (announcementId)
- **Validator file:** None
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Announcement deleted"
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send DELETE request


### 14.14 POST /api/admin/tip-templates

- **Purpose:** Create generative AI tip template
- **Auth required:** Admin
- **Depends on:** 14.1 (Admin login)
- **Validator file:** createTipTemplateSchema
- **Request payload:**
  ```json
  {
    "ruleType": "spending_spike",
    "template": "Consider reducing your {{category}} spending next week."
  }
  ```
- **Success response (201):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "tpl1..."
    }
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send POST request
  - *Action:* Save `data._id` as `{{templateId}}` for future steps.


### 14.15 GET /api/admin/tip-templates

- **Purpose:** Get all AI tip templates
- **Auth required:** Admin
- **Depends on:** 14.1 (Admin login)
- **Validator file:** None
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "tpl1..."
      }
    ]
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send GET request


### 14.16 PUT /api/admin/tip-templates/{{templateId}}

- **Purpose:** Edit AI tip template
- **Auth required:** Admin
- **Depends on:** 14.14 (templateId)
- **Validator file:** updateTipTemplateSchema
- **Request payload:**
  ```json
  {
    "isActive": false
  }
  ```
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Tip template updated"
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send PUT request


### 14.17 DELETE /api/admin/tip-templates/{{templateId}}

- **Purpose:** Delete AI tip template
- **Auth required:** Admin
- **Depends on:** 14.14 (templateId)
- **Validator file:** None
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Tip template deleted"
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send DELETE request


## 15. Templates

### 15.1 POST /api/templates

- **Purpose:** Create a quick-entry transaction template
- **Auth required:** Student
- **Depends on:** 1.2 (Login as student) & 3.1 (defaultCategoryId)
- **Validator file:** createTemplateSchema
- **Request payload:**
  ```json
  {
    "name": "Morning Coffee",
    "category": "{{defaultCategoryId}}",
    "type": "expense",
    "amount": 4.5
  }
  ```
- **Success response (201):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "tt1..."
    }
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Ensure you are logged back in as student (login as jane@campuscoin.com if student was disabled)
  2. Send POST request
  - *Action:* Save `data._id` as `{{txTemplateId}}` for future steps.


### 15.2 GET /api/templates

- **Purpose:** Get all user templates
- **Auth required:** Student
- **Depends on:** 15.1 (txTemplateId)
- **Validator file:** None
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "tt1..."
      }
    ]
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send GET request


### 15.3 PUT /api/templates/{{txTemplateId}}

- **Purpose:** Edit transaction template
- **Auth required:** Student
- **Depends on:** 15.1 (txTemplateId)
- **Validator file:** updateTemplateSchema
- **Request payload:**
  ```json
  {
    "amount": 5
  }
  ```
- **Success response (200):**
  ```json
  {
    "success": true,
    "data": {
      "amount": 500
    }
  }
  ```
- **Error responses:**
  - **404 Not found:** {"success":false,"error":"Template not found"}
- **Test steps:**
  1. Send PUT request
- **Ownership test:** Repeat this step logged in as the second seeded student and confirm you get 403/404/an empty result, not another student's data.


### 15.4 DELETE /api/templates/{{txTemplateId}}

- **Purpose:** Delete transaction template
- **Auth required:** Student
- **Depends on:** 15.1 (txTemplateId)
- **Validator file:** None
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Template deleted"
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send DELETE request
- **Ownership test:** Repeat this step logged in as the second seeded student and confirm you get 403/404/an empty result, not another student's data.


## 16. Health

### 16.1 GET /api/health

- **Purpose:** API status and DB connectivity check
- **Auth required:** Public
- **Depends on:** None
- **Validator file:** None
- **Request payload:** None
- **Success response (200):**
  ```json
  {
    "status": "online",
    "database": "connected",
    "version": "1.0.0"
  }
  ```
- **Error responses:** Validation errors only (400)
- **Test steps:**
  1. Send GET request
  2. Verify 'online' status


## Quick Reference

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | /api/auth/register | Public | Register a new student account |
| POST | /api/auth/login | Public | Log in as a student |
| POST | /api/auth/admin-login | Public | Log in as an admin |
| POST | /api/auth/logout | Public | Log out user and clear cookie |
| POST | /api/auth/forgot-password | Public | Request password reset token (mock email) |
| POST | /api/auth/reset-password | Public | Reset password using token |
| GET | /api/users/profile | Student | Get current student profile |
| PUT | /api/users/profile | Student | Update student profile |
| GET | /api/categories | Student | Get all categories for user (defaults + custom) |
| POST | /api/categories | Student | Create a custom category |
| PUT | /api/categories/{{customCategoryId}} | Student | Update a custom category |
| DELETE | /api/categories/{{customCategoryId}} | Student | Delete a custom category |
| POST | /api/transactions | Student | Create a transaction manually |
| GET | /api/transactions | Student | Get all transactions with filters |
| GET | /api/transactions/{{transactionId}} | Student | Get single transaction and log view activity |
| PUT | /api/transactions/{{transactionId}} | Student | Update a transaction |
| DELETE | /api/transactions/{{transactionId}} | Student | Soft-delete a transaction |
| POST | /api/transactions/import-csv/preview | Student | Preview CSV data and trigger AI categorizer |
| POST | /api/transactions/import-csv/confirm | Student | Confirm and save CSV preview data |
| POST | /api/transactions/scan-receipt | Student | Upload receipt image for Gemini OCR extraction |
| POST | /api/recurring | Student | Create a recurring transaction rule |
| GET | /api/recurring | Student | List all recurring rules |
| PUT | /api/recurring/{{recurringId}} | Student | Update recurring rule |
| DELETE | /api/recurring/{{recurringId}} | Student | Delete a recurring rule |
| POST | /api/budgets | Student | Set or update a monthly budget for a category |
| GET | /api/budgets | Student | Get all budgets for a month (or current month) |
| DELETE | /api/budgets/{{budgetId}} | Student | Delete a budget constraint |
| GET | /api/notifications | Student | Get user notifications (budget alerts, etc) |
| PATCH | /api/notifications/{{notificationId}}/read | Student | Mark notification as read |
| GET | /api/dashboard/summary | Student | Get high-level dashboard metrics for the current month |
| GET | /api/reports/category-breakdown | Student | Get expenses grouped by category |
| GET | /api/reports/trend-6months | Student | Get income vs expense trend over 6 months |
| GET | /api/reports/daily-weekly | Student | Get daily/weekly spending averages |
| GET | /api/reports/export-pdf | Student | Generate and download a PDF report |
| POST | /api/reports/share-email | Student | Email monthly report to user |
| POST | /api/ai/predict-category | Student | Predict category based on text description |
| POST | /api/ai/feedback | Student | Submit user correction for AI categorizer |
| GET | /api/ai/monthly-insights | Student | Get AI-generated narrative insights for the month |
| GET | /api/ai/monthly-insights/history | Student | Get past AI insights history |
| GET | /api/ai/saving-tips | Student | Get contextual AI saving tips |
| POST | /api/ai/saving-tips/{{tipId}}/pin | Student | Pin a saving tip to dashboard |
| POST | /api/ai/saving-tips/{{tipId}}/dismiss | Student | Dismiss a saving tip permanently |
| GET | /api/ai/forecast | Student | Predict next month spending |
| POST | /api/bookmarks | Student | Bookmark a tip or insight |
| GET | /api/bookmarks | Student | Get all user bookmarks |
| PATCH | /api/bookmarks/{{bookmarkId}} | Student | Update bookmark note |
| DELETE | /api/bookmarks/{{bookmarkId}} | Student | Delete bookmark |
| GET | /api/announcements | Student | Get active system announcements |
| GET | /api/activity/recent | Student | Get user recently viewed/created items |
| POST | /api/auth/admin-login | Public | Login as Admin to acquire admin JWT |
| GET | /api/admin/stats | Admin | Get system-wide dashboard stats |
| GET | /api/admin/users | Admin | List all platform users |
| PATCH | /api/admin/users/{{studentUserId}}/status | Admin | Disable or enable a user |
| POST | /api/admin/users/{{studentUserId}}/reset-password | Admin | Admin forcibly resets a user password |
| POST | /api/admin/categories | Admin | Create a global default category |
| PUT | /api/admin/categories/{{sysCategoryId}} | Admin | Update global category |
| DELETE | /api/admin/categories/{{sysCategoryId}} | Admin | Delete global category |
| POST | /api/admin/announcements | Admin | Create system announcement |
| GET | /api/admin/announcements | Admin | Get all announcements (active + inactive) |
| PUT | /api/admin/announcements/{{announcementId}} | Admin | Edit announcement |
| PATCH | /api/admin/announcements/{{announcementId}} | Admin | Toggle announcement active status |
| DELETE | /api/admin/announcements/{{announcementId}} | Admin | Delete announcement |
| POST | /api/admin/tip-templates | Admin | Create generative AI tip template |
| GET | /api/admin/tip-templates | Admin | Get all AI tip templates |
| PUT | /api/admin/tip-templates/{{templateId}} | Admin | Edit AI tip template |
| DELETE | /api/admin/tip-templates/{{templateId}} | Admin | Delete AI tip template |
| POST | /api/templates | Student | Create a quick-entry transaction template |
| GET | /api/templates | Student | Get all user templates |
| PUT | /api/templates/{{txTemplateId}} | Student | Edit transaction template |
| DELETE | /api/templates/{{txTemplateId}} | Student | Delete transaction template |
| GET | /api/health | Public | API status and DB connectivity check |

**Total routes documented:** 71
**Ambiguous routes:** None (All endpoints successfully matched with validators and controller logic).
