# 06 Admin Panel

**Note:** Admins have a globally distinct view. They cannot see individual student transactions, but they can see aggregated stats and manage users, categories, announcements, and tip templates.

---

## Admin (Admin Only)

**Base path:** `/api/admin`

### 1. GET `/stats`
Retrieves platform-wide statistics (active users, transaction volume, top categories).
- **Request:** None
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Admin stats retrieved",
    "data": {
      "totalUsers": 4,
      "totalTransactions": 120,
      "totalVolume": 45000.50,
      "topCategories": [
        { "_id": "food_id", "name": "Food", "count": 45 },
        { "_id": "rent_id", "name": "Rent", "count": 12 }
      ]
    }
  }
  ```

### 2. GET `/users`
Retrieves a list of all student accounts (excluding their private transaction data).
- **Request:** None
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Users retrieved",
    "data": [
      {
        "_id": "67425f11...",
        "name": "Jane Doe",
        "email": "jane@campuscoin.com",
        "role": "student",
        "isActive": true,
        "createdAt": "2026-09-25T10:00:00.000Z"
      }
    ]
  }
  ```

### 3. PATCH `/users/:id/status`
Enables or disables a student account. Disabling a user prevents them from logging in.
- **Request Body:**
  ```json
  {
    "isActive": false
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "User status updated successfully",
    "data": {
      "_id": "67425f11...",
      "isActive": false
    }
  }
  ```

### 4. POST `/users/:id/reset-password`
Generates a one-time temporary password for a student. **Security Note:** This returns the plain-text password exactly ONCE.
- **Request Body:** None
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Temporary password generated",
    "data": {
      "temporaryPassword": "temp-password-12345"
    }
  }
  ```

### 5. Categories Management
Manage system-wide default categories that all students receive when they sign up.

#### POST `/categories`
- **Request Body:**
  ```json
  {
    "name": "Tuition",
    "type": "expense",
    "icon": "🎓",
    "color": "#8bc34a"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "System category created",
    "data": {
      "_id": "new_cat_id",
      "name": "Tuition",
      "isDefault": true
    }
  }
  ```

#### PUT `/categories/:id`
- **Request Body:** Same as POST.
- **Response (200 OK):** Updated category object.

#### DELETE `/categories/:id?reassignTo=some_other_id`
Deletes a system category. Optional `reassignTo` query parameter migrates existing transactions to another category before deletion.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "System category deleted successfully"
  }
  ```

### 6. Announcements Management
Manage announcements visible to students on their dashboard.

#### GET `/announcements`
Retrieves all announcements, including inactive ones (unlike the student route which only fetches active ones).
- **Response (200 OK):** Array of announcements.

#### POST `/announcements`
- **Request Body:**
  ```json
  {
    "title": "Scheduled Maintenance",
    "message": "The system will be down for 2 hours.",
    "type": "warning",
    "isActive": true
  }
  ```
- **Response (201 Created):** Created announcement object.

#### PUT `/announcements/:id`
Full update of an announcement. (Request body matches POST).

#### PATCH `/announcements/:id`
Toggle the `isActive` status of an announcement.
- **Request Body:**
  ```json
  {
    "isActive": false
  }
  ```

#### DELETE `/announcements/:id`
Permanently deletes an announcement.

### 7. Tip Templates Management
Manage templates used by the AI engine to generate contextual saving tips.

#### GET `/tip-templates`
Retrieves all tip templates.

#### POST `/tip-templates`
- **Request Body:**
  ```json
  {
    "ruleType": "spending_spike",
    "template": "We noticed a spike in your {{category}} spending. Try cooking at home!"
  }
  ```
- **Response (201 Created):** Created template object.

#### PUT `/tip-templates/:id`
Update an existing template.

#### DELETE `/tip-templates/:id`
Deletes a template.
