import { prisma } from "@/lib/prisma";
import { webhookSignatureValid } from "@/lib/razorpay";

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  if (!webhookSignatureValid(payload, signature)) return new Response("Invalid signature", { status: 400 });
  const event = JSON.parse(payload) as { event?: string; payload?: { payment?: { entity?: { id?: string; order_id?: string; status?: string } } } };
  const paymentEntity = event.payload?.payment?.entity;
  if (!paymentEntity?.order_id) return new Response("OK", { status: 200 });
  const payment = await prisma.payment.findFirst({ where: { providerOrderId: paymentEntity.order_id } });
  if (!payment) return new Response("OK", { status: 200 });
  const paid = event.event === "payment.captured" || event.event === "order.paid";
  await prisma.$transaction([
    prisma.payment.update({ where: { id: payment.id }, data: { status: paid ? "PAID" : "PAYMENT_FAILED", providerPaymentId: paymentEntity.id, paidAt: paid ? new Date() : null } }),
    prisma.appointment.update({ where: { id: payment.appointmentId }, data: { status: paid ? "CONFIRMED" : "PAYMENT_PENDING" } }),
  ]);
  return new Response("OK", { status: 200 });
}