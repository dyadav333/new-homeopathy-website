import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";

export const metadata = { title: "Homeopathy for Animals" };

export default function AnimalServicesPage() {
  return (
    <Container className="py-16">
      <h1 className="font-display text-4xl text-brand-900">Homeopathy for Animals</h1>
      <div className="prose-content mt-6 max-w-2xl text-ink/80">
        <p>
          Companion animals — dogs, cats, and other pets — can respond well to individualized
          homeopathic care, considered alongside their behavior, environment, and history.
        </p>
        <p>
          Animal consultations are conducted remotely (video or phone), based on the case history
          and information you provide, since animals can't describe their own symptoms directly.
        </p>
        <h2 className="mt-8 font-display text-2xl text-brand-800">Supported animals</h2>
        <p>Dogs, cats, and other companion animals — the exact list is configurable by species and can grow over time.</p>
      </div>
      <Button href="/book-appointment" className="mt-8">Book an Animal Consultation</Button>
      <MedicalDisclaimer />
    </Container>
  );
}
