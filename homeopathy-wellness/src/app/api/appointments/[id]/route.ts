import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { ok, fail } from "@/lib/api-response";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "PATIENT") return fail("UNAUTHORIZED", "Patient access required.", 401);
  const body = await req.json().catch(() => null);
  const patient = await prisma.patient.findUnique({ where: { userId: session.user.id } });
  const appointment = await prisma.appointment.findFirst({ where: { id: params.id, patientId: patient?.id } });
  if (!appointment) return fail("NOT_FOUND", "Appointment not found.", 404);
  if (body?.action === "cancel") {
    if (appointment.startAtUtc.getTime() - Date.now() < 24 * 60 * 60 * 1000) return fail("CANCELLATION_WINDOW", "Appointments can be cancelled up to 24 hours before the start time.", 422);
    const updated = await prisma.appointment.update({ where: { id: appointment.id }, data: { status: "CANCELLED" } });
    return ok(updated, "Appointment cancelled.");
  }
  return fail("INVALID_ACTION", "This appointment action is not available.", 422);
}