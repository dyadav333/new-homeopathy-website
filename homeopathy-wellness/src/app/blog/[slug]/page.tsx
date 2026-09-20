import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/Container";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post || post.status !== "PUBLISHED") notFound();

  return (
    <Container className="py-16">
      <p className="text-xs text-ink/50">
        {post.authorName} · {post.publishedAt?.toLocaleDateString()}
      </p>
      <h1 className="mt-2 font-display text-4xl text-brand-900">{post.title}</h1>
      <div className="prose-content mt-8 max-w-2xl whitespace-pre-line text-ink/80">
        {post.content}
      </div>
    </Container>
  );
}
