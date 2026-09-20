import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/require-role";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";

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
    <Container className="py-16">
      <h1 className="font-display text-3xl text-brand-900">Welcome, {session!.user.name}</h1>
      <p className="mt-2 text-ink/70">Manage your consultations, intake details, and payment confirmations here.</p>

      {searchParams.confirmed && <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">Your appointment is confirmed. A confirmation has been added below.</div>}

      <div className="mt-8 grid gap-6 md:grid-cols-3"><Card><h2 className="font-display text-lg text-brand-800">Upcoming Appointments</h2><p className="mt-2 text-3xl font-semibold text-brand-900">{upcoming.length}</p></Card><Card><h2 className="font-display text-lg text-brand-800">Completed</h2><p className="mt-2 text-3xl font-semibold text-brand-900">{appointments.filter((appointment) => appointment.status === "COMPLETED").length}</p></Card><Card><h2 className="font-display text-lg text-brand-800">Payments</h2><p className="mt-2 text-sm text-ink/60">{appointments.filter((appointment) => appointment.payment?.status === "PAID").length} confirmed payment(s)</p></Card></div>

      <section className="mt-10"><div className="flex items-center justify-between"><h2 className="font-display text-2xl text-brand-900">Your appointments</h2><a href="/book-appointment" className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white">Book another</a></div>{appointments.length === 0 ? <Card className="mt-4"><p className="text-ink/60">You do not have any appointments yet.</p></Card> : <div className="mt-4 space-y-4">{appointments.map((appointment) => <Card key={appointment.id} className={appointment.id === searchParams.confirmed ? "ring-2 ring-green-500" : undefined}><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-display text-lg text-brand-800">Dr. {appointment.doctor.user.firstName} {appointment.doctor.user.lastName}</p><p className="mt-1 text-sm text-ink/60">{appointment.consultationType.name} · {appointment.startAtUtc.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })} IST</p></div><span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">{appointment.status}</span></div><div className="mt-4 flex flex-wrap gap-4 border-t border-brand-100 pt-4 text-sm text-ink/60"><span>Payment: {appointment.payment?.status ?? "Pending"}</span><span>₹{((appointment.payment?.amountMinorUnits ?? 0) / 100).toLocaleString("en-IN")}</span></div></Card>)}</div>}</section>
    </Container>
  );
}
