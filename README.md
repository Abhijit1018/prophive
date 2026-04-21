# PropHive

Real estate platform — buy, sell, rent properties in Jaipur, Delhi, Gurugram.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 App Router + TypeScript + Tailwind CSS + shadcn/ui |
| Database | PostgreSQL via Prisma ORM |
| Auth | NextAuth.js v5 (JWT, credentials) |
| Payments | Razorpay (subscriptions) |
| Maps | Mapbox GL JS |
| Storage | Cloudinary |
| Email | Resend |

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env.local
# Fill in DATABASE_URL, NEXTAUTH_SECRET, and service keys
```

3. Setup database:
```bash
npx prisma migrate dev
npx prisma db seed
```

4. Run:
```bash
npm run dev
```

Open http://localhost:3000

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@prophive.in | admin123 |
| Seller | seller@prophive.in | seller123 |
| Buyer | buyer@prophive.in | buyer123 |
