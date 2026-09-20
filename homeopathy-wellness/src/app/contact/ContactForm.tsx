"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/Button";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const payload = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!json.success) {
        setStatus("error");
        setErrorMessage(json.error?.message ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Network error — please check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <p className="rounded-card bg-brand-50 p-4 text-sm text-brand-800">
        Thanks — we've received your message and will get back to you shortly.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-ink">Name</label>
        <input name="name" required className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2" />
      </div>
      <div>
        <label className="text-sm font-medium text-ink">Email</label>
        <input name="email" type="email" required className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2" />
      </div>
      <div>
        <label className="text-sm font-medium text-ink">Phone (optional)</label>
        <input name="phone" className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2" />
      </div>
      <div>
        <label className="text-sm font-medium text-ink">Message</label>
        <textarea name="message" required rows={4} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2" />
      </div>

      {status === "error" && <p className="text-sm text-red-600">{errorMessage}</p>}

      <Button type="submit" disabled={status === "loading"} className="w-full disabled:opacity-60">
        {status === "loading" ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
