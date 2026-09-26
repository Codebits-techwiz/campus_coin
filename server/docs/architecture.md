# WORKING DRAFT for the team. The final report must be written by the team.

# System Architecture

## Folder Tree
```
server/
├── config/           # Database and Swagger configuration
├── controllers/      # Route handlers and response formatting
├── docs/             # Technical documentation
├── jobs/             # Scheduled cron jobs
├── middleware/       # Express middleware (auth, rate limits, errors)
├── models/           # Mongoose schemas
├── routes/           # Express router definitions
├── scratch/          # Temporary scratch scripts
├── seed/             # Database seeding scripts
├── services/         # Core business logic and database interactions
├── tests/            # Automated test suite and Postman collections
├── utils/            # Shared utilities (currency, email formatting)
├── validators/       # Zod schema definitions
├── .env.example
├── package.json
└── server.js         # Application entry point
```

## Middleware Order (from `server.js`)
1. **helmet()**: Sets secure HTTP headers.
2. **cors()**: Cross-origin resource sharing policy.
3. **express.json()**: Parses incoming JSON payloads.
4. **cookieParser()**: Parses HTTP cookies for JWT auth.
5. **mongoSanitize()**: Strips NoSQL injection payloads (keys containing `$` or `.`).
6. **apiLimiter**: Global rate limiting (100 req / 15 min).
7. **Route-Specific Middleware**:
   - `authLimiter`: Stricter rate limits on auth endpoints.
   - `requireAuth` / `protect`: JWT validation and user injection.
   - `requireAdmin`: Role verification.
   - `validate(schema)` / `validateParams(schema)`: Zod payload validation.
   - `handleUploadMiddleware`: Multer file parsing for CSVs.
8. **Routers**: Mapping requests to Controllers.
9. **404 Handler**: Catches undefined routes.
10. **errorHandler**: Centralized error formatting and unhandled promise rejection catching.
