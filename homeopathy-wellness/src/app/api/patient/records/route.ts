import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { ok, fail } from "@/lib/api-response";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "PATIENT") return fail("UNAUTHORIZED", "Patient access required.", 401);
  const body = await req.json().catch(() => null);
  const patient = await prisma.patient.findUnique({ where: { userId: session.user.id } });
  if (!patient) return fail("NOT_FOUND", "Patient profile not found.", 404);
  if (!body?.title || !body?.fileName || !body?.contentData) return fail("VALIDATION_ERROR", "A title and file are required.", 422);
  const record = await prisma.medicalRecord.create({ data: { patientId: patient.id, title: String(body.title).slice(0, 120), fileName: String(body.fileName).slice(0, 160), mimeType: String(body.mimeType || "application/octet-stream"), contentData: String(body.contentData), uploadedBy: "PATIENT" } });
  return ok({ id: record.id, title: record.title, fileName: record.fileName, uploadedBy: record.uploadedBy, createdAt: record.createdAt }, "Record uploaded.", 201);
}