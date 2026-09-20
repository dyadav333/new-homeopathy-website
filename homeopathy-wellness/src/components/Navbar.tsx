import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

const links = [
  { href: "/doctors", label: "Doctors" },
  { href: "/services/human", label: "For Humans" },
  { href: "/services/animal", label: "For Animals" },
  { href: "/process", label: "Process" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export async function Navbar() {
  const session = await getServerSession(authOptions);
  const dashboardHref = session
    ? session.user.role === "DOCTOR"
      ? "/doctor/dashboard"
      : session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN"
      ? "/admin/dashboard"
      : "/patient/dashboard"
    : "/login";

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-[#fbf9f5]/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-lg text-brand-800">
          Homeopathy Wellness
        </Link>
        <nav className="hidden gap-6 text-sm text-ink/80 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-brand-700">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {session ? (
            <Button href={dashboardHref} variant="ghost">
              My Dashboard
            </Button>
          ) : (
            <>
              <Link href="/login" className="text-sm text-ink/80 hover:text-brand-700">
                Log in
              </Link>
              <Button href="/book-appointment">Book an Appointment</Button>
            </>
          )}
        </div>
      </Container>
    </header>
  );
}
