import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "PATIENT") return new Response("Unauthorized", { status: 401 });
  const record = await prisma.medicalRecord.findFirst({ where: { id: params.id, patient: { userId: session.user.id } } });
  if (!record) return new Response("Not found", { status: 404 });
  const [, encoded] = record.contentData.split(",");
  return new Response(Buffer.from(encoded || record.contentData, "base64"), { headers: { "Content-Type": record.mimeType, "Content-Disposition": `attachment; filename="${record.fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}"` } });
}