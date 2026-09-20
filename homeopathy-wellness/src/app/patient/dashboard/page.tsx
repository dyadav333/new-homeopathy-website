import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/require-role";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { DashboardNav } from "../DashboardNav";

export default async function PatientDashboardPage({ searchParams }: { searchParams: { confirmed?: string } }) {
  const { authorized, session } = await requireRole(["PATIENT"]);
  if (!authorized) redirect("/login");

  const patient = await prisma.patient.findUnique({
    where: { userId: session!.user.id },
    include: {
      appointments: {
        orderBy: { startAtUtc: "asc" },
        include: { doctor: { include: { user: true } }, consultationType: true, payment: true },
      },
    },
  });
  const appointments = patient?.appointments ?? [];
  const upcoming = appointments.filter((appointment) => appointment.startAtUtc >= new Date() && appointment.status !== "CANCELLED");

  return (
    <div className="dashboard-frame"><DashboardNav canSwitch={false} /><main className="dashboard-main">
      <div className="dashboard-heading"><div><p className="dashboard-kicker">Your care workspace</p><h1>Good to see you, {session!.user.name?.split(" ")[0]}</h1><p>Keep your care journey organised in one calm place.</p></div><a href="/book-appointment" className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white">Book consultation</a></div>

      {searchParams.confirmed && <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">Your appointment is confirmed. A confirmation has been added below.</div>}

      <div className="dashboard-stat-grid"><div className="dashboard-card dashboard-stat"><small>Upcoming appointments</small><strong>{upcoming.length}</strong></div><div className="dashboard-card dashboard-stat"><small>Completed consultations</small><strong>{appointments.filter((appointment) => appointment.status === "COMPLETED").length}</strong></div><div className="dashboard-card dashboard-stat"><small>Confirmed payments</small><strong>{appointments.filter((appointment) => appointment.payment?.status === "PAID").length}</strong></div></div>

      <section className="mt-10"><div className="flex items-center justify-between"><h2 className="font-display text-2xl text-brand-900">Next in your care</h2><a href="/patient/appointments" className="text-sm font-semibold text-brand-700">View all →</a></div>{appointments.length === 0 ? <div className="dashboard-card mt-4"><p className="text-ink/60">You do not have any appointments yet.</p></div> : <div className="dashboard-list">{appointments.slice(0, 3).map((appointment) => <div className="dashboard-list-item" key={appointment.id}><div><h3>Dr. {appointment.doctor.user.firstName} {appointment.doctor.user.lastName}</h3><p>{appointment.consultationType.name} · {appointment.startAtUtc.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })} IST</p></div><span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">{appointment.status}</span></div>)}</div>}</section>
      <section className="mt-10 grid gap-4 md:grid-cols-3"><a className="dashboard-card" href="/patient/records"><span className="dashboard-kicker">Private files</span><h2 className="mt-2 font-display text-xl text-brand-900">Medical records</h2><p className="mt-2 text-sm text-ink/60">Upload and keep reports together.</p></a><a className="dashboard-card" href="/patient/orders"><span className="dashboard-kicker">Wellness shop</span><h2 className="mt-2 font-display text-xl text-brand-900">Medicine orders</h2><p className="mt-2 text-sm text-ink/60">Place an order or view history.</p></a><a className="dashboard-card" href="/patient/profile"><span className="dashboard-kicker">Your details</span><h2 className="mt-2 font-display text-xl text-brand-900">Complete profile</h2><p className="mt-2 text-sm text-ink/60">Help your practitioner prepare.</p></a></section>
    </main></div>
  );
}
