
# 09 Templates

## Templates (Student)
### GET `/api/templates`
- **Purpose:** Get all quick-add transaction templates.
- **Success (200):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "tpl1",
        "name": "Morning Coffee",
        "category": { "name": "Food", "icon": "🍔" },
        "amount": 4.50,
        "type": "expense"
      }
    ]
  }
  ```

### POST `/api/templates`
- **Purpose:** Create a new template
- **Payload:** `{"name": "Morning Coffee", "category": "cat1", "type": "expense", "amount": 4.50}`

### PUT `/api/templates/:id`
- **Purpose:** Update template

### DELETE `/api/templates/:id`
- **Purpose:** Delete template
