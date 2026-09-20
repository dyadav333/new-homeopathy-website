// SQLite can't enforce enums at the database level, so the allowed-value
// checking that would normally live in `enum` blocks in schema.prisma lives
// here instead. Use these — not raw string literals — anywhere in app code
// that reads or writes these fields, so TypeScript still catches typos.

export const Role = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  DOCTOR: "DOCTOR",
  PATIENT: "PATIENT",
  STAFF: "STAFF",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const PatientCategory = {
  HUMAN: "HUMAN",
  ANIMAL: "ANIMAL",
} as const;
export type PatientCategory = (typeof PatientCategory)[keyof typeof PatientCategory];

export const AppointmentStatus = {
  HELD: "HELD",
  PAYMENT_PENDING: "PAYMENT_PENDING",
  CONFIRMED: "CONFIRMED",
  RESCHEDULE_REQUESTED: "RESCHEDULE_REQUESTED",
  RESCHEDULED: "RESCHEDULED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  NO_SHOW: "NO_SHOW",
  REFUND_PENDING: "REFUND_PENDING",
  REFUNDED: "REFUNDED",
} as const;
export type AppointmentStatus = (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

export const ContentStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;
export type ContentStatus = (typeof ContentStatus)[keyof typeof ContentStatus];
