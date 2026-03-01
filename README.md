# Terezo Wallet - Expanded Professional MVP scaffold

This project contains an expanded scaffold for the Terezo Wallet MVP: backend (Express + Prisma + PostgreSQL-ready) and frontend (Next.js app router).

## Quickstart

### Backend
1. cd backend
2. npm install
3. cp .env.example .env
4. npx prisma generate
5. npm run db:push
   - creates/updates tables in your configured PostgreSQL database
6. npm run seed
   - seeds Funds, Tasks (4 demo tasks), MembershipCodes including default code `GLS07032256`
   - creates an admin account `admin@example.com` / `admin123`
   - also creates a demo user `user@example.com` / `test123` with sample balance and submission
7. npm run dev

### Frontend
1. cd frontend
2. npm install
3. cp .env.example .env.local
3. npm run dev

Frontend expects backend at http://localhost:5000

## Vercel Deploy Notes (Frontend + Backend + Admin Users)

### 1. Create database
1. In Vercel, create a Postgres database.
2. Copy `DATABASE_URL`.

### 2. Deploy backend (`/backend` project)
1. Create a Vercel project from the `backend` directory.
2. Set environment variables:
   - `DATABASE_URL=<your-vercel-postgres-url>`
   - `JWT_SECRET=<strong-random-secret>`
   - `CORS_ORIGINS=https://your-frontend-domain.vercel.app`
3. Deploy.

Backend entry for Vercel serverless is `backend/api/index.js` and routes are configured in `backend/vercel.json`.

### 3. Prepare database schema + seed data
Run these from `backend` against the production database URL:
1. `npm run prisma:generate`
2. `npm run db:push`
3. `npm run seed`

This creates the admin user:
- `admin@example.com`
- `admin123`

### 4. Deploy frontend (`/frontend` project)
1. Create a Vercel project from the `frontend` directory.
2. Set:
   - `NEXT_PUBLIC_API_BASE=https://your-backend-domain.vercel.app`
3. Deploy.

### 5. Test admin
1. Login at frontend with admin credentials.
2. Open `/admin`.
3. Admin dashboard fetches user details from `/api/admin/users` (email, phone, admin/member flags, balance, pending balance, kyc status, joined date).

## What was added
- Prisma schema with Funds, Transactions, TaskSubmissions, MembershipCodes
- Seed script for tasks, funds and membership code
- Auth routes, tasks routes, membership, admin endpoints
- Frontend with multiple pages, responsive styles, progress tracker, task list, membership redeem page
- Basic CSS theme: white interior + navy + gold accents

This scaffold is meant for local development and iteration. Next steps: integrate payments (Paystack/Flutterwave), implement KYC file uploads, add OTP/email integration, production‑grade admin roles, and add automated verification webhooks for Telegram.
