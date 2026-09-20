"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

export default function LoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const result = await signIn("credentials", { email, password, redirect: false });

    if (result?.error) {
      setStatus("error");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <Container className="flex min-h-[60vh] items-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-brand-900">Log in</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium text-ink">Email</label>
            <input name="email" type="email" required className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">Password</label>
            <input name="password" type="password" required className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2" />
          </div>
          {status === "error" && (
            <p className="text-sm text-red-600">Incorrect email or password.</p>
          )}
          <Button type="submit" disabled={status === "loading"} className="w-full disabled:opacity-60">
            {status === "loading" ? "Logging in…" : "Log in"}
          </Button>
        </form>
        <p className="mt-6 text-sm text-ink/60">
          New here? <a href="/register" className="text-brand-700 underline">Create an account</a>
        </p>
      </div>
    </Container>
  );
}
