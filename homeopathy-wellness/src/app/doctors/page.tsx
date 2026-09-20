import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export const metadata = { title: "Our Doctors" };

export default async function DoctorsPage() {
  const doctors = await prisma.doctor.findMany({
    where: { isActive: true },
    include: { user: true, services: { include: { service: true } } },
  });

  return (
    <Container className="py-16">
      <h1 className="font-display text-4xl text-brand-900">Our Practitioners</h1>
      <p className="mt-3 max-w-xl text-ink/70">
        Every practitioner sets their own availability, consultation types, and pricing — pick the
        one who's the right fit for you or your pet.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {doctors.map((doc) => (
          <Card key={doc.id}>
            <h2 className="font-display text-xl text-brand-800">
              Dr. {doc.user.firstName} {doc.user.lastName}
            </h2>
            <p className="mt-1 text-sm text-brand-600">{doc.qualifications}</p>
            <p className="mt-3 text-sm text-ink/70">{doc.bio}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {doc.services.map((ds) => (
                <span key={ds.id} className="rounded-full bg-brand-50 px-3 py-1 text-xs text-brand-700">
                  {ds.service.name}
                </span>
              ))}
            </div>
            <div className="mt-5 flex gap-3">
              <Button href={`/doctors/${doc.slug}`} variant="ghost">View Profile</Button>
              <Button href={`/book-appointment?doctor=${doc.slug}`}>Book</Button>
            </div>
          </Card>
        ))}

        {doctors.length === 0 && (
          <p className="text-sm text-ink/60">No practitioners published yet.</p>
        )}
      </div>
    </Container>
  );
}
