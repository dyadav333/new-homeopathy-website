import { Container } from "@/components/Container";
import { LegalPlaceholderNotice } from "@/components/LegalPlaceholderNotice";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <Container className="py-16">
      <h1 className="font-display text-4xl text-brand-900">Privacy Policy</h1>
      <div className="mt-6 max-w-2xl">
        <LegalPlaceholderNotice />
        <div className="prose-content text-ink/80">
          <p>
            This platform collects information necessary to provide homeopathic consultation
            services, including account details, patient/pet case history, uploaded documents,
            appointment and payment records.
          </p>
          <p>
            Access to patient records is restricted to the treating practitioner, the patient
            themselves, and authorized administrators, and sensitive access is logged.
          </p>
          <p>
            This platform is designed with privacy and security best practices in mind. Formal
            compliance with regulations such as HIPAA or GDPR requires a dedicated legal and
            security review and appropriate operational controls — it is not automatically
            achieved by this codebase.
          </p>
        </div>
      </div>
    </Container>
  );
}
