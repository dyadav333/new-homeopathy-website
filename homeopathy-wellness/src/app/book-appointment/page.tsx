import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Container } from "@/components/Container";
import { BookingForm } from "./BookingForm";

export const metadata = { title: "Book an Appointment" };

export default async function BookAppointmentPage({
  searchParams,
}: {
  searchParams: { doctor?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return <Container className="py-16"><h1 className="font-display text-4xl text-brand-900">Book an Appointment</h1><p className="mt-3 text-ink/70">Please log in or create a patient account before booking.</p><a href={`/login?callbackUrl=/book-appointment`} className="mt-6 inline-block rounded-lg bg-brand-700 px-5 py-3 font-semibold text-white">Log in to continue</a></Container>;
  }

  const doctors = await prisma.doctor.findMany({
    where: { isActive: true },
    include: { user: true, services: { include: { service: { include: { consultationTypes: true } } } } },
  });
  const preselected = searchParams.doctor;

  return (
    <Container className="py-16">
      <h1 className="font-display text-4xl text-brand-900">Book an Appointment</h1>
      <p className="mt-3 max-w-xl text-ink/70">Choose a practitioner, select a weekday slot, tell us what you need help with, and confirm your consultation.</p>
      <div className="mt-10"><BookingForm doctors={doctors.map((doctor) => ({ id: doctor.id, slug: doctor.slug, firstName: doctor.user.firstName, lastName: doctor.user.lastName, services: doctor.services }))} preselected={preselected} /></div>
    </Container>
  );
}
