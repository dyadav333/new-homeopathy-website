import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { ok, fail } from "@/lib/api-response";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "PATIENT") return fail("UNAUTHORIZED", "Patient access required.", 401);
  const body = req.headers.get("content-type")?.includes("application/json")
    ? await req.json().catch(() => null)
    : Object.fromEntries((await req.formData()).entries());
  const rating = Number(body?.rating);
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  if (!Number.isInteger(rating) || rating < 1 || rating > 5 || message.length < 5) return fail("VALIDATION_ERROR", "Choose a rating and write at least 5 characters.", 422);
  const patient = await prisma.patient.findUnique({ where: { userId: session.user.id } });
  if (!patient) return fail("NOT_FOUND", "Patient profile not found.", 404);
  const feedback = await prisma.feedback.create({ data: { patientId: patient.id, appointmentId: typeof body.appointmentId === "string" ? body.appointmentId : undefined, rating, message } });
  return ok(feedback, "Thank you for your feedback.", 201);
}