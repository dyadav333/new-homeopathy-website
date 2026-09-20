"use client";

import { FormEvent, useState } from "react";

export function ConsultationForm({ appointmentId }: { appointmentId: string }) {
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/doctor/appointments/${appointmentId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) });
    const result = await response.json();
    setMessage(result.success ? "Consultation saved." : result.error?.message ?? "Could not save consultation.");
    if (result.success) event.currentTarget.reset();
  }
  return <form onSubmit={submit} className="doctor-consultation-form"><select name="status" defaultValue="IN_PROGRESS"><option value="IN_PROGRESS">Start consultation</option><option value="COMPLETED">Complete consultation</option><option value="FOLLOW_UP_REQUIRED">Follow-up required</option></select><textarea name="summary" required minLength={5} rows={3} placeholder="Consultation summary" /><textarea name="note" rows={3} placeholder="Private clinical note" /><div><button type="submit">Save consultation</button><span>{message}</span></div></form>;
}