import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/require-role";
import { DashboardNav } from "./DashboardNav";
import { ProfileForm } from "./ProfileForm";

export default async function PatientProfilePage() {
  const { authorized, session } = await requireRole(["PATIENT"]);
  if (!authorized) redirect("/login");
  const data = await prisma.user.findUnique({ where: { id: session!.user.id }, include: { patient: true } });
  if (!data?.patient) redirect("/patient/dashboard");
  return <div className="dashboard-frame"><DashboardNav canSwitch={false} /><main className="dashboard-main"><div className="dashboard-heading"><div><p className="dashboard-kicker">Account</p><h1>View / update profile</h1><p>Keep your contact and care details current.</p></div></div><div className="dashboard-card"><ProfileForm profile={{ user: { firstName: data.firstName, lastName: data.lastName, email: data.email, phone: data.phone, gender: data.gender, bloodGroup: data.bloodGroup, photoData: data.photoData }, patient: { dateOfBirth: data.patient.dateOfBirth, address: data.patient.address, country: data.patient.country, pincode: data.patient.pincode } }} /></div></main></div>;
}