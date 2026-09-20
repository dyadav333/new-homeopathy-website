import { redirect } from "next/navigation";
import { requireRole } from "@/lib/require-role";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";

export default async function AdminDashboardPage() {
  const { authorized } = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  if (!authorized) redirect("/login");

  const [userCount, doctorCount, contactCount] = await Promise.all([
    prisma.user.count(),
    prisma.doctor.count(),
    prisma.contactSubmission.count(),
  ]);

  return (
    <Container className="py-16">
      <h1 className="font-display text-3xl text-brand-900">Admin Dashboard</h1>
      <p className="mt-2 text-ink/70">Real numbers from the database — no placeholder stats.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <Card><p className="text-sm text-ink/60">Total Users</p><p className="mt-1 text-3xl font-display text-brand-800">{userCount}</p></Card>
        <Card><p className="text-sm text-ink/60">Active Doctors</p><p className="mt-1 text-3xl font-display text-brand-800">{doctorCount}</p></Card>
        <Card><p className="text-sm text-ink/60">Contact Messages</p><p className="mt-1 text-3xl font-display text-brand-800">{contactCount}</p></Card>
      </div>
      <p className="mt-8 text-sm text-ink/60">
        User/doctor/appointment/order/payment/CMS management screens land in Phase 6.
      </p>
    </Container>
  );
}
