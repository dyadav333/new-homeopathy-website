/**
 * DEVELOPMENT SEED DATA ONLY.
 * None of the people, bios, or testimonials below are real — they exist so
 * you have something to click through locally. Never run this against a
 * production database, and never replace these placeholders with real
 * patient information.
 *
 * Run with: npm run db:seed
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 12);

  // --- Admin ---
  await prisma.user.upsert({
    where: { email: "admin@homeopathywellness.example" },
    update: {},
    create: {
      email: "admin@homeopathywellness.example",
      firstName: "Demo",
      lastName: "Admin",
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  // --- Doctor 1 ---
  const doctor1User = await prisma.user.upsert({
    where: { email: "dr.mehta@homeopathywellness.example" },
    update: {},
    create: {
      email: "dr.mehta@homeopathywellness.example",
      firstName: "Anjali",
      lastName: "Mehta",
      passwordHash,
      role: "DOCTOR",
    },
  });
  const doctor1 = await prisma.doctor.upsert({
    where: { userId: doctor1User.id },
    update: {},
    create: {
      userId: doctor1User.id,
      slug: "dr-anjali-mehta",
      qualifications: "BHMS (Demo qualification — placeholder)",
      bio: "Placeholder biography for demo purposes. Replace with real content via the admin panel.",
      yearsExperience: 15,
    },
  });

  // --- Doctor 2 ---
  const doctor2User = await prisma.user.upsert({
    where: { email: "dr.rao@homeopathywellness.example" },
    update: {},
    create: {
      email: "dr.rao@homeopathywellness.example",
      firstName: "Vikram",
      lastName: "Rao",
      passwordHash,
      role: "DOCTOR",
    },
  });
  const doctor2 = await prisma.doctor.upsert({
    where: { userId: doctor2User.id },
    update: {},
    create: {
      userId: doctor2User.id,
      slug: "dr-vikram-rao",
      qualifications: "BHMS, MD (Demo qualification — placeholder)",
      bio: "Placeholder biography for demo purposes. Replace with real content via the admin panel.",
      yearsExperience: 8,
    },
  });

  // --- Demo patient ---
  const patientUser = await prisma.user.upsert({
    where: { email: "patient@homeopathywellness.example" },
    update: {},
    create: {
      email: "patient@homeopathywellness.example",
      firstName: "Demo",
      lastName: "Patient",
      passwordHash,
      role: "PATIENT",
      patient: { create: {} },
    },
  });

  // --- Services & consultation types ---
  const humanService = await prisma.service.create({
    data: {
      name: "Human Consultation",
      category: "HUMAN",
      description: "General homeopathic consultation for human patients.",
      consultationTypes: {
        create: [
          { name: "First Consultation", durationMinutes: 75, isFollowUp: false },
          { name: "Follow-up", durationMinutes: 20, isFollowUp: true },
        ],
      },
    },
  });

  const animalService = await prisma.service.create({
    data: {
      name: "Animal Consultation",
      category: "ANIMAL",
      description: "Remote homeopathic consultation for companion animals.",
      consultationTypes: {
        create: [
          { name: "First Consultation", durationMinutes: 45, isFollowUp: false },
          { name: "Follow-up", durationMinutes: 20, isFollowUp: true },
        ],
      },
    },
  });

  // --- Doctor pricing (doctor-specific, not hardcoded in the frontend) ---
  await prisma.doctorService.createMany({
    data: [
      { doctorId: doctor1.id, serviceId: humanService.id, priceMinorUnits: 250000, currency: "INR" },
      { doctorId: doctor2.id, serviceId: humanService.id, priceMinorUnits: 180000, currency: "INR" },
      { doctorId: doctor2.id, serviceId: animalService.id, priceMinorUnits: 120000, currency: "INR" },
    ],
  });

  // --- Availability (Mon–Fri, 9am–5pm, for both doctors) ---
  for (const doctor of [doctor1, doctor2]) {
    await prisma.doctorAvailability.createMany({
      data: [1, 2, 3, 4, 5].map((day) => ({
        doctorId: doctor.id,
        dayOfWeek: day,
        startTime: "09:00",
        endTime: "17:00",
        timezone: "Asia/Kolkata",
      })),
    });
  }

  // --- FAQs ---
  await prisma.fAQ.createMany({
    data: [
      {
        category: "Booking",
        question: "How do I book my first consultation?",
        answer: "Choose a practitioner, pick a consultation type and time, and complete payment to confirm your slot.",
        sortOrder: 1,
      },
      {
        category: "Booking",
        question: "Can I reschedule an appointment?",
        answer: "Yes, from your patient dashboard, subject to the cancellation policy.",
        sortOrder: 2,
      },
      {
        category: "Medicines",
        question: "How are medicines delivered?",
        answer: "Once prescribed, medicines are dispatched by courier to your registered address, with tracking.",
        sortOrder: 1,
      },
    ],
  });

  // --- Testimonials (placeholder) ---
  await prisma.testimonial.createMany({
    data: [
      {
        authorName: "Demo Patient A",
        quote: "Placeholder testimonial for demo purposes.",
        category: "HUMAN",
        isPublished: true,
      },
      {
        authorName: "Demo Patient B",
        quote: "Another placeholder testimonial — replace via the admin panel.",
        category: "ANIMAL",
        isPublished: true,
      },
    ],
  });

  // --- Blog post (placeholder) ---
  await prisma.blogPost.create({
    data: {
      title: "Welcome to Homeopathy Wellness",
      slug: "welcome-to-homeopathy-wellness",
      excerpt: "A placeholder introductory post — replace with real content from the admin CMS.",
      content: "This is placeholder blog content generated for local development only.",
      authorName: "Homeopathy Wellness Team",
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  console.log("Seed complete.");
  console.log("Demo logins (password for all: Password123!):");
  console.log("  Admin:   admin@homeopathywellness.example");
  console.log("  Doctor:  dr.mehta@homeopathywellness.example");
  console.log("  Doctor:  dr.rao@homeopathywellness.example");
  console.log("  Patient: patient@homeopathywellness.example");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
