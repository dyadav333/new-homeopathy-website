"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";

type Doctor = {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  services: { serviceId: string; priceMinorUnits: number; currency: string; service: { id: string; name: string; consultationTypes: { id: string; name: string; durationMinutes: number }[] } }[];
};

export function BookingForm({ doctors, preselected }: { doctors: Doctor[]; preselected?: string }) {
  const router = useRouter();
  const [doctorId, setDoctorId] = useState(doctors.find((doctor) => doctor.slug === preselected)?.id ?? doctors[0]?.id ?? "");
  const [serviceId, setServiceId] = useState("");
  const [consultationTypeId, setConsultationTypeId] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  const doctor = doctors.find((item) => item.id === doctorId);
  const services = doctor?.services ?? [];
  const selectedService = services.find((item) => item.serviceId === serviceId) ?? services[0];
  const consultationTypes = selectedService?.service.consultationTypes ?? [];
  const selectedType = consultationTypes.find((item) => item.id === consultationTypeId) ?? consultationTypes[0];

  const dates = useMemo(() => {
    const result: { value: string; label: string }[] = [];
    for (let offset = 1; result.length < 10 && offset < 30; offset += 1) {
      const date = new Date();
      date.setDate(date.getDate() + offset);
      if (date.getDay() > 0 && date.getDay() < 6) {
        result.push({ value: date.toISOString().slice(0, 10), label: date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }) });
      }
    }
    return result;
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctorId, serviceId: selectedService?.serviceId, consultationTypeId: selectedType?.id, date: form.get("date"), time: form.get("time"), concerns: form.get("concerns"), medicalHistory: form.get("medicalHistory"), currentMedicines: form.get("currentMedicines") }),
    });
    const result = await response.json();
    if (!result.success) {
      setMessage(result.error?.message ?? "We could not complete the booking.");
      return;
    }
    if (result.data.paymentProvider === "demo") {
      router.push(`/patient/dashboard?confirmed=${result.data.id}`);
      router.refresh();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      const checkout = new (window as unknown as { Razorpay: new (options: Record<string, unknown>) => { open: () => void } }).Razorpay({
        key: result.data.razorpayKeyId,
        amount: result.data.amountMinorUnits,
        currency: result.data.currency,
        name: "Homeopathy Wellness",
        description: `${result.data.consultationType} with Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}`,
        order_id: result.data.razorpayOrderId,
        handler: async (payment: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const verification = await fetch("/api/payments/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ appointmentId: result.data.id, ...payment }) }).then((response) => response.json());
          if (!verification.success) { setStatus("error"); setMessage(verification.error?.message ?? "Payment could not be verified."); return; }
          router.push(`/patient/dashboard?confirmed=${result.data.id}`);
          router.refresh();
        },
        modal: { ondismiss: () => { setStatus("error"); setMessage("Payment was cancelled. Your appointment remains pending until payment succeeds."); } },
      });
      checkout.open();
    };
    script.onerror = () => { setStatus("error"); setMessage("Razorpay checkout could not load. Please try again."); };
    document.body.appendChild(script);
  }

  if (!doctor) return <p className="text-red-700">No doctors are currently available.</p>;
  const selectedDoctor = doctor;

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_0.7fr]">
      <div className="space-y-5">
        <section className="rounded-xl border border-brand-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">1. Consultation</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">Doctor<select value={doctorId} onChange={(event) => { setDoctorId(event.target.value); setServiceId(""); setConsultationTypeId(""); }} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2">{doctors.map((item) => <option key={item.id} value={item.id}>Dr. {item.firstName} {item.lastName}</option>)}</select></label>
            <label className="text-sm font-medium">Service<select value={selectedService?.serviceId ?? ""} onChange={(event) => { setServiceId(event.target.value); setConsultationTypeId(""); }} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2">{services.map((item) => <option key={item.serviceId} value={item.serviceId}>{item.service.name}</option>)}</select></label>
          </div>
          <label className="mt-4 block text-sm font-medium">Consultation type<select value={selectedType?.id ?? ""} onChange={(event) => setConsultationTypeId(event.target.value)} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2">{consultationTypes.map((item) => <option key={item.id} value={item.id}>{item.name} ({item.durationMinutes} minutes)</option>)}</select></label>
        </section>

        <section className="rounded-xl border border-brand-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">2. Date and time</p>
          <p className="mt-2 text-sm text-ink/60">Appointments are shown in India Standard Time. Weekday slots are available from 09:00 to 17:00.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">Date<select name="date" required className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2">{dates.map((date) => <option key={date.value} value={date.value}>{date.label}</option>)}</select></label>
            <label className="text-sm font-medium">Time<select name="time" required className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2">{["09:00", "10:30", "12:00", "14:00", "15:30"].map((time) => <option key={time}>{time}</option>)}</select></label>
          </div>
        </section>

        <section className="rounded-xl border border-brand-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">3. Intake</p>
          <label className="mt-4 block text-sm font-medium">What would you like help with?<textarea name="concerns" required minLength={10} rows={4} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2" placeholder="Tell the doctor about your main concern and when it started." /></label>
          <label className="mt-4 block text-sm font-medium">Relevant medical history<textarea name="medicalHistory" rows={3} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2" /></label>
          <label className="mt-4 block text-sm font-medium">Current medicines or supplements<textarea name="currentMedicines" rows={3} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2" /></label>
        </section>
      </div>

      <aside className="h-fit rounded-xl border border-brand-200 bg-brand-50 p-6 lg:sticky lg:top-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">4. Payment</p>
        <h2 className="mt-3 font-display text-2xl text-brand-900">Confirm your appointment</h2>
        <div className="mt-5 space-y-2 text-sm text-ink/70"><p>Dr. {doctor.firstName} {doctor.lastName}</p><p>{selectedService?.service.name}</p><p>{selectedType?.name}</p></div>
        <div className="mt-6 border-t border-brand-200 pt-5"><p className="text-sm text-ink/60">Consultation fee</p><p className="mt-1 text-3xl font-semibold text-brand-900">₹{((selectedService?.priceMinorUnits ?? 0) / 100).toLocaleString("en-IN")}</p></div>
        <p className="mt-4 text-xs leading-5 text-ink/60">Payments are securely processed by Razorpay when configured. Local development uses a clearly labeled demo payment.</p>
        {status === "error" && <p className="mt-4 text-sm text-red-700">{message}</p>}
        <Button type="submit" disabled={status === "loading"} className="mt-6 w-full disabled:opacity-60">{status === "loading" ? "Confirming…" : "Pay and confirm"}</Button>
      </aside>
    </form>
  );
}