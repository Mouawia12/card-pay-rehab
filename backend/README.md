# Card Pay Backend

A lightweight Express + Prisma API that powers the Rehab.sa dashboard. It exposes authentication, cards, customers and health endpoints that align with the Vite frontend under `Rehabsa-Fullsa-main`.

## Getting started

```bash
cd backend
cp .env.example .env # update secrets as needed
npm install
npx prisma migrate dev --name init
npm run dev
```

### Seeding data

```bash
npx prisma db seed
```

This creates an admin user (`admin@rehab.sa` / `password123`), three customers and sample cards.

## Environment variables

| Name | Description |
| --- | --- |
| `DATABASE_URL` | Prisma connection string. Uses SQLite by default but supports MySQL or PostgreSQL. |
| `JWT_SECRET` | Secret used to sign short-lived access tokens. |
| `ALLOWED_ORIGINS` | Comma separated origins for CORS. |

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the API with hot reload via `tsx`. |
| `npm run build` | Outputs the compiled JavaScript into `dist`. |
| `npm start` | Runs the compiled server (after `npm run build`). |
| `npm run lint` | ESLint using the shared config in `package.json`. |

## API overview

All endpoints are prefixed with `/api`.

- `POST /api/auth/login` – Authenticate and receive a JWT token.
- `GET /api/cards` – Paginated cards listing with filtering and search.
- `GET /api/customers` – Paginated customers with their recent cards.
- `GET /api/health` – Simple readiness probe.

Protected endpoints require the `Authorization: Bearer <token>` header.
