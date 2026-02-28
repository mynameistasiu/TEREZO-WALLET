# Terezo Wallet - Expanded Professional MVP scaffold

This project contains an expanded scaffold for the Terezo Wallet MVP: backend (Express + Prisma + SQLite) and frontend (Next.js app router).

## Quickstart

### Backend
1. cd backend
2. npm install
3. cp .env.example .env
4. npx prisma generate
5. npx prisma migrate dev --name init
   - ensures new tables (User.balance, Withdrawal, ManualPayment, etc.) are created
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

## Deploy Notes (Important)

If login/register works on PC but fails on phone after deploy, your frontend is likely still pointing to localhost.

1. Deploy backend to a public host (Render, Railway, VPS, etc.)
2. Set backend `CORS_ORIGINS` in `backend/.env`:
   - Example: `CORS_ORIGINS="https://your-app.netlify.app,https://yourdomain.com"`
3. In Netlify (or your frontend host), set:
   - `NEXT_PUBLIC_API_BASE=https://your-backend-domain.com`
4. Redeploy frontend after changing environment variables.

You can test backend from phone/browser with:
- `https://your-backend-domain.com/health`

## What was added
- Prisma schema with Funds, Transactions, TaskSubmissions, MembershipCodes
- Seed script for tasks, funds and membership code
- Auth routes, tasks routes, membership, admin endpoints
- Frontend with multiple pages, responsive styles, progress tracker, task list, membership redeem page
- Basic CSS theme: white interior + navy + gold accents

This scaffold is meant for local development and iteration. Next steps: integrate payments (Paystack/Flutterwave), implement KYC file uploads, add OTP/email integration, production‑grade admin roles, and add automated verification webhooks for Telegram.
