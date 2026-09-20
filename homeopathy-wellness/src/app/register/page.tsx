"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const payload = {
      firstName: (form.elements.namedItem("firstName") as HTMLInputElement).value,
      lastName: (form.elements.namedItem("lastName") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value || undefined,
    };

    const res = await fetch("/api/auth/register", {
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

    router.push("/login");
  }

  return (
    <Container className="flex min-h-[60vh] items-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-brand-900">Create your account</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-ink">First name</label>
              <input name="firstName" required className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-ink">Last name</label>
              <input name="lastName" required className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2" />
            </div>
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
            <label className="text-sm font-medium text-ink">Password</label>
            <input name="password" type="password" required minLength={8} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2" />
            <p className="mt-1 text-xs text-ink/50">At least 8 characters.</p>
          </div>

          {status === "error" && <p className="text-sm text-red-600">{errorMessage}</p>}

          <Button type="submit" disabled={status === "loading"} className="w-full disabled:opacity-60">
            {status === "loading" ? "Creating account…" : "Create account"}
          </Button>
        </form>
        <p className="mt-6 text-sm text-ink/60">
          Already registered? <a href="/login" className="text-brand-700 underline">Log in</a>
        </p>
      </div>
    </Container>
  );
}
