import { prisma } from "@/lib/prisma";
import { Container } from "@/components/Container";

export const metadata = { title: "Frequently Asked Questions" };

export default async function FaqPage() {
  const faqs = await prisma.fAQ.findMany({ orderBy: [{ category: "asc" }, { sortOrder: "asc" }] });
  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  return (
    <Container className="py-16">
      <h1 className="font-display text-4xl text-brand-900">Frequently Asked Questions</h1>

      {categories.length === 0 && (
        <p className="mt-6 text-sm text-ink/60">No FAQs published yet — add them from the admin panel.</p>
      )}

      {categories.map((cat) => (
        <div key={cat} className="mt-10">
          <h2 className="font-display text-2xl text-brand-800">{cat}</h2>
          <div className="mt-4 divide-y divide-brand-100">
            {faqs
              .filter((f) => f.category === cat)
              .map((f) => (
                <details key={f.id} className="group py-4">
                  <summary className="cursor-pointer list-none font-medium text-ink marker:content-none">
                    {f.question}
                  </summary>
                  <p className="mt-2 text-sm text-ink/70">{f.answer}</p>
                </details>
              ))}
          </div>
        </div>
      ))}
    </Container>
  );
}
