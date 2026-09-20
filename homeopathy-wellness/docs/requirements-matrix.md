# Requirements Traceability Matrix

| Requirement area | Frontend | Backend/data | Status |
| --- | --- | --- | --- |
| Public human/animal pages | Public service routes | Service records | Working locally |
| Multiple practitioners | Listing/profile pages | Doctor, service, pricing, availability models | Working locally |
| Registration/login/roles | Login/register pages | NextAuth, hashed credentials, role guard | Working locally |
| Appointment selection | Booking form | Appointment conflict and availability validation | Working locally |
| Intake | Booking intake form | IntakeResponse | Working locally |
| Payment confirmation | Explicit demo payment label | Payment record with `provider=demo` | Development only |
| Patient dashboard | Responsive workspace and navigation | Protected patient queries | Working locally |
| Profile | Editable profile page | Protected profile API and local photo data | Working locally |
| Records | Upload/download page | Patient-owned private record API | Development/local only |
| Tests | Unified tests page | TestRecord model | Initial surface |
| Medicine orders | Create/history page | MedicineOrder model/API | Initial surface; catalog/payment pending |
| Feedback | Feedback form | Feedback model/API | Initial surface |
| Doctor workflow | Dashboard route only | No consultation-note workflow yet | Pending |
| Admin workflow | Dashboard route only | No CRUD management APIs yet | Pending |
| Live payments | Gateway abstraction needed | Webhook/idempotency needed | Pending |
| Notifications | No provider UI | Email/SMS/WhatsApp abstraction needed | Pending |
| PostgreSQL | SQLite local setup | Prisma migrations | Production migration pending |
| Object storage | Local database data | Storage provider abstraction needed | Production migration pending |
| Tests/security | Build/type check | Automated tests, rate limiting, audit logs | Pending |

## Explicit implementation decisions

- SQLite remains the local development database so the current working app remains runnable.
- PostgreSQL is the production target and must be introduced through a tested migration plan, not a silent datasource swap.
- Demo payment is never presented as live payment; Stripe/Razorpay integration requires provider credentials and webhook verification.
- Local file data is a development fallback; production documents and photos must use private object storage with signed URLs.