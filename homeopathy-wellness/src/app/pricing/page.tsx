import { prisma } from "@/lib/prisma";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";

export const metadata = { title: "Fees & Charges" };

export default async function PricingPage() {
  const doctorServices = await prisma.doctorService.findMany({
    include: { doctor: { include: { user: true } }, service: { include: { consultationTypes: true } } },
  });

  return (
    <Container className="py-16">
      <h1 className="font-display text-4xl text-brand-900">Fees &amp; Charges</h1>
      <p className="mt-3 max-w-xl text-ink/70">
        Every practitioner sets their own fees. Nothing here is hardcoded — an admin can update any
        price, and it reflects everywhere instantly.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {doctorServices.map((ds) => (
          <Card key={ds.id}>
            <h2 className="font-display text-lg text-brand-800">
              Dr. {ds.doctor.user.firstName} {ds.doctor.user.lastName} — {ds.service.name}
            </h2>
            <p className="mt-2 text-2xl font-medium text-brand-700">
              {(ds.priceMinorUnits / 100).toLocaleString(undefined, {
                style: "currency",
                currency: ds.currency,
              })}
            </p>
            <ul className="mt-3 text-sm text-ink/60">
              {ds.service.consultationTypes.map((ct) => (
                <li key={ct.id}>
                  {ct.name} ({ct.durationMinutes} min)
                </li>
              ))}
            </ul>
          </Card>
        ))}
        {doctorServices.length === 0 && (
          <p className="text-sm text-ink/60">No pricing configured yet — add it from the admin panel.</p>
        )}
      </div>
    </Container>
  );
}
