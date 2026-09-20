import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/require-role";
import { DashboardNav } from "../DashboardNav";

export default async function PatientAppointmentsPage() {
  const { authorized, session } = await requireRole(["PATIENT"]); if (!authorized) redirect("/login");
  const patient = await prisma.patient.findUnique({ where: { userId: session!.user.id }, include: { appointments: { orderBy: { startAtUtc: "desc" }, include: { doctor: { include: { user: true } }, consultationType: true, payment: true } } } });
  return <div className="dashboard-frame"><DashboardNav canSwitch={false} /><main className="dashboard-main"><div className="dashboard-heading"><div><p className="dashboard-kicker">Care timeline</p><h1>My appointments</h1><p>Every consultation, status, and payment in one place.</p></div><a href="/book-appointment" className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white">Book appointment</a></div><div className="dashboard-list">{patient?.appointments.length ? patient.appointments.map((appointment) => <div className="dashboard-list-item" key={appointment.id}><div><h3>Dr. {appointment.doctor.user.firstName} {appointment.doctor.user.lastName}</h3><p>{appointment.consultationType.name} · {appointment.startAtUtc.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "full", timeStyle: "short" })} IST</p><p>Payment: {appointment.payment?.status ?? "Pending"}</p></div><span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">{appointment.status}</span></div>) : <div className="dashboard-card">No appointments yet.</div>}</div></main></div>;
}