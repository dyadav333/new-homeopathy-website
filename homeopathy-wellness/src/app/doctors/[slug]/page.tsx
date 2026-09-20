import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export default async function DoctorProfilePage({ params }: { params: { slug: string } }) {
  const doctor = await prisma.doctor.findUnique({
    where: { slug: params.slug },
    include: {
      user: true,
      services: { include: { service: { include: { consultationTypes: true } } } },
    },
  });

  if (!doctor || !doctor.isActive) notFound();

  return (
    <Container className="py-16">
      <div className="grid gap-10 md:grid-cols-3">
        <div className="md:col-span-2">
          <h1 className="font-display text-4xl text-brand-900">
            Dr. {doctor.user.firstName} {doctor.user.lastName}
          </h1>
          <p className="mt-2 text-brand-600">{doctor.qualifications}</p>
          {doctor.yearsExperience && (
            <p className="mt-1 text-sm text-ink/60">{doctor.yearsExperience}+ years of practice</p>
          )}
          <p className="prose-content mt-6 text-ink/80">{doctor.bio}</p>
        </div>

        <Card>
          <h2 className="font-display text-lg text-brand-800">Consultation Types &amp; Pricing</h2>
          <ul className="mt-4 space-y-4">
            {doctor.services.map((ds) => (
              <li key={ds.id}>
                <p className="font-medium text-ink">{ds.service.name}</p>
                <p className="text-sm text-ink/60">
                  {(ds.priceMinorUnits / 100).toLocaleString(undefined, {
                    style: "currency",
                    currency: ds.currency,
                  })}
                </p>
                <ul className="mt-1 text-xs text-ink/50">
                  {ds.service.consultationTypes.map((ct) => (
                    <li key={ct.id}>
                      {ct.name} — {ct.durationMinutes} min
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <Button href={`/book-appointment?doctor=${doctor.slug}`} className="mt-6 w-full">
            Book an Appointment
          </Button>
        </Card>
      </div>
    </Container>
  );
}
