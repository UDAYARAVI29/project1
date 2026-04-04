# Finance Data Processing and Access Control Backend

This repository is a fresh backend assignment project organized with a familiar `client/` and `server/` structure. The implementation focuses on correctness, maintainability, role-based access control, financial record processing, and dashboard analytics.

## Project Structure

```text
BioGraph2/
  client/
  server/
    prisma/
    src/
      config/
      controllers/
      docs/
      middleware/
      routes/
      services/
      utils/
      validations/
```

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT authentication
- Zod validation
- Swagger UI

## Implemented Features

- User and role management
- Financial records CRUD
- Record filtering by date, category, and type
- Dashboard summary API with totals, category totals, monthly trends, and recent activity
- Role-based access control
- Input validation and error handling
- Persistent relational data storage using PostgreSQL

## Role Permissions

- `VIEWER`: can access dashboard summary
- `ANALYST`: can view records and dashboard summary
- `ADMIN`: full access to users, records, and dashboard summary

## Backend Setup

1. Open the `server/` folder
2. Install dependencies with `npm install`
3. Create `.env` from `.env.example`
4. Make sure PostgreSQL is running and create a database named `finance_dashboard`
5. Update `DATABASE_URL` if your local PostgreSQL port is different from the sample `.env`
6. Run `npm run db:init`
7. Run `npm run seed`
8. Start the server with `npm run dev`

The API will run on `http://localhost:4000`.

## Frontend Setup

1. Open the `client/` folder
2. Run `npm start`

The frontend will run on `http://localhost:3000` and talks to the backend at `http://localhost:4000` by default.

## Run The Full Project Locally

1. Start the backend from `server/`
```bash
npm install
npm run db:init
npm run seed
npm run dev
```

2. Start the frontend from `client/`
```bash
npm start
```

3. Open `http://localhost:3000`

## Important URLs

- Health: `GET /api/health`
- Docs: `GET /api/docs`
- Frontend: `http://localhost:3000`

## Demo Credentials

- `admin@finance.local` / `Password@123`
- `analyst@finance.local` / `Password@123`
- `viewer@finance.local` / `Password@123`

## Main Endpoints

- `POST /api/auth/login`
- `GET /api/users`
- `POST /api/users`
- `PATCH /api/users/:id`
- `GET /api/records`
- `GET /api/records/:id`
- `POST /api/records`
- `PATCH /api/records/:id`
- `DELETE /api/records/:id`
- `GET /api/dashboard/summary`

## Submission Targets

For the final assignment submission:

- GitHub repository URL: `https://github.com/UDAYARAVI29/project1`
- Live demo or deployed API documentation URL: `To be added after deployment`

## Note on Persistence

This version uses PostgreSQL with Prisma as the persistence layer. The schema lives in `server/prisma/schema.prisma`, the database is synchronized with `npm run db:init`, and demo data is loaded with `npm run seed`.

## Technical Decisions

- `Node.js + Express` was chosen to keep the backend structure familiar, fast to develop, and easy to explain in an interview setting.
- `PostgreSQL + Prisma` was chosen to provide real relational persistence with a clear schema, type-safe data access, and a code style consistent with the earlier BioGraph project.
- `JWT authentication` keeps the auth flow simple for a take-home assignment while still demonstrating protected routes and role enforcement.
- `Zod validation` keeps request validation explicit and colocated with each feature boundary.
- A `routes -> controllers -> services` structure keeps transport, business logic, and persistence concerns separated.
- A single dashboard summary endpoint was used to keep the analytics API compact while still covering totals, trends, categories, and recent activity.

## Trade-offs

- JWTs are simple to demo, but role/status changes are enforced based on the token payload for the current session instead of reloading the user from the database on every request.
- `prisma db push` was chosen for fast setup in an assignment environment, but formal Prisma migrations would be stronger for long-term production workflows.
- Dashboard aggregation is currently performed in service logic after loading records, which is easier to understand but less scalable than pushing more aggregation into SQL.
- Swagger documentation is manually defined, which is straightforward and explicit, but requires more maintenance than generated docs.
- The frontend was added to improve usability and presentation, but the assignment is still primarily evaluated as a backend project.

## Recommended Hosting

- Recommended platform: Render
- Why: Render supports Node web services, static sites, and managed PostgreSQL on the same platform, which makes this project simple to deploy and demonstrate end to end.
- Frontend option: Render Static Site
- Backend option: Render Web Service
- Database option: Render Postgres
