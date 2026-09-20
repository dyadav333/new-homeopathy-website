import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation";
import { ok, fail } from "@/lib/api-response";

// TODO (Phase 7 - Notifications): dispatch an admin-notification email/SMS
// through the NotificationService abstraction once it exists. For now the
// submission is durably stored — nothing is silently dropped.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Please check the form fields.", 422, parsed.error.flatten());
  }

  const submission = await prisma.contactSubmission.create({ data: parsed.data });

  return ok({ id: submission.id }, "Thanks — we'll get back to you shortly.", 201);
}
