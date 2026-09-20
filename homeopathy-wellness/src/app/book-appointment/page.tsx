import { prisma } from "@/lib/prisma";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export const metadata = { title: "Book an Appointment" };

// Phase 1 stub: links exist and doctors are listed so the site is fully
// navigable end to end. The real slot-picker, timezone handling, intake
// form, and payment hold/confirm flow are built in Phase 3.
export default async function BookAppointmentPage({
  searchParams,
}: {
  searchParams: { doctor?: string };
}) {
  const doctors = await prisma.doctor.findMany({
    where: { isActive: true },
    include: { user: true },
  });
  const preselected = searchParams.doctor;

  return (
    <Container className="py-16">
      <h1 className="font-display text-4xl text-brand-900">Book an Appointment</h1>
      <p className="mt-3 max-w-xl text-ink/70">
        The full slot-picker and payment flow is coming in Phase 3 of this build. For now, choose a
        practitioner below to see their profile and pricing.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {doctors.map((doc) => (
          <Card
            key={doc.id}
            className={doc.slug === preselected ? "ring-2 ring-brand-400" : undefined}
          >
            <h2 className="font-display text-lg text-brand-800">
              Dr. {doc.user.firstName} {doc.user.lastName}
            </h2>
            <p className="mt-1 text-sm text-ink/60">{doc.qualifications}</p>
            <Button href={`/doctors/${doc.slug}`} variant="ghost" className="mt-4">
              View profile &amp; pricing
            </Button>
          </Card>
        ))}
      </div>
    </Container>
  );
}
