"use client";

import { useState } from "react";
import siteContent from "@/data/site-content.json";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="flex flex-col gap-6 rounded-2xl cyber-panel p-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-brand-ink">FAQs</h2>
        <p className="text-brand-muted">
          Quick answers about engagement models, technical scope, and how we can work together.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {siteContent.faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <article
              key={faq.question}
              className="overflow-hidden rounded-lg border border-brand-border bg-brand-panel-raised"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full flex-row items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <span className="text-base font-semibold text-brand-ink">{faq.question}</span>
                <span className="text-brand-accent">{isOpen ? "-" : "+"}</span>
              </button>
              {isOpen ? <p className="px-5 pb-5 text-brand-muted">{faq.answer}</p> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
