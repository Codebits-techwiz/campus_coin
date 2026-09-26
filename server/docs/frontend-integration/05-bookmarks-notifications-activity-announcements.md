
# 05 Bookmarks, Activity, Announcements

## Bookmarks (Student)
### GET, POST, PATCH, DELETE `/api/bookmarks` (and `/:id`)
- **Purpose:** Save a tip or insight for later.
- **Payload (POST):** `{"refType":"tip","refId":"{{tipId}}","note":"Try next week"}`

## Activity (Student)
### GET `/api/activity/recent`
- **Purpose:** Get recently viewed transactions or categories. Good for a "Jump Back In" section.

## Announcements (Student)
### GET `/api/announcements`
- **Purpose:** Shows active system-wide announcements (created by Admins).
