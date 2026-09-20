import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { createRazorpayOrder, razorpayConfigured } from "@/lib/razorpay";
import { ok, fail } from "@/lib/api-response";

const ACTIVE_STATUSES = ["HELD", "PAYMENT_PENDING", "CONFIRMED", "RESCHEDULED", "IN_PROGRESS"];

function parseIndiaDate(date: string, time: string) {
  const parsed = new Date(`${date}T${time}:00+05:30`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "PATIENT") {
    return fail("UNAUTHORIZED", "Please log in as a patient to book an appointment.", 401);
  }

  const body = await req.json().catch(() => null);
  const doctorId = typeof body?.doctorId === "string" ? body.doctorId : "";
  const consultationTypeId = typeof body?.consultationTypeId === "string" ? body.consultationTypeId : "";
  const date = typeof body?.date === "string" ? body.date : "";
  const time = typeof body?.time === "string" ? body.time : "";
  const concerns = typeof body?.concerns === "string" ? body.concerns.trim() : "";
  const medicalHistory = typeof body?.medicalHistory === "string" ? body.medicalHistory.trim() : "";
  const currentMedicines = typeof body?.currentMedicines === "string" ? body.currentMedicines.trim() : "";

  if (!doctorId || !consultationTypeId || !date || !time || concerns.length < 10) {
    return fail("VALIDATION_ERROR", "Choose a doctor, time, and provide at least 10 characters describing your concern.", 422);
  }

  const startAtUtc = parseIndiaDate(date, time);
  if (!startAtUtc || startAtUtc.getTime() <= Date.now()) {
    return fail("INVALID_TIME", "Choose a future appointment time.", 422);
  }

  const patient = await prisma.patient.findUnique({ where: { userId: session.user.id } });
  if (!patient) return fail("PATIENT_NOT_FOUND", "Complete your patient profile before booking.", 404);

  const selection = await prisma.doctorService.findUnique({
    where: { doctorId_serviceId: { doctorId, serviceId: (await prisma.consultationType.findUnique({ where: { id: consultationTypeId } }))?.serviceId ?? "" } },
    include: { doctor: { include: { user: true } }, service: true },
  });
  const consultationType = await prisma.consultationType.findUnique({ where: { id: consultationTypeId } });
  if (!selection || !consultationType || selection.doctorId !== doctorId) {
    return fail("INVALID_SELECTION", "That doctor and consultation type are not available.", 422);
  }

  const localDate = new Date(`${date}T12:00:00+05:30`);
  const dayOfWeek = localDate.getUTCDay() === 0 ? 7 : localDate.getUTCDay();
  const requestedStartMinutes = Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
  const requestedEndMinutes = requestedStartMinutes + consultationType.durationMinutes;
  const availability = await prisma.doctorAvailability.findFirst({
    where: { doctorId, dayOfWeek, startTime: { lte: time }, endTime: { gt: time } },
  });
  const endAtUtc = new Date(startAtUtc.getTime() + consultationType.durationMinutes * 60_000);
  if (!availability || requestedEndMinutes > Number(availability.endTime.slice(0, 2)) * 60 + Number(availability.endTime.slice(3))) {
    return fail("OUTSIDE_AVAILABILITY", "That time is outside the doctor's available hours.", 422);
  }

  const conflict = await prisma.appointment.findFirst({
    where: { doctorId, status: { in: ACTIVE_STATUSES }, startAtUtc: { lt: endAtUtc }, endAtUtc: { gt: startAtUtc } },
  });
  if (conflict) return fail("SLOT_UNAVAILABLE", "That time was just booked. Please choose another slot.", 409);

  const provider = razorpayConfigured() ? "razorpay" : "demo";
  const appointment = await prisma.$transaction(async (tx) => {
    const created = await tx.appointment.create({
      data: {
        doctorId,
        patientId: patient.id,
        consultationTypeId,
        startAtUtc,
        endAtUtc,
        patientTimezone: "Asia/Kolkata",
        status: provider === "demo" ? "CONFIRMED" : "PAYMENT_PENDING",
        intakeResponse: {
          create: { concerns, medicalHistory: medicalHistory || null, currentMedicines: currentMedicines || null, consentedAt: new Date() },
        },
        payment: {
          create: {
            amountMinorUnits: selection.priceMinorUnits,
            currency: selection.currency,
            status: provider === "demo" ? "PAID" : "PAYMENT_PENDING",
            provider,
            providerRef: `${provider}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
            paidAt: provider === "demo" ? new Date() : null,
          },
        },
      },
      include: { doctor: { include: { user: true } }, consultationType: true, payment: true },
    });
    return created;
  });

  if (provider === "demo") {
    return ok({
      id: appointment.id,
      status: appointment.status,
      paymentProvider: "demo",
      doctorName: `${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`,
      consultationType: appointment.consultationType.name,
      startAtUtc: appointment.startAtUtc,
      amountMinorUnits: appointment.payment?.amountMinorUnits,
    }, "Appointment confirmed using local demo payment.", 201);
  }

  try {
    const order = await createRazorpayOrder(selection.priceMinorUnits, selection.currency, appointment.id);
    await prisma.payment.update({ where: { id: appointment.payment!.id }, data: { providerOrderId: order.id } });
    return ok({
      id: appointment.id,
      status: appointment.status,
      paymentProvider: "razorpay",
      razorpayOrderId: order.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      doctorName: `${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`,
      consultationType: appointment.consultationType.name,
      startAtUtc: appointment.startAtUtc,
      amountMinorUnits: appointment.payment?.amountMinorUnits,
      currency: selection.currency,
    }, "Continue to Razorpay to confirm your appointment.", 201);
  } catch {
    return fail("PAYMENT_PROVIDER_ERROR", "We could not start payment. Your slot is held as pending; please try again.", 502);
  }
}