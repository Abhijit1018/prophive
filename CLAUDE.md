# PropHive — CLAUDE.md

## Project
PropHive: Next.js 14 App Router real estate platform. PostgreSQL + Prisma. NextAuth v5 JWT. Razorpay payments. Mapbox maps. Cloudinary images. Resend email.

## Commands
- `npm run dev` — start dev server (port 3000)
- `npx prisma studio` — DB GUI (port 5555)
- `npx prisma migrate dev --name <name>` — create migration
- `npx prisma db seed` — seed 15 sample properties
- `npm run build` — production build

## Architecture
- App Router: server components by default. `use client` only for interactivity.
- Contact details NEVER in client payload for non-paying users — server-side gate only.
- All API routes: validate with auth() + Zod before responding.
- Active cities: Jaipur, Delhi, Gurugram. Others → /coming-soon.
- Subscription expiry: check `endAt < now()` on each protected route (no cron for MVP).

## Roles
- BUYER: browse + wishlist. Paid = see contacts.
- SELLER: list properties. Paid = more listings + featured.
- ADMIN: /admin panel, full access.

## Key Files
- `lib/auth.ts` — NextAuth config (credentials provider, JWT)
- `lib/prisma.ts` — Prisma singleton
- `lib/coupon.ts` — early user coupon logic (users 1-100, EARLY{N} code, 30% off)
- `lib/razorpay.ts` — Razorpay client + plan definitions
- `lib/mapbox.ts` — city centers, active/coming-soon city lists
- `components/SubscriptionGate.tsx` — server component, gates contact details
- `components/MapView.tsx` — Mapbox GL JS map (client component)
- `middleware.ts` — route protection for /admin and /dashboard

## Seed Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@prophive.in | admin123 |
| Seller | seller@prophive.in | seller123 |
| Buyer | buyer@prophive.in | buyer123 |
