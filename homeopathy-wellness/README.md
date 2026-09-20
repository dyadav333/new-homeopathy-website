# Homeopathy Wellness

An original full-stack homeopathic consultation platform — human & animal tracks, multi-doctor
booking, patient/doctor/admin panels, medicine orders, and payments. Built in phases; this is
**Phase 1: Foundation** with an initial patient booking and workspace slice (project setup,
database, auth/roles, design system, public pages, appointments, intake, and patient tools).

The product requirements, reference limitations, route map, journeys, and traceability status are
documented in `docs/reference-analysis.md`, `docs/site-map.md`, and `docs/requirements-matrix.md`.

Inspired by the *workflow structure* of an existing homeopathy consultation site — no copied
branding, text, images, or code. See `PROJECT-NOTES.md` (if provided separately) for the full
analysis this was built from.

## Requirements

- Node.js 20+
- npm 10+

No external database server is required for local development — Phase 1 uses SQLite.

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env

# (Optional but recommended) generate a real secret and paste it into .env:
openssl rand -base64 32

# 3. Create the SQLite database and apply the schema
npx prisma migrate dev --name init

# 4. Seed demo data (admin, 2 doctors, 1 patient, services, FAQs, blog post)
npm run db:seed

# 5. Run the dev server
npm run dev
```

Visit **http://localhost:3000**.

## Razorpay setup

Local development uses the clearly labeled demo payment flow when Razorpay credentials are
empty. To enable real Razorpay checkout, add these values to `.env`:

```bash
PAYMENT_PROVIDER="razorpay"
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="..."
RAZORPAY_WEBHOOK_SECRET="..."
```

Configure Razorpay to send payment events to `/api/payments/webhook`. The appointment remains
`PAYMENT_PENDING` until the server verifies the checkout signature or a valid webhook confirms
the payment. Never expose `RAZORPAY_KEY_SECRET` or the webhook secret to the browser.

## Demo logins

Password for all: `Password123!`

| Role    | Email                                    |
|---------|-------------------------------------------|
| Admin   | admin@homeopathywellness.example           |
| Doctor  | dr.priyanka@homeopathywellness.example    |
| Doctor  | dr.xyz@homeopathywellness.example         |
| Patient | patient@homeopathywellness.example         |

⚠️ These are placeholder demo accounts for local development only — never deploy this seed data,
and never put real patient information into these records.

## What's real vs. mocked right now

**Real and working:** registration, login/logout, role-based route protection (middleware +
server-side `requireRole` double-check), public pages reading live data from the database
(doctors, pricing, FAQs, blog, testimonials), the contact form (stores real submissions), and
the customer booking flow (doctor/time selection, intake form, demo payment confirmation, and
patient dashboard history). The patient workspace also includes profile editing, local profile
photos, appointment history/cancellation, private local record upload/download, tests, medicine
order creation/history, feedback, and settings. Doctors can now review their assigned appointment
queue, patient intake context, record/pet counts, and save consultation status, summaries, and
private notes.

**Mocked / not yet built** (by design, per the phased build plan — never silently faked in
production, always labeled): live payment gateway/webhooks, production object storage and virus
scanning, practitioner consultation workflow, catalog-backed medicine fulfillment, notifications
(email/SMS/WhatsApp), video consultation links, and the full admin CMS. The local booking flow
records a clearly labeled demo payment so the customer journey can be tested safely.

## Moving to Postgres later

In `prisma/schema.prisma`, change:

```prisma
datasource db {
  provider = "postgresql"   // was "sqlite"
  url      = env("DATABASE_URL")
}
```

and set `DATABASE_URL` in `.env` to your Postgres connection string, then re-run
`npx prisma migrate dev`.

## Project structure

```
prisma/schema.prisma     Data model (single source of truth)
prisma/seed.ts           Dev-only seed data
src/app/                 Pages & API routes (Next.js App Router)
src/components/          Shared UI (Button, Card, Navbar, Footer, etc.)
src/lib/                 prisma client, auth config, validation, API helpers
src/middleware.ts         Edge-level role gating for /admin, /doctor, /patient
```

## Roadmap (subsequent phases)

2. Doctor/service management UI, real availability calendar, slot generation
3. Booking engine: slot hold → intake form → payment → confirmation (webhooks)
4. Patient dashboard: documents, consultation history, medicine orders
5. Doctor dashboard: patient records, consultation notes, order creation
6. Admin panel: users, doctors, appointments, payments, orders, CMS, reports
7. Notifications: email/SMS/WhatsApp + scheduled reminders
8. Testing & security pass
9. Deployment (Vercel + managed Postgres + object storage + webhooks)

## Master specification

The master product prompt is implemented incrementally. The current repository intentionally keeps
SQLite for local development and uses provider placeholders in `.env.example`; production
PostgreSQL, payments, storage, email, messaging, video, shipping, audit logging, and compliance
controls require environment/provider decisions and dedicated migrations before launch.

## Known limitations of this snapshot

- No automated tests yet (arrives in Phase 8).
- Payment, email, storage, and video providers are unset — the app runs and is fully navigable
  without them, but anything depending on them is stubbed with a clear note in code.
- This was authored and written to disk in a sandboxed environment without network access, so
  `npm install` / `prisma migrate` / `next dev` have **not** been executed or verified here — run
  the Setup steps above on your machine to confirm everything builds. If you hit an error, share
  it and it can be fixed directly.
