import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";

export const metadata = { title: "Homeopathy for Humans" };

export default function HumanServicesPage() {
  return (
    <Container className="py-16">
      <h1 className="font-display text-4xl text-brand-900">Homeopathy for Humans</h1>
      <div className="prose-content mt-6 max-w-2xl text-ink/80">
        <p>
          Homeopathic care considers the whole person — physical symptoms alongside emotional and
          lifestyle context — rather than treating an isolated complaint. It's generally considered
          suitable across ages and life stages, and can be used alongside conventional care.
        </p>
        <p>
          A first consultation typically runs longer than a routine visit, since it covers full
          case history. Follow-ups are shorter and focus on progress and adjustments.
        </p>
        <h2 className="mt-8 font-display text-2xl text-brand-800">What to expect</h2>
        <ul>
          <li>A detailed first consultation (remote or in person)</li>
          <li>A request for relevant reports, prescriptions, or history beforehand</li>
          <li>A personalized care plan and remedy, sent to your door</li>
          <li>Scheduled follow-ups to track progress</li>
        </ul>
      </div>
      <Button href="/book-appointment" className="mt-8">Book a Human Consultation</Button>
      <MedicalDisclaimer />
    </Container>
  );
}
