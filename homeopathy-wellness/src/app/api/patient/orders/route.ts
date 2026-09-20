import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { ok, fail } from "@/lib/api-response";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "PATIENT") return fail("UNAUTHORIZED", "Patient access required.", 401);
  const body = await req.json().catch(() => null);
  const items = typeof body?.items === "string" ? body.items.trim() : "";
  if (!items) return fail("VALIDATION_ERROR", "Add at least one medicine to the order.", 422);
  const patient = await prisma.patient.findUnique({ where: { userId: session.user.id } });
  if (!patient) return fail("NOT_FOUND", "Patient profile not found.", 404);
  const order = await prisma.medicineOrder.create({ data: { patientId: patient.id, items, status: "PLACED", totalMinorUnits: Number(body?.totalMinorUnits) || 0 } });
  return ok(order, "Medicine order placed.", 201);
}