import { Container } from "@/components/Container";
import { LegalPlaceholderNotice } from "@/components/LegalPlaceholderNotice";

export const metadata = { title: "Refund Policy" };

export default function RefundsPage() {
  return (
    <Container className="py-16">
      <h1 className="font-display text-4xl text-brand-900">Refund Policy</h1>
      <div className="mt-6 max-w-2xl">
        <LegalPlaceholderNotice />
        <div className="prose-content text-ink/80">
          <p>
            Consultation fees may be refunded if cancelled within the policy window before the
            scheduled appointment. Refund requests are reviewed by the platform admin and processed
            back to the original payment method.
          </p>
          <p>
            Medicine orders, once dispatched, are generally not eligible for refund except where
            the order was damaged, incorrect, or otherwise faulty.
          </p>
        </div>
      </div>
    </Container>
  );
}
