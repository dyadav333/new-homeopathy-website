import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";
import { ok, fail } from "@/lib/api-response";

// Public self-registration always creates a PATIENT. Doctor/admin accounts
// are provisioned by an admin (Phase 6) — never via this open endpoint,
// which prevents privilege escalation through registration.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Please check the form fields.", 422, parsed.error.flatten());
  }

  const { firstName, lastName, email, password, phone } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return fail("EMAIL_IN_USE", "An account with this email already exists.", 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email: normalizedEmail,
      phone,
      passwordHash,
      role: "PATIENT",
      patient: { create: {} },
    },
    select: { id: true, email: true, firstName: true, lastName: true },
  });

  return ok(user, "Account created. You can now log in.", 201);
}
