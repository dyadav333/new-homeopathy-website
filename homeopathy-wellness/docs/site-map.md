# Site Map and Journey Map

## Public routes

`/`, `/about`, `/doctors`, `/doctors/:slug`, `/services/human`, `/services/animal`, `/process`, `/pricing`, `/faq`, `/blog`, `/blog/:slug`, `/testimonials`, `/contact`, `/privacy`, `/terms`, `/refunds`, `/login`, `/register`, `/book-appointment`.

## Patient routes

`/patient/dashboard`, `/patient/appointments`, `/patient/profile`, `/patient/tests`, `/patient/records`, `/patient/orders`, `/patient/feedback`, `/patient/settings`.

## Doctor and admin routes currently present

`/doctor/dashboard`, `/admin/dashboard`.

The doctor/admin route families are intentionally the next delivery phase. Their API authorization must be implemented before exposing management screens.

The doctor dashboard shows only that practitioner&apos;s assigned appointments, patient intake context,
record/pet counts, and consultation controls. The doctor API verifies ownership server-side before
updating consultation status or notes.

## API modules currently present

- Authentication: registration and NextAuth credentials session.
- Appointments: create, list through protected pages, and patient cancellation.
- Patient workspace: profile, feedback, orders, medical records, record download.
- Contact: contact submission.

## User journeys

### Visitor

Homepage -> human or animal service -> practitioner/process/fees -> register or book.

### New patient

Register -> login -> select doctor/service/type -> select date/time -> submit intake -> demo payment confirmation -> patient dashboard.

### Registered patient

Dashboard -> review appointments/profile/records/tests/orders/feedback -> take the next available action.

### Doctor

Login -> authorized appointment list -> patient case history and documents -> consultation notes -> follow-up or medicine order -> complete consultation.

### Admin

Login -> monitor platform -> manage users/doctors/services/pricing/availability -> review appointments/payments/orders/content/reports/audit logs.

## Phased delivery

1. Foundation and public platform: complete locally.
2. Doctor/service management and configurable availability: next.
3. Booking, intake, and payment integration: local demo flow complete; live gateway next.
4. Patient workspace: initial workspace complete; pet, consultation, and notification depth next.
5. Doctor workflow.
6. Admin management and CMS.
7. Notifications, video, messaging, shipping, and reporting.
8. Security, tests, production PostgreSQL/object storage/deployment.