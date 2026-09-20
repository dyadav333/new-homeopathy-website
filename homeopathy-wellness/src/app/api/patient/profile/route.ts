import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { ok, fail } from "@/lib/api-response";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "PATIENT") return fail("UNAUTHORIZED", "Patient access required.", 401);
  const body = await req.json().catch(() => null);
  const patient = await prisma.patient.findUnique({ where: { userId: session.user.id } });
  if (!patient) return fail("NOT_FOUND", "Patient profile not found.", 404);

  const firstName = typeof body?.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body?.lastName === "string" ? body.lastName.trim() : "";
  if (!firstName || !lastName) return fail("VALIDATION_ERROR", "First and last name are required.", 422);
  const user = await prisma.user.update({ where: { id: session.user.id }, data: {
    firstName, lastName,
    phone: typeof body.phone === "string" ? body.phone.trim() || null : undefined,
    gender: typeof body.gender === "string" ? body.gender || null : undefined,
    bloodGroup: typeof body.bloodGroup === "string" ? body.bloodGroup || null : undefined,
    photoData: typeof body.photoData === "string" ? body.photoData || null : undefined,
  } });
  const updatedPatient = await prisma.patient.update({ where: { id: patient.id }, data: {
    dateOfBirth: typeof body.dateOfBirth === "string" && body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
    address: typeof body.address === "string" ? body.address.trim() || null : undefined,
    country: typeof body.country === "string" ? body.country.trim() || null : undefined,
    pincode: typeof body.pincode === "string" ? body.pincode.trim() || null : undefined,
  } });
  return ok({ user: { firstName: user.firstName, lastName: user.lastName, phone: user.phone, gender: user.gender, bloodGroup: user.bloodGroup, photoData: user.photoData }, patient: updatedPatient }, "Profile updated.");
}