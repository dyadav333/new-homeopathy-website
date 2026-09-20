import { redirect } from "next/navigation";
import { requireRole } from "@/lib/require-role";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";

export default async function DoctorDashboardPage() {
  const { authorized, session } = await requireRole(["DOCTOR"]);
  if (!authorized) redirect("/login");

  return (
    <Container className="py-16">
      <h1 className="font-display text-3xl text-brand-900">Welcome, Dr. {session!.user.name}</h1>
      <p className="mt-2 text-ink/70">This is your practitioner dashboard.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <Card><h2 className="font-display text-lg text-brand-800">Today's Appointments</h2><p className="mt-2 text-sm text-ink/60">Lands in Phase 3/5.</p></Card>
        <Card><h2 className="font-display text-lg text-brand-800">Availability</h2><p className="mt-2 text-sm text-ink/60">Calendar management lands in Phase 2.</p></Card>
        <Card><h2 className="font-display text-lg text-brand-800">Patients</h2><p className="mt-2 text-sm text-ink/60">Patient/case records land in Phase 5.</p></Card>
      </div>
    </Container>
  );
}
