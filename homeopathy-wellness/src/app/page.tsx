import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";

export default async function HomePage() {
  const [doctors, testimonials, posts] = await Promise.all([
    prisma.doctor.findMany({
      where: { isActive: true },
      include: { user: true },
      take: 3,
    }),
    prisma.testimonial.findMany({ where: { isPublished: true }, take: 3 }),
    prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
  ]);

  return (
    <>
      <section className="bg-brand-50 py-20">
        <Container className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-brand-600">
              Homeopathic care, for people and pets
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-brand-900 md:text-5xl">
              Whole-person care, delivered wherever you are.
            </h1>
            <p className="mt-5 max-w-lg text-ink/70">
              Consult remotely or in person with our qualified homeopathic practitioners — for
              yourself, or for the animals in your care.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/book-appointment">Book an Appointment</Button>
              <Button href="/process" variant="ghost">See how it works</Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white/80">
              <h3 className="font-display text-lg text-brand-800">For Humans</h3>
              <p className="mt-2 text-sm text-ink/70">
                Gentle, individualized care suitable for every age and stage of life.
              </p>
              <Link href="/services/human" className="mt-3 inline-block text-sm font-medium text-brand-600">
                Learn more →
              </Link>
            </Card>
            <Card className="bg-white/80">
              <h3 className="font-display text-lg text-brand-800">For Animals</h3>
              <p className="mt-2 text-sm text-ink/70">
                Considerate, holistic support for your dog, cat, or other companion animal.
              </p>
              <Link href="/services/animal" className="mt-3 inline-block text-sm font-medium text-brand-600">
                Learn more →
              </Link>
            </Card>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <h2 className="font-display text-3xl text-brand-900">Our Practitioners</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {doctors.length === 0 && (
              <p className="text-sm text-ink/60">
                No practitioner profiles yet — add one from the admin panel.
              </p>
            )}
            {doctors.map((doc) => (
              <Card key={doc.id}>
                <h3 className="font-display text-xl text-brand-800">
                  Dr. {doc.user.firstName} {doc.user.lastName}
                </h3>
                <p className="mt-2 text-sm text-ink/70">{doc.qualifications}</p>
                <Link href={`/doctors/${doc.slug}`} className="mt-4 inline-block text-sm font-medium text-brand-600">
                  View profile →
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-clay-50 py-20">
        <Container>
          <h2 className="font-display text-3xl text-brand-900">How It Works</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-4">
            {[
              ["1", "Book Appointment", "Choose your practitioner, consultation type, and a slot that suits you."],
              ["2", "Case History", "Share relevant history, reports, or photos ahead of your consultation."],
              ["3", "Consultation", "Meet remotely or in person for a full first consultation."],
              ["4", "Care & Follow-up", "Receive your remedy and book follow-ups as needed."],
            ].map(([n, title, body]) => (
              <div key={n}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 font-display text-white">
                  {n}
                </div>
                <h3 className="mt-4 font-display text-lg text-brand-800">{title}</h3>
                <p className="mt-2 text-sm text-ink/70">{body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {testimonials.length > 0 && (
        <section className="py-20">
          <Container>
            <h2 className="font-display text-3xl text-brand-900">What Patients Say</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <Card key={t.id}>
                  <p className="text-sm italic text-ink/80">&ldquo;{t.quote}&rdquo;</p>
                  <p className="mt-4 text-sm font-medium text-brand-700">— {t.authorName}</p>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}

      {posts.length > 0 && (
        <section className="bg-brand-50 py-20">
          <Container>
            <h2 className="font-display text-3xl text-brand-900">From the Blog</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {posts.map((p) => (
                <Card key={p.id}>
                  <h3 className="font-display text-lg text-brand-800">{p.title}</h3>
                  <p className="mt-2 text-sm text-ink/70">{p.excerpt}</p>
                  <Link href={`/blog/${p.slug}`} className="mt-4 inline-block text-sm font-medium text-brand-600">
                    Read more →
                  </Link>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}

      <Container>
        <MedicalDisclaimer />
      </Container>
    </>
  );
}
