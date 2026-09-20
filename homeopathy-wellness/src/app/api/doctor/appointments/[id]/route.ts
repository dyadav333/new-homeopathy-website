import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { ok, fail } from "@/lib/api-response";

const allowedStatuses = ["IN_PROGRESS", "COMPLETED", "FOLLOW_UP_REQUIRED"];

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "DOCTOR") return fail("UNAUTHORIZED", "Doctor access required.", 401);
  const doctor = await prisma.doctor.findUnique({ where: { userId: session.user.id } });
  if (!doctor) return fail("DOCTOR_NOT_FOUND", "Practitioner profile not found.", 404);
  const appointment = await prisma.appointment.findFirst({ where: { id: params.id, doctorId: doctor.id }, include: { consultation: true } });
  if (!appointment) return fail("NOT_FOUND", "Appointment not found.", 404);
  const body = await req.json().catch(() => null);
  const status = typeof body?.status === "string" ? body.status : "";
  const note = typeof body?.note === "string" ? body.note.trim() : "";
  const summary = typeof body?.summary === "string" ? body.summary.trim() : "";
  if (!allowedStatuses.includes(status) || (status !== "IN_PROGRESS" && !summary && !note)) return fail("VALIDATION_ERROR", "Choose a consultation status and provide a clinical summary or note.", 422);

  const consultation = await prisma.$transaction(async (tx) => {
    const record = await tx.consultation.upsert({
      where: { appointmentId: appointment.id },
      create: { appointmentId: appointment.id, status, summary: summary || null, startedAt: status === "IN_PROGRESS" ? new Date() : null, completedAt: status !== "IN_PROGRESS" ? new Date() : null },
      update: { status, summary: summary || undefined, startedAt: status === "IN_PROGRESS" && !appointment.consultation?.startedAt ? new Date() : undefined, completedAt: status !== "IN_PROGRESS" ? new Date() : undefined },
    });
    if (note) await tx.consultationNote.create({ data: { consultationId: record.id, authorId: session.user.id, note } });
    await tx.appointment.update({ where: { id: appointment.id }, data: { status: status === "COMPLETED" || status === "FOLLOW_UP_REQUIRED" ? "COMPLETED" : "IN_PROGRESS", notes: summary || undefined } });
    return record;
  });
  return ok(consultation, "Consultation updated.");
}