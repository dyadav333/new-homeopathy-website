import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";

export const metadata = { title: "Blog" };

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <Container className="py-16">
      <h1 className="font-display text-4xl text-brand-900">Blog</h1>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {posts.map((p) => (
          <Card key={p.id}>
            <p className="text-xs text-ink/50">{p.authorName}</p>
            <h2 className="mt-1 font-display text-lg text-brand-800">{p.title}</h2>
            <p className="mt-2 text-sm text-ink/70">{p.excerpt}</p>
            <Link href={`/blog/${p.slug}`} className="mt-4 inline-block text-sm font-medium text-brand-600">
              Read more →
            </Link>
          </Card>
        ))}
        {posts.length === 0 && <p className="text-sm text-ink/60">No articles published yet.</p>}
      </div>
    </Container>
  );
}
