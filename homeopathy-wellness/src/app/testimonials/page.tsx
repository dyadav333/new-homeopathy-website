import { prisma } from "@/lib/prisma";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";

export const metadata = { title: "Testimonials" };

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ where: { isPublished: true } });

  return (
    <Container className="py-16">
      <h1 className="font-display text-4xl text-brand-900">Testimonials</h1>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {testimonials.map((t) => (
          <Card key={t.id}>
            <p className="text-sm italic text-ink/80">&ldquo;{t.quote}&rdquo;</p>
            <p className="mt-4 text-sm font-medium text-brand-700">— {t.authorName}</p>
          </Card>
        ))}
        {testimonials.length === 0 && (
          <p className="text-sm text-ink/60">No testimonials published yet.</p>
        )}
      </div>
    </Container>
  );
}
