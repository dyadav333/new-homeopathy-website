import { Container } from "@/components/Container";

export const metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <Container className="py-16">
      <h1 className="font-display text-4xl text-brand-900">About Homeopathy Wellness</h1>
      <div className="prose-content mt-6 max-w-2xl text-ink/80">
        <p>
          Homeopathy Wellness connects patients — human and animal — with qualified homeopathic
          practitioners for individualized, whole-person care, delivered remotely or in person.
        </p>
        <p>
          Our approach treats each patient as a whole: physical symptoms are considered alongside
          emotional and lifestyle factors, with care plans built around the individual rather than
          a single diagnosis.
        </p>
        <p>
          Replace this placeholder copy from the admin CMS with your practice&apos;s own story,
          mission, and values.
        </p>
      </div>
    </Container>
  );
}
