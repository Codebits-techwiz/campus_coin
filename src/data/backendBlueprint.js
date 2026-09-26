/**
 * Dynamic backend blueprint — har UI button ka purpose, API flow, aur DB schema.
 * Frontend abhi mostly UI + kuch live APIs; ye map backend planning ke liye hai.
 */

export const blueprintSections = [
  {
    id: 'auth',
    title: 'Auth',
    page: '/login · /register · /forgot-password · /admin-login',
    description: 'Login, signup, password reset, admin login, logout',
    items: [
      {
        id: 'login-submit',
        button: 'Sign in',
        page: '/login',
        purpose: 'Student email/password se session banata hai aur /app pe le jata hai.',
        howItWorks:
          'Form validate → POST /api/auth/login (httpOnly JWT cookie) → GET /api/users/profile → AppContext me user/role set → redirect /app.',
        api: { method: 'POST', path: '/api/auth/login' },
        tables: [
          {
            name: 'users',
            columns: [
              'id (PK)',
              'email (UNIQUE)',
              'password_hash',
              'role (student|admin)',
              'status (active|disabled)',
              'full_name',
              'created_at',
              'updated_at',
            ],
          },
          {
            name: 'sessions (optional / cookie-only JWT)',
            columns: ['id', 'user_id (FK)', 'token_jti', 'expires_at', 'created_at'],
          },
        ],
      },
      {
        id: 'register-submit',
        button: 'Create account',
        page: '/register',
        purpose: 'Naya student account create karta hai aur auto-login karta hai.',
        howItWorks:
          'Validate name/email/password → POST /api/auth/register → user row insert (role=student) → cookie set → profile fetch → /app.',
        api: { method: 'POST', path: '/api/auth/register' },
        tables: [
          {
            name: 'users',
            columns: [
              'id',
              'full_name',
              'email',
              'password_hash',
              'role=student',
              'university (optional)',
              'created_at',
            ],
          },
        ],
      },
      {
        id: 'forgot-password',
        button: 'Send reset link',
        page: '/forgot-password',
        purpose: 'Email pe password-reset link bhejta hai (token time-limited).',
        howItWorks:
          'Email submit → POST /api/auth/forgot-password → reset token generate + store → email send. Link pe hit → new password → hash update.',
        api: { method: 'POST', path: '/api/auth/forgot-password' },
        tables: [
          {
            name: 'password_reset_tokens',
            columns: ['id', 'user_id (FK)', 'token_hash', 'expires_at', 'used_at', 'created_at'],
          },
          { name: 'users', columns: ['password_hash (updated on confirm)'] },
        ],
      },
      {
        id: 'admin-login',
        button: 'Admin sign in',
        page: '/admin-login',
        purpose: 'Sirf admin role wale user ko /admin dashboard pe lata hai.',
        howItWorks:
          'POST /api/auth/admin-login → role check (must be admin) → cookie → profile → /admin. Student credentials reject.',
        api: { method: 'POST', path: '/api/auth/admin-login' },
        tables: [
          { name: 'users', columns: ['id', 'email', 'password_hash', 'role=admin', 'status'] },
        ],
      },
      {
        id: 'logout',
        button: 'Logout',
        page: 'Student / Admin sidebar',
        purpose: 'Session khatam karta hai aur public home pe bhejta hai.',
        howItWorks: 'POST /api/auth/logout → cookie clear / session revoke → local state wipe → redirect /.',
        api: { method: 'POST', path: '/api/auth/logout' },
        tables: [
          { name: 'sessions', columns: ['row delete / expires_at set (agar DB sessions use ho)'] },
        ],
      },
    ],
  },
  {
    id: 'student-dashboard',
    title: 'Student · Dashboard',
    page: '/app',
    description: 'Summary cards, recent activity, quick links',
    items: [
      {
        id: 'dash-load',
        button: 'Page load (auto)',
        page: '/app',
        purpose: 'Balance, spending, recent activity dikhata hai.',
        howItWorks:
          'GET /api/dashboard/summary + GET /api/activity/recent → transactions/budgets aggregate karke cards fill.',
        api: { method: 'GET', path: '/api/dashboard/summary · /api/activity/recent' },
        tables: [
          { name: 'transactions', columns: ['user_id', 'type', 'amount', 'category_id', 'created_at'] },
          { name: 'budgets', columns: ['user_id', 'category_id', 'limit_amount', 'month'] },
          {
            name: 'activity_logs (optional)',
            columns: ['id', 'user_id', 'action', 'ref_type', 'ref_id', 'created_at'],
          },
        ],
      },
      {
        id: 'dash-quick-add',
        button: 'Quick Add',
        page: '/app',
        purpose: 'Seedha transactions page pe le jata hai naya entry add karne ke liye.',
        howItWorks: 'Client navigate → /app/transactions (form open optional). Koi naya API nahi.',
        api: { method: '—', path: 'UI navigation only' },
        tables: [],
      },
    ],
  },
  {
    id: 'transactions',
    title: 'Student · Transactions',
    page: '/app/transactions',
    description: 'Income/expense CRUD + filters',
    items: [
      {
        id: 'tx-add-save',
        button: 'Add / Save Transaction',
        page: '/app/transactions',
        purpose: 'Naya income ya expense save karta hai (amount display units me).',
        howItWorks:
          'Form (type, amount, category, description, date) → POST /api/transactions → backend cents convert + insert → list refresh.',
        api: { method: 'POST', path: '/api/transactions' },
        tables: [
          {
            name: 'transactions',
            columns: [
              'id (PK)',
              'user_id (FK)',
              'category_id (FK)',
              'type (income|expense)',
              'amount (INT cents)',
              'description',
              'txn_date',
              'created_at',
              'updated_at',
            ],
          },
        ],
      },
      {
        id: 'tx-edit',
        button: 'Edit (pencil) → Save',
        page: '/app/transactions',
        purpose: 'Maujooda transaction update karta hai.',
        howItWorks: 'Prefill form → PUT /api/transactions/:id → ownership check → update row.',
        api: { method: 'PUT', path: '/api/transactions/:id' },
        tables: [
          { name: 'transactions', columns: ['same columns; updated_at bump'] },
        ],
      },
      {
        id: 'tx-delete',
        button: 'Delete (trash)',
        page: '/app/transactions',
        purpose: 'Transaction permanently hataata hai.',
        howItWorks: 'Confirm → DELETE /api/transactions/:id → soft/hard delete → UI list se remove.',
        api: { method: 'DELETE', path: '/api/transactions/:id' },
        tables: [
          { name: 'transactions', columns: ['row delete ya deleted_at set'] },
        ],
      },
      {
        id: 'tx-ai-category',
        button: 'Apply AI category',
        page: '/app/transactions',
        purpose: 'Description se suggested category auto-select karta hai.',
        howItWorks:
          'Description keywords / AI hint → category_id set in form (client ya POST /api/ai/suggest-category). Save pe normal transaction API.',
        api: { method: 'POST (optional)', path: '/api/ai/suggest-category' },
        tables: [
          { name: 'categories', columns: ['id', 'name', 'keywords (optional)'] },
        ],
      },
    ],
  },
  {
    id: 'categories',
    title: 'Student · Categories',
    page: '/app/categories',
    description: 'User-defined spending/income categories',
    items: [
      {
        id: 'cat-save',
        button: 'Add / Save Category',
        page: '/app/categories',
        purpose: 'Custom category create/update (Food, Transport, etc.).',
        howItWorks:
          'Name + icon/color + type → POST /api/categories ya PUT /api/categories/:id → list refresh.',
        api: { method: 'POST | PUT', path: '/api/categories[/:id]' },
        tables: [
          {
            name: 'categories',
            columns: [
              'id',
              'user_id (NULL = system default)',
              'name',
              'type (income|expense)',
              'icon',
              'color',
              'is_system',
              'created_at',
            ],
          },
        ],
      },
      {
        id: 'cat-delete',
        button: 'Delete Category',
        page: '/app/categories',
        purpose: 'Category hataata hai (agar transactions attached na hon, ya reassign).',
        howItWorks: 'DELETE /api/categories/:id → FK check → delete / block if in use.',
        api: { method: 'DELETE', path: '/api/categories/:id' },
        tables: [
          { name: 'categories', columns: ['row delete'] },
          { name: 'transactions', columns: ['category_id FK constraint'] },
        ],
      },
    ],
  },
  {
    id: 'budgets',
    title: 'Student · Budgets',
    page: '/app/budgets',
    description: 'Monthly category limits + alerts',
    items: [
      {
        id: 'budget-save',
        button: 'Save budget',
        page: '/app/budgets',
        purpose: 'Category pe monthly spending limit set karta hai.',
        howItWorks:
          'Category + limit + month → POST /api/budgets → upsert per user/category/month → progress = sum(expenses).',
        api: { method: 'POST', path: '/api/budgets' },
        tables: [
          {
            name: 'budgets',
            columns: [
              'id',
              'user_id',
              'category_id',
              'limit_amount (cents)',
              'month (YYYY-MM)',
              'created_at',
              'updated_at',
            ],
          },
        ],
      },
      {
        id: 'budget-delete',
        button: 'Delete budget',
        page: '/app/budgets',
        purpose: 'Budget limit hataata hai.',
        howItWorks: 'DELETE /api/budgets/:id → ownership check → delete.',
        api: { method: 'DELETE', path: '/api/budgets/:id' },
        tables: [{ name: 'budgets', columns: ['row delete'] }],
      },
      {
        id: 'notif-read',
        button: 'Mark notification read',
        page: '/app/budgets',
        purpose: 'Budget-alert notification ko read mark karta hai.',
        howItWorks: 'PATCH /api/notifications/:id/read → is_read=true.',
        api: { method: 'PATCH', path: '/api/notifications/:id/read' },
        tables: [
          {
            name: 'notifications',
            columns: [
              'id',
              'user_id',
              'type (budget_alert|announcement|…)',
              'title',
              'body',
              'is_read',
              'created_at',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'reports',
    title: 'Student · Reports',
    page: '/app/reports',
    description: 'Charts, PDF export, email share',
    items: [
      {
        id: 'reports-load',
        button: 'Month range / page load',
        page: '/app/reports',
        purpose: 'Category breakdown, 6-month trend, daily/weekly charts.',
        howItWorks:
          'GET category-breakdown, trend-6months, daily-weekly with ?month= → SQL aggregates on transactions.',
        api: {
          method: 'GET',
          path: '/api/reports/category-breakdown · trend-6months · daily-weekly',
        },
        tables: [
          { name: 'transactions', columns: ['user_id', 'type', 'amount', 'category_id', 'txn_date'] },
          { name: 'categories', columns: ['id', 'name'] },
        ],
      },
      {
        id: 'export-pdf',
        button: 'Export PDF',
        page: '/app/reports',
        purpose: 'Selected month ka report PDF download.',
        howItWorks: 'GET /api/reports/export-pdf?month= → server PDF generate → blob download.',
        api: { method: 'GET', path: '/api/reports/export-pdf?month=' },
        tables: [
          { name: 'transactions + categories', columns: ['read-only aggregate; no new table required'] },
          {
            name: 'report_exports (optional audit)',
            columns: ['id', 'user_id', 'month', 'format=pdf', 'created_at'],
          },
        ],
      },
      {
        id: 'share-email',
        button: 'Share via email',
        page: '/app/reports',
        purpose: 'Report summary email pe bhejta hai.',
        howItWorks: 'POST /api/reports/share-email { month, email? } → render summary → SMTP send.',
        api: { method: 'POST', path: '/api/reports/share-email' },
        tables: [
          {
            name: 'report_shares (optional)',
            columns: ['id', 'user_id', 'month', 'to_email', 'status', 'created_at'],
          },
        ],
      },
    ],
  },
  {
    id: 'insights',
    title: 'Student · Insights & Tips',
    page: '/app/insights',
    description: 'AI monthly insights + saving tips',
    items: [
      {
        id: 'insights-load',
        button: 'Page load',
        page: '/app/insights',
        purpose: 'AI monthly insights aur saving tips dikhata hai.',
        howItWorks:
          'GET /api/ai/monthly-insights + GET /api/ai/saving-tips → spending patterns se tips generate/cache.',
        api: { method: 'GET', path: '/api/ai/monthly-insights · /api/ai/saving-tips' },
        tables: [
          {
            name: 'ai_insights',
            columns: [
              'id',
              'user_id',
              'month',
              'title',
              'body',
              'score',
              'created_at',
            ],
          },
          {
            name: 'saving_tips',
            columns: [
              'id',
              'user_id',
              'title',
              'body',
              'status (active|pinned|dismissed)',
              'created_at',
            ],
          },
        ],
      },
      {
        id: 'bookmark-insight',
        button: 'Bookmark insight',
        page: '/app/insights',
        purpose: 'Insight ko bookmarks me save karta hai.',
        howItWorks: 'POST /api/bookmarks { refType: insight, refId } → unique per user+ref.',
        api: { method: 'POST', path: '/api/bookmarks' },
        tables: [
          {
            name: 'bookmarks',
            columns: [
              'id',
              'user_id',
              'ref_type (insight|tip|…)',
              'ref_id',
              'note',
              'created_at',
              'updated_at',
            ],
          },
        ],
      },
      {
        id: 'pin-tip',
        button: 'Pin tip',
        page: '/app/insights',
        purpose: 'Saving tip ko pinned status deta hai.',
        howItWorks: 'POST /api/ai/saving-tips/:id/pin → status=pinned.',
        api: { method: 'POST', path: '/api/ai/saving-tips/:id/pin' },
        tables: [{ name: 'saving_tips', columns: ['status → pinned'] }],
      },
      {
        id: 'dismiss-tip',
        button: 'Dismiss tip',
        page: '/app/insights',
        purpose: 'Tip hide / dismiss karta hai.',
        howItWorks: 'POST /api/ai/saving-tips/:id/dismiss → status=dismissed.',
        api: { method: 'POST', path: '/api/ai/saving-tips/:id/dismiss' },
        tables: [{ name: 'saving_tips', columns: ['status → dismissed'] }],
      },
    ],
  },
  {
    id: 'bookmarks',
    title: 'Student · Bookmarks',
    page: '/app/bookmarks',
    description: 'Saved insights notes',
    items: [
      {
        id: 'bm-save-note',
        button: 'Save note',
        page: '/app/bookmarks',
        purpose: 'Bookmark pe personal note update.',
        howItWorks: 'PATCH /api/bookmarks/:id { note } → update.',
        api: { method: 'PATCH', path: '/api/bookmarks/:id' },
        tables: [{ name: 'bookmarks', columns: ['note', 'updated_at'] }],
      },
      {
        id: 'bm-delete',
        button: 'Delete bookmark',
        page: '/app/bookmarks',
        purpose: 'Bookmark hataata hai.',
        howItWorks: 'DELETE /api/bookmarks/:id.',
        api: { method: 'DELETE', path: '/api/bookmarks/:id' },
        tables: [{ name: 'bookmarks', columns: ['row delete'] }],
      },
    ],
  },
  {
    id: 'profile',
    title: 'Student · Profile',
    page: '/app/profile',
    description: 'Profile + CSV import (abhi mostly local/mock)',
    items: [
      {
        id: 'profile-save',
        button: 'Save Profile',
        page: '/app/profile',
        purpose: 'Name, university, prefs update (backend me PUT wire karna hai).',
        howItWorks: 'PUT /api/users/profile → users row update. Abhi UI local toast only.',
        api: { method: 'PUT (planned)', path: '/api/users/profile' },
        tables: [
          {
            name: 'users',
            columns: ['full_name', 'university', 'avatar_url', 'locale', 'theme', 'updated_at'],
          },
          {
            name: 'user_preferences (optional)',
            columns: ['user_id', 'font_size', 'currency', 'dark_mode'],
          },
        ],
      },
      {
        id: 'csv-import',
        button: 'Choose CSV file',
        page: '/app/profile',
        purpose: 'Bank CSV se transactions bulk import.',
        howItWorks:
          'Upload CSV → POST /api/transactions/import-csv → parse rows → bulk insert transactions. Abhi demo toast.',
        api: { method: 'POST (planned)', path: '/api/transactions/import-csv' },
        tables: [
          { name: 'transactions', columns: ['bulk insert rows'] },
          {
            name: 'import_jobs (optional)',
            columns: ['id', 'user_id', 'filename', 'status', 'rows_ok', 'rows_fail', 'created_at'],
          },
        ],
      },
    ],
  },
  {
    id: 'admin',
    title: 'Admin panel',
    page: '/admin/*',
    description: 'Abhi mock AppContext — future DB tables',
    items: [
      {
        id: 'admin-users-toggle',
        button: 'Enable / Disable user',
        page: '/admin/users',
        purpose: 'Student account active/disabled toggle.',
        howItWorks: 'PATCH /api/admin/users/:id { status } → users.status update. Abhi local mock.',
        api: { method: 'PATCH (planned)', path: '/api/admin/users/:id' },
        tables: [{ name: 'users', columns: ['status (active|disabled)'] }],
      },
      {
        id: 'admin-reset-pw',
        button: 'Reset password',
        page: '/admin/users',
        purpose: 'Admin temporary password / reset email trigger.',
        howItWorks: 'POST /api/admin/users/:id/reset-password → token/email ya temp hash.',
        api: { method: 'POST (planned)', path: '/api/admin/users/:id/reset-password' },
        tables: [
          { name: 'password_reset_tokens', columns: ['admin-triggered token'] },
          { name: 'users', columns: ['password_hash optional temp'] },
        ],
      },
      {
        id: 'admin-cat-crud',
        button: 'Add / Edit / Delete system category',
        page: '/admin/categories',
        purpose: 'Global default categories manage (sab students ke liye).',
        howItWorks: 'Admin CRUD → categories where is_system=true / user_id NULL.',
        api: { method: 'CRUD (planned)', path: '/api/admin/categories' },
        tables: [
          {
            name: 'categories',
            columns: ['id', 'user_id=NULL', 'name', 'type', 'icon', 'is_system=true'],
          },
        ],
      },
      {
        id: 'admin-announce',
        button: 'Add / Edit / Delete announcement',
        page: '/admin/announcements',
        purpose: 'Campus-wide announcement students ko dikhana.',
        howItWorks: 'CRUD announcements → students GET /api/announcements pe dikhte hain.',
        api: { method: 'CRUD (planned)', path: '/api/admin/announcements' },
        tables: [
          {
            name: 'announcements',
            columns: [
              'id',
              'title',
              'body',
              'is_active',
              'starts_at',
              'ends_at',
              'created_by',
              'created_at',
            ],
          },
        ],
      },
      {
        id: 'admin-stats',
        button: 'Usage stats (charts load)',
        page: '/admin/stats',
        purpose: 'Platform usage: users, txns, active budgets aggregate.',
        howItWorks: 'GET /api/admin/stats → COUNT/SUM queries across users & transactions.',
        api: { method: 'GET (planned)', path: '/api/admin/stats' },
        tables: [
          { name: 'users', columns: ['COUNT by role/status/created_at'] },
          { name: 'transactions', columns: ['COUNT/SUM by day'] },
          { name: 'budgets', columns: ['active count'] },
        ],
      },
    ],
  },
  {
    id: 'public',
    title: 'Public / Marketing',
    page: '/ · Navbar · Footer · Chatbot',
    description: 'Mostly navigation; kuch future APIs',
    items: [
      {
        id: 'cta-register',
        button: 'Get Started Free / Plan CTAs',
        page: 'Home, Features, Pricing…',
        purpose: 'User ko register page pe le jata hai.',
        howItWorks: 'Client Link → /register. Koi DB write nahi jab tak form submit na ho.',
        api: { method: '—', path: 'UI navigation' },
        tables: [],
      },
      {
        id: 'newsletter',
        button: 'Newsletter Subscribe',
        page: 'Home',
        purpose: 'Marketing email list me email add (abhi local success only).',
        howItWorks: 'POST /api/newsletter/subscribe → unique email insert.',
        api: { method: 'POST (planned)', path: '/api/newsletter/subscribe' },
        tables: [
          {
            name: 'newsletter_subscribers',
            columns: ['id', 'email (UNIQUE)', 'source', 'subscribed_at', 'unsubscribed_at'],
          },
        ],
      },
      {
        id: 'faq-chat',
        button: 'FAQ chatbot Send / suggested Q',
        page: 'PublicLayout floating chat',
        purpose: 'FAQ answers dikhata hai (abhi client-side mock).',
        howItWorks:
          'Abhi local FAQ match. Future: POST /api/chat/faq { message } → FAQ / AI reply + optional log.',
        api: { method: 'POST (planned)', path: '/api/chat/faq' },
        tables: [
          {
            name: 'faq_items',
            columns: ['id', 'question', 'answer', 'locale', 'sort_order'],
          },
          {
            name: 'chat_logs (optional)',
            columns: ['id', 'session_id', 'role', 'message', 'created_at'],
          },
        ],
      },
    ],
  },
];

/** Core tables overview — quick reference for DB design */
export const coreTablesOverview = [
  {
    name: 'users',
    why: 'Auth + profile + admin/student roles',
    keyColumns: 'id, email, password_hash, role, status, full_name',
  },
  {
    name: 'categories',
    why: 'System + per-user income/expense labels',
    keyColumns: 'id, user_id, name, type, icon, is_system',
  },
  {
    name: 'transactions',
    why: 'Har income/expense entry',
    keyColumns: 'id, user_id, category_id, type, amount(cents), description, txn_date',
  },
  {
    name: 'budgets',
    why: 'Monthly category spending limits',
    keyColumns: 'id, user_id, category_id, limit_amount, month',
  },
  {
    name: 'notifications',
    why: 'Budget alerts & system messages',
    keyColumns: 'id, user_id, type, title, body, is_read',
  },
  {
    name: 'bookmarks',
    why: 'Saved insights/tips with notes',
    keyColumns: 'id, user_id, ref_type, ref_id, note',
  },
  {
    name: 'ai_insights / saving_tips',
    why: 'AI monthly insights & tip lifecycle',
    keyColumns: 'user_id, month/title/body, status',
  },
  {
    name: 'announcements',
    why: 'Admin campus-wide messages',
    keyColumns: 'title, body, is_active, starts_at, ends_at',
  },
];
