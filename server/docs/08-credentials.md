# 08 — Seeded Credentials

These accounts are created exactly as coded in [`seed/seed.js`](file:///d:/Campus-coin/server/seed/seed.js). All passwords are hashed with `bcrypt.genSalt(10)` before storage.

---

## User Accounts

| Role | Name | Email | Password (plain) | Academic Year | Monthly Allowance Baseline | Monthly Savings Goal |
|---|---|---|---|---|---|---|
| `admin` | Admin User | `admin@campuscoin.com` | `password123` | Graduate | — (not set) | — (not set) |
| `student` | John Doe | `student@campuscoin.com` | `password123` | Sophomore | $1,500.00 (150000 cents) | $200.00 (20000 cents) |

---

## System Categories (seeded)

| Name | Type | Icon | Colour |
|---|---|---|---|
| Allowance | income | 💰 | `#4caf50` |
| Food | expense | 🍔 | `#ff9800` |
| Transport | expense | 🚌 | `#2196f3` |
| Rent | expense | 🏠 | `#9c27b0` |
| Entertainment | expense | 🎮 | `#e91e63` |

---

## Seeded Announcement

| Title | Message | isActive | Created By |
|---|---|---|---|
| Welcome to Campus Coin! | Track your expenses easily and stay on budget. | `true` | Admin User |

---

## Seeded Transactions (generated, not fixed)

The seed script inserts approximately **132 transactions** (6 months × ~22 per month) for the student account. Each month includes:
- 1 income transaction: $1,500.00 on the 1st (Monthly Allowance)
- 1 expense transaction: $500.00 on the 5th (Hostel Rent)
- 20 random expense transactions: $5.00–$25.00 on random days

Categories for each transaction are randomly selected from the available system categories of the matching type. The exact records differ on each seed run.

---

> **Warning:** These credentials are for development and testing only. Running `npm run seed` in a production environment will **delete all existing data** and replace it with these fixed accounts.
