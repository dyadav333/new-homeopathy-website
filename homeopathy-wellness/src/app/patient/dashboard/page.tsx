import { redirect } from "next/navigation";
import { requireRole } from "@/lib/require-role";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";

export default async function PatientDashboardPage() {
  const { authorized, session } = await requireRole(["PATIENT"]);
  if (!authorized) redirect("/login");

  return (
    <Container className="py-16">
      <h1 className="font-display text-3xl text-brand-900">Welcome, {session!.user.name}</h1>
      <p className="mt-2 text-ink/70">This is your patient dashboard.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <Card><h2 className="font-display text-lg text-brand-800">Upcoming Appointments</h2><p className="mt-2 text-sm text-ink/60">Booking engine lands in Phase 3.</p></Card>
        <Card><h2 className="font-display text-lg text-brand-800">Pets</h2><p className="mt-2 text-sm text-ink/60">Manage pet profiles here in Phase 4.</p></Card>
        <Card><h2 className="font-display text-lg text-brand-800">Orders</h2><p className="mt-2 text-sm text-ink/60">Medicine orders land in Phase 4.</p></Card>
      </div>
    </Container>
  );
}
