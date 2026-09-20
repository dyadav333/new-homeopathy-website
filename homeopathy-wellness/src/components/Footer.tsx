import Link from "next/link";
import { Container } from "@/components/Container";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-brand-100 bg-white py-10">
      <Container className="flex flex-col items-start justify-between gap-6 text-sm text-ink/70 md:flex-row md:items-center">
        <p>© {new Date().getFullYear()} Homeopathy Wellness. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-brand-700">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-brand-700">Terms</Link>
          <Link href="/refunds" className="hover:text-brand-700">Refunds</Link>
          <Link href="/contact" className="hover:text-brand-700">Contact</Link>
        </div>
      </Container>
    </footer>
  );
}
