"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import HeroTypingBgShell from "@/components/sections/HeroTypingBgShell";
import siteContent from "@/data/site-content.json";
import {
  resolveHeroBackground,
  resolveHeroIllustration,
} from "@/lib/hero-assets";

type HeroContent = {
  badge?: string;
  heading: string;
  subheading: string;
  quote: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  backgroundImageKey?: string | null;
  sideIllustrationKey?: string | null;
  sideIllustrationAlt?: string;
};

export type HeroHomeTypingBgProps = {
  /** When true, background image moves subtly on scroll (disabled when `prefers-reduced-motion` is set). */
  parallaxScroll?: boolean;
  /** Overrides `hero.backgroundImageKey` in site content. Pass `null` to force no photo. */
  backgroundImage?: StaticImageData | null;
  /** Overrides `hero.sideIllustrationKey`. Pass `null` to hide the side illustration. */
  sideIllustration?: StaticImageData | null;
  sideIllustrationAlt?: string;
};

const hero = siteContent.hero as HeroContent;

const heading = hero.heading;
const subheading = hero.subheading;
const quote = hero.quote;
const totalChars = heading.length + subheading.length + quote.length;

function charDelay(index: number): number {
  if (index < heading.length) return 22;
  if (index < heading.length + subheading.length) return 12;
  return 18;
}

function resolveOptionalImage(
  prop: StaticImageData | null | undefined,
  jsonKey: string | null | undefined,
  resolver: (key: string | null | undefined) => StaticImageData | undefined,
): StaticImageData | undefined {
  if (prop === null) return undefined;
  if (prop !== undefined) return prop;
  return resolver(jsonKey);
}

/**
 * Homepage hero: typewriter copy with optional photo background and optional side illustration.
 */
export default function HeroHomeTypingBg({
  parallaxScroll = true,
  backgroundImage: backgroundImageProp,
  sideIllustration: sideIllustrationProp,
  sideIllustrationAlt: sideIllustrationAltProp,
}: HeroHomeTypingBgProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [typedCount, setTypedCount] = useState(0);
  const [badgeIn, setBadgeIn] = useState(false);
  const [artIn, setArtIn] = useState(false);

  const backgroundImage = useMemo(
    () =>
      resolveOptionalImage(
        backgroundImageProp,
        hero.backgroundImageKey,
        resolveHeroBackground,
      ),
    [backgroundImageProp],
  );

  const sideIllustration = useMemo(
    () =>
      resolveOptionalImage(
        sideIllustrationProp,
        hero.sideIllustrationKey,
        resolveHeroIllustration,
      ),
    [sideIllustrationProp],
  );

  const sideIllustrationAlt =
    sideIllustrationAltProp ?? hero.sideIllustrationAlt ?? "";

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
      setArtIn(true);
      return;
    }

    const badgeTimer = window.setTimeout(() => setBadgeIn(true), 80);
    const artTimer = window.setTimeout(() => setArtIn(true), 280);
    return () => {
      window.clearTimeout(badgeTimer);
      window.clearTimeout(artTimer);
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
      backgroundImage={backgroundImage ?? null}
      ariaLabel="Introduction"
      parallaxScroll={parallaxScroll}>
      <div
        className={`flex w-full flex-col gap-10 ${
          sideIllustration
            ? "md:flex-row md:items-center md:justify-between md:gap-12 lg:gap-16"
            : ""
        }`}>
        <div className="flex min-h-[400px] min-w-0 flex-col justify-start gap-6 text-left md:flex-1">
          <span
            className={`w-fit rounded-full border border-brand-accent/40 bg-brand-accent/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-brand-paper transition-all duration-500 ease-out ${
              badgeIn ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}>
            {hero.badge ?? "Shopify + Fullstack Partner"}
          </span>

          <h1 className="max-w-[725px] min-h-[135px] text-4xl font-bold leading-[1.2] text-brand-paper md:min-h-[130px]">
            <span className="sr-only">{heading}</span>
            <span aria-hidden="true">
              {headingVisible}
              {typingHeading ? typingCursor("h-[2.25rem]") : null}
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
              href={hero.primaryCta.href}
              tabIndex={showCtas ? 0 : -1}
              className="rounded-lg bg-brand-accent px-6 py-3 text-sm font-semibold text-brand-accent-foreground shadow-[0_0_24px_var(--brand-glow)] transition hover:bg-brand-accent-hover hover:shadow-[0_0_32px_var(--brand-glow-strong)]">
              {hero.primaryCta.label}
            </Link>
            <Link
              href={hero.secondaryCta.href}
              tabIndex={showCtas ? 0 : -1}
              className="rounded-lg border border-brand-border bg-brand-paper/10 px-6 py-3 text-sm font-semibold text-brand-paper backdrop-blur-sm transition hover:border-brand-accent/50 hover:bg-brand-paper/20">
              {hero.secondaryCta.label}
            </Link>
          </div>
        </div>

        {sideIllustration ? (
          <div
            className={`flex w-full shrink-0 items-center justify-center transition-all duration-700 ease-out md:max-w-md md:flex-1 md:justify-end lg:max-w-lg ${
              artIn
                ? "translate-x-0 opacity-100"
                : "translate-x-8 opacity-0 md:translate-x-16"
            }`}>
            <div className="relative aspect-square w-full max-w-[min(100%,20rem)] md:max-w-sm lg:max-w-md">
              <Image
                src={sideIllustration}
                alt={sideIllustrationAlt}
                fill
                priority
                className="object-contain object-center md:object-right"
                sizes="(min-width: 1024px) 28rem, (min-width: 768px) 24rem, 20rem"
                unoptimized
              />
            </div>
          </div>
        ) : null}
      </div>
    </HeroTypingBgShell>
  );
}
