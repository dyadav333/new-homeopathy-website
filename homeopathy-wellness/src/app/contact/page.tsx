import { Container } from "@/components/Container";
import { ContactForm } from "./ContactForm";

export const metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <Container className="py-16">
      <h1 className="font-display text-4xl text-brand-900">Contact Us</h1>
      <p className="mt-3 max-w-md text-ink/70">
        Have a question before booking? Send us a message and we'll get back to you.
      </p>
      <div className="mt-10 max-w-md">
        <ContactForm />
      </div>
    </Container>
  );
}
