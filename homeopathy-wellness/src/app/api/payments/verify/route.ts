import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { razorpaySignatureValid } from "@/lib/razorpay";
import { ok, fail } from "@/lib/api-response";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "PATIENT") return fail("UNAUTHORIZED", "Patient access required.", 401);
  const body = await req.json().catch(() => null);
  const { appointmentId, razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = body ?? {};
  if (!appointmentId || !orderId || !paymentId || !signature || !razorpaySignatureValid(orderId, paymentId, signature)) return fail("PAYMENT_VERIFICATION_FAILED", "Payment verification failed. Your appointment was not confirmed.", 400);

  const patient = await prisma.patient.findUnique({ where: { userId: session.user.id } });
  const payment = await prisma.payment.findFirst({ where: { appointmentId, providerOrderId: orderId, appointment: { patientId: patient?.id } } });
  if (!payment) return fail("PAYMENT_NOT_FOUND", "Payment session not found.", 404);

  const updated = await prisma.$transaction(async (tx) => {
    await tx.payment.update({ where: { id: payment.id }, data: { status: "PAID", providerPaymentId: paymentId, paidAt: new Date() } });
    return tx.appointment.update({ where: { id: appointmentId }, data: { status: "CONFIRMED" } });
  });
  return ok({ appointmentId: updated.id, status: updated.status }, "Payment verified and appointment confirmed.");
}