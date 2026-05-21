"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import typingBackground from "@/assets/typing.avif";
import HeroTypingBgShell from "@/components/sections/HeroTypingBgShell";
import siteContent from "@/data/site-content.json";

export type HeroHomeTypingBgProps = {
  /** When true, background image moves subtly on scroll (disabled when `prefers-reduced-motion` is set). */
  parallaxScroll?: boolean;
};

const heading = siteContent.hero.heading;
const subheading = siteContent.hero.subheading;
const quote = siteContent.hero.quote;
const totalChars = heading.length + subheading.length + quote.length;

function charDelay(index: number): number {
  if (index < heading.length) return 22;
  if (index < heading.length + subheading.length) return 12;
  return 18;
}

/**
 * Homepage hero: same typewriter + layout as HeroCreamSplit’s text column (no illustration).
 * Background image on a dedicated layer per design spec (no Next/Image fill).
 */
export default function HeroHomeTypingBg({
  parallaxScroll = true,
}: HeroHomeTypingBgProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [typedCount, setTypedCount] = useState(0);
  const [badgeIn, setBadgeIn] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setTypedCount(totalChars);
      setBadgeIn(true);
      return;
    }

    const badgeTimer = window.setTimeout(() => setBadgeIn(true), 80);
    return () => {
      window.clearTimeout(badgeTimer);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || typedCount >= totalChars) return;

    const delay = charDelay(typedCount);
    const id = window.setTimeout(() => {
      setTypedCount((c) => c + 1);
    }, delay);

    return () => window.clearTimeout(id);
  }, [typedCount, reducedMotion]);

  const headingVisible = heading.slice(0, Math.min(typedCount, heading.length));
  const subStart = heading.length;
  const subVisible =
    typedCount > subStart
      ? subheading.slice(0, Math.min(typedCount - subStart, subheading.length))
      : "";
  const quoteStart = subStart + subheading.length;
  const quoteVisible =
    typedCount > quoteStart
      ? quote.slice(0, Math.min(typedCount - quoteStart, quote.length))
      : "";

  const typingHeading = typedCount < heading.length;
  const typingSub =
    typedCount >= heading.length &&
    typedCount < heading.length + subheading.length;
  const typingQuote =
    typedCount >= heading.length + subheading.length && typedCount < totalChars;

  const showCtas = typedCount >= totalChars;

  const typingCursor = (heightClass: string) => (
    <span
      className={`ml-0.5 inline-block w-[3px] ${heightClass} translate-y-0.5 animate-pulse bg-brand-accent align-baseline`}
      aria-hidden
    />
  );

  return (
    <HeroTypingBgShell
      backgroundImage={typingBackground}
      ariaLabel="Introduction"
      parallaxScroll={parallaxScroll}>
      <div className="flex min-h-[400px] min-w-0 flex-col justify-start gap-6 text-left">
        <span
          className={`w-fit rounded-full border border-brand-accent/40 bg-brand-accent/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-brand-paper transition-all duration-500 ease-out ${
            badgeIn ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}>
          Shopify + Fullstack Partner
        </span>

        <h1 className="max-w-[725px] min-h-[135px] text-4xl font-bold leading-tight text-brand-paper md:min-h-[180px] md:text-5xl">
          <span className="sr-only">{heading}</span>
          <span aria-hidden="true">
            {headingVisible}
            {typingHeading ? typingCursor("h-[36px] md:h-[48px]") : null}
          </span>
        </h1>

        <p className="max-w-[600px] min-h-[64px] text-lg text-brand-paper/90">
          <span className="sr-only">{subheading}</span>
          <span aria-hidden="true">
            {subVisible}
            {typingSub ? typingCursor("h-[20px]") : null}
          </span>
        </p>

        <blockquote className="min-h-[36px] border-l-2 border-brand-accent/60 pl-4 italic text-brand-paper/90">
          <span className="sr-only">{quote}</span>
          <span aria-hidden="true">
            {quoteVisible}
            {typingQuote ? typingCursor("h-[20px]") : null}
          </span>
        </blockquote>

        <div
          className={`flex flex-row flex-wrap items-center gap-4 transition-opacity duration-700 ${
            showCtas ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={!showCtas}>
          <Link
            href={siteContent.hero.primaryCta.href}
            tabIndex={showCtas ? 0 : -1}
            className="rounded-lg bg-brand-accent px-6 py-3 text-sm font-semibold text-brand-ink shadow-[0_0_24px_rgba(251,146,60,0.35)] transition hover:bg-brand-accent-hover">
            {siteContent.hero.primaryCta.label}
          </Link>
          <Link
            href={siteContent.hero.secondaryCta.href}
            tabIndex={showCtas ? 0 : -1}
            className="rounded-lg border border-brand-border bg-brand-paper/10 px-6 py-3 text-sm font-semibold text-brand-paper backdrop-blur-sm transition hover:border-brand-accent/50 hover:bg-brand-paper/20">
            {siteContent.hero.secondaryCta.label}
          </Link>
        </div>
      </div>
    </HeroTypingBgShell>
  );
}
