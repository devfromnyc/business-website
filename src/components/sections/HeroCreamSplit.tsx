import Image from "next/image";
import Link from "next/link";
import portfolioIllustration1 from "@/assets/portfolio-illustration-1.svg";
import siteContent from "@/data/site-content.json";

export default function HeroCreamSplit() {
  return (
    <section
      className="relative left-1/2 flex min-h-[calc(100vh-5rem)] w-screen -translate-x-1/2 flex-col overflow-hidden bg-brand-canvas"
      aria-label="Introduction"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-stretch justify-center gap-10 px-6 py-16 md:flex-row md:items-center md:gap-12 lg:gap-16 md:px-10 md:py-20">
        <div className="flex min-w-0 flex-1 flex-col gap-6 text-left">
          <span className="w-fit rounded-full border border-brand-border bg-brand-accent/12 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-brand-ink">
            Shopify + Fullstack Partner
          </span>
          <h1 className="text-4xl font-bold leading-tight text-brand-ink md:text-5xl">
            {siteContent.hero.heading}
          </h1>
          <p className="text-lg text-brand-muted">{siteContent.hero.subheading}</p>
          <blockquote className="border-l-2 border-brand-accent/55 pl-4 italic text-brand-muted">
            {siteContent.hero.quote}
          </blockquote>
          <div className="flex flex-row flex-wrap items-center gap-4">
            <Link
              href={siteContent.hero.primaryCta.href}
              className="rounded-lg bg-brand-accent px-6 py-3 text-sm font-semibold text-brand-ink shadow-sm transition hover:bg-brand-accent-hover"
            >
              {siteContent.hero.primaryCta.label}
            </Link>
            <Link
              href={siteContent.hero.secondaryCta.href}
              className="rounded-lg border border-brand-border bg-brand-paper-strong/90 px-6 py-3 text-sm font-semibold text-brand-ink transition hover:border-brand-muted-light hover:bg-brand-paper-strong"
            >
              {siteContent.hero.secondaryCta.label}
            </Link>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[min(100%,20rem)] shrink-0 md:max-w-sm lg:max-w-md">
          <Image
            src={portfolioIllustration1}
            alt=""
            fill
            priority
            className="object-contain object-right"
            sizes="(min-width: 1024px) 28rem, (min-width: 768px) 24rem, 20rem"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
