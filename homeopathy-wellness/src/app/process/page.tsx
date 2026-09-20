import { Container } from "@/components/Container";

export const metadata = { title: "Our Process" };

const steps = [
  { title: "Book Appointment", body: "Pick a practitioner, consultation type, and an available slot." },
  { title: "Pay", body: "Secure your slot with online payment — confirmed only once payment clears." },
  { title: "Case History", body: "Complete an intake form and share any relevant reports or photos." },
  { title: "Upload Documents", body: "Attach prior reports, prescriptions, or media as requested." },
  { title: "Consultation", body: "Meet your practitioner — remotely by video, or in person." },
  { title: "Practitioner Review", body: "Your practitioner reviews everything and prepares a care plan." },
  { title: "Medicine & Order", body: "If prescribed, your remedy is prepared and an order created." },
  { title: "Delivery", body: "Your order is dispatched and tracked to your door." },
  { title: "Follow-up", body: "Book a shorter, lower-cost follow-up to track your progress." },
];

export default function ProcessPage() {
  return (
    <Container className="py-16">
      <h1 className="font-display text-4xl text-brand-900">How It Works</h1>
      <ol className="mt-10 space-y-8 border-l border-brand-200 pl-8">
        {steps.map((s, i) => (
          <li key={s.title} className="relative">
            <span className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-xs font-medium text-white">
              {i + 1}
            </span>
            <h2 className="font-display text-lg text-brand-800">{s.title}</h2>
            <p className="mt-1 text-sm text-ink/70">{s.body}</p>
          </li>
        ))}
      </ol>
    </Container>
  );
}
