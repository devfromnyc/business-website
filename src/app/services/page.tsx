import Link from "next/link";
import ScrollFade from "@/components/animations/ScrollFade";
import siteContent from "@/data/site-content.json";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ServicesPage() {
  return (
    <div className="flex w-full flex-col gap-16 px-6 pb-20 pt-28 md:gap-20 md:px-10">
      <ScrollFade className="flex max-w-4xl flex-col gap-4">
        <h1 className="text-4xl font-bold text-brand-ink">{siteContent.services.title}</h1>
        <p className="text-lg leading-relaxed text-brand-muted">{siteContent.services.intro}</p>
        <div className="flex flex-row flex-wrap gap-4 pt-2">
          <Link
            href="/services/shopify"
            className="rounded-lg bg-brand-accent px-5 py-3 text-sm font-semibold text-brand-ink transition hover:bg-brand-accent-hover"
          >
            Explore Shopify Services
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border border-brand-border px-5 py-3 text-sm font-semibold text-brand-ink transition hover:bg-brand-sand"
          >
            Start a Shopify Project
          </Link>
        </div>
      </ScrollFade>

      <div className="flex max-w-4xl flex-col gap-16 md:gap-20">
        {siteContent.services.items.map((service) => {
          const id = `service-${slugify(service.title)}`;
          return (
            <ScrollFade key={service.title}>
              <section className="flex flex-col gap-3" aria-labelledby={id}>
                <h2 id={id} className="text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
                  {service.title}
                </h2>
                <p className="text-lg leading-relaxed text-brand-muted">{service.description}</p>
              </section>
            </ScrollFade>
          );
        })}
      </div>
    </div>
  );
}
