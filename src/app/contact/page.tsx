import Link from "next/link";
import ContactForm from "@/components/forms/ContactForm";
import ScrollFade from "@/components/animations/ScrollFade";
import FaqSection from "@/components/sections/FaqSection";
import siteContent from "@/data/site-content.json";

export default function ContactPage() {
  return (
    <div className="flex w-full flex-col gap-10 px-6 pt-28 md:px-10">
      <ScrollFade className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-brand-ink">{siteContent.contact.title}</h1>
        <p className="max-w-3xl text-lg leading-relaxed text-brand-muted">{siteContent.contact.intro}</p>
        <p className="text-brand-muted">{siteContent.contact.availability}</p>
      </ScrollFade>

      <ScrollFade className="flex flex-col gap-6 rounded-xl border border-brand-border bg-brand-paper p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-brand-ink">Get in Touch</h2>
        <ContactForm />
        <p className="text-sm text-brand-muted">
          Prefer direct email?
          <Link
            href={`mailto:${siteContent.contact.email}`}
            className="ml-2 font-medium text-brand-accent underline decoration-brand-accent/50 underline-offset-4 hover:text-brand-accent-hover"
          >
            {siteContent.contact.email}
          </Link>
        </p>
      </ScrollFade>

      <ScrollFade>
        <FaqSection />
      </ScrollFade>
    </div>
  );
}
