# WORKING DRAFT for the team. The final report must be written by the team.

# Seeded Credentials

When running `npm run seed`, the database is completely wiped and populated with the following baseline accounts for immediate testing.

| Role | Name | Email | Password | Pre-seeded Data? |
|---|---|---|---|---|
| Admin | Campus Coin Admin | admin@campuscoin.com | admin123 | None |
| Student | John Doe | student@campuscoin.com | password123 | High (Transactions, Budgets, Tips) |
| Student | Jane Smith | jane@example.com | password123 | Medium (Different isolated data) |
| Student | Bob Disabled | disabled@example.com | password123 | None (Account is `isActive: false`) |
