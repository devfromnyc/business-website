import Link from "next/link";
import ScrollFade from "@/components/animations/ScrollFade";
import siteContent from "@/data/site-content.json";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ShopifyServicesPage() {
  return (
    <div className="flex w-full flex-col gap-16 px-6 pb-20 pt-28 md:gap-20 md:px-10">
      <ScrollFade className="flex max-w-4xl flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">Service detail</p>
        <h1 className="text-4xl font-bold text-brand-ink">{siteContent.shopifyServicePage.title}</h1>
        <p className="text-lg leading-relaxed text-brand-muted">{siteContent.shopifyServicePage.intro}</p>
      </ScrollFade>

      <div className="flex max-w-4xl flex-col gap-16 md:gap-20">
        {siteContent.shopifyServicePage.items.map((item) => {
          const id = `shopify-service-${slugify(item.title)}`;
          return (
            <ScrollFade key={item.title}>
              <section className="flex flex-col gap-3" aria-labelledby={id}>
                <h2 id={id} className="text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
                  {item.title}
                </h2>
                <p className="text-lg leading-relaxed text-brand-muted">{item.description}</p>
              </section>
            </ScrollFade>
          );
        })}
      </div>

      <ScrollFade className="max-w-4xl">
        <section className="flex flex-col gap-4" aria-labelledby="shopify-deliverables-heading">
          <h2 id="shopify-deliverables-heading" className="text-2xl font-semibold tracking-tight text-brand-ink">
            What you can expect
          </h2>
          <ul className="flex list-disc flex-col gap-3 pl-5 text-lg leading-relaxed text-brand-muted marker:text-brand-accent">
            {siteContent.shopifyServicePage.deliverables.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      </ScrollFade>

      <ScrollFade className="flex flex-row flex-wrap items-center gap-4">
        <Link
          href="/contact"
          className="rounded-lg bg-brand-accent px-6 py-3 text-sm font-semibold text-brand-ink transition hover:bg-brand-accent-hover"
        >
          Discuss Your Shopify Project
        </Link>
        <Link
          href="/services"
          className="rounded-lg border border-brand-border px-6 py-3 text-sm font-semibold text-brand-ink transition hover:bg-brand-sand"
        >
          Back to Services
        </Link>
      </ScrollFade>
    </div>
  );
}
