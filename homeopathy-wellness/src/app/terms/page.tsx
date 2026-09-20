import { Container } from "@/components/Container";
import { LegalPlaceholderNotice } from "@/components/LegalPlaceholderNotice";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";

export const metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <Container className="py-16">
      <h1 className="font-display text-4xl text-brand-900">Terms &amp; Conditions</h1>
      <div className="mt-6 max-w-2xl">
        <LegalPlaceholderNotice />
        <div className="prose-content text-ink/80">
          <p>
            By booking a consultation, you agree to provide accurate case history information and
            to attend scheduled appointments or cancel/reschedule within the platform's policy
            window.
          </p>
          <p>
            Consultation fees, medicine costs, and shipping charges are as displayed at the time of
            booking or order and are set independently by each practitioner.
          </p>
        </div>
        <MedicalDisclaimer />
      </div>
    </Container>
  );
}
