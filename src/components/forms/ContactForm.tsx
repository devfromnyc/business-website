"use client";

import { FormEvent, useState } from "react";

type FormState = {
  name: string;
  email: string;
  company: string;
  serviceInterest: string;
  timeline: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  serviceInterest: "",
  timeline: "",
  message: "",
};

const inputClassName =
  "rounded-md border border-brand-border bg-brand-paper-strong px-3 py-2 text-brand-ink outline-none ring-brand-accent/40 focus:ring-2";

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(data.error || "Unable to submit form.");
      }

      setStatus("success");
      setFeedback(data.message || "Thanks! Your message was sent.");
      setForm(initialState);
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Something went wrong.");
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-row flex-wrap gap-4">
        <label className="flex min-w-[220px] flex-1 flex-col gap-2 text-sm text-brand-ink">
          Name
          <input
            required
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            className={inputClassName}
            placeholder="Your name"
          />
        </label>
        <label className="flex min-w-[220px] flex-1 flex-col gap-2 text-sm text-brand-ink">
          Email
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            className={inputClassName}
            placeholder="you@company.com"
          />
        </label>
      </div>

      <div className="flex flex-row flex-wrap gap-4">
        <label className="flex min-w-[220px] flex-1 flex-col gap-2 text-sm text-brand-ink">
          Company
          <input
            value={form.company}
            onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
            className={inputClassName}
            placeholder="Company name"
          />
        </label>
        <label className="flex min-w-[220px] flex-1 flex-col gap-2 text-sm text-brand-ink">
          Timeline
          <input
            value={form.timeline}
            onChange={(event) => setForm((prev) => ({ ...prev, timeline: event.target.value }))}
            className={inputClassName}
            placeholder="e.g. Start next month"
          />
        </label>
      </div>

      <label className="flex flex-col gap-2 text-sm text-brand-ink">
        Service Interest
        <input
          value={form.serviceInterest}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, serviceInterest: event.target.value }))
          }
          className={inputClassName}
          placeholder="Shopify optimization, app build, consulting, etc."
        />
      </label>

      <label className="flex flex-col gap-2 text-sm text-brand-ink">
        Project Details
        <textarea
          required
          value={form.message}
          onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
          className={`min-h-36 ${inputClassName}`}
          placeholder="Tell me about your goals, current setup, and what support you need."
        />
      </label>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-fit rounded-lg bg-brand-accent px-6 py-3 text-sm font-semibold text-brand-ink transition hover:bg-brand-accent-hover disabled:opacity-60"
      >
        {status === "loading" ? "Sending..." : "Send Inquiry"}
      </button>

      {feedback ? (
        <p className={status === "success" ? "text-brand-accent" : "text-rose-600"}>{feedback}</p>
      ) : null}
    </form>
  );
}
