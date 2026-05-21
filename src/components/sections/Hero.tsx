import Image from "next/image";
import Link from "next/link";
import typingAvif from "@/assets/typing.avif";
import siteContent from "@/data/site-content.json";

export default function Hero() {
  return (
    <section className="relative left-1/2 flex min-h-[calc(100vh-5rem)] w-screen -translate-x-1/2 flex-col overflow-hidden border-y border-brand-border/40">
      <Image
        src={typingAvif}
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div
        className="pointer-events-none absolute inset-0 z-1 bg-brand-ink/60"
        aria-hidden
      />
      <div className="relative z-2 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 pb-16 pt-24 md:px-10 md:pt-28">
        <div className="flex max-w-3xl flex-col gap-6">
          <span className="w-fit rounded-full border border-brand-accent/40 bg-brand-accent/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-brand-paper">
            Shopify + Fullstack Partner
          </span>
          <h1 className="text-4xl font-bold leading-tight text-brand-paper md:text-5xl">
            {siteContent.hero.heading}
          </h1>
          <p className="text-lg text-brand-paper/90">
            {siteContent.hero.subheading}
          </p>
          <blockquote className="border-l-2 border-brand-accent/60 pl-4 italic text-brand-paper/90">
            {siteContent.hero.quote}
          </blockquote>
          <div className="flex flex-row flex-wrap items-center gap-4">
            <Link
              href={siteContent.hero.primaryCta.href}
              className="rounded-lg bg-brand-accent px-6 py-3 text-sm font-semibold text-brand-ink shadow-[0_0_24px_rgba(251,146,60,0.35)] transition hover:bg-brand-accent-hover">
              {siteContent.hero.primaryCta.label}
            </Link>
            <Link
              href={siteContent.hero.secondaryCta.href}
              className="rounded-lg border border-brand-border bg-brand-paper/10 px-6 py-3 text-sm font-semibold text-brand-paper backdrop-blur-sm transition hover:border-brand-accent/50 hover:bg-brand-paper/20">
              {siteContent.hero.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
