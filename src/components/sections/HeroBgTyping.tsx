"use client";

import type { StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import HeroTypingBgShell from "@/components/sections/HeroTypingBgShell";

export type HeroBgTypingCta = {
  label: string;
  href: string;
};

export type HeroBgTypingProps = {
  /** When omitted, no photo background is rendered. */
  backgroundImage?: StaticImageData | null;
  sectionAriaLabel: string;
  eyebrow: string;
  heading: string;
  body: string;
  primaryCta: HeroBgTypingCta;
  secondaryCta: HeroBgTypingCta;
  parallaxScroll?: boolean;
};

function charDelay(index: number, headingLength: number): number {
  if (index < headingLength) return 22;
  return 12;
}

/**
 * Shared full-bleed hero with image background, typewriter heading + body, and CTAs.
 * Used by Shopify and Services pages; each passes its own background image and copy.
 */
export default function HeroBgTyping({
  backgroundImage,
  sectionAriaLabel,
  eyebrow,
  heading,
  body,
  primaryCta,
  secondaryCta,
  parallaxScroll = true,
}: HeroBgTypingProps) {
  const totalChars = heading.length + body.length;

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
    setTypedCount(0);
  }, [heading, body]);

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
  }, [reducedMotion, totalChars]);

  useEffect(() => {
    if (reducedMotion || typedCount >= totalChars) return;

    const delay = charDelay(typedCount, heading.length);
    const id = window.setTimeout(() => {
      setTypedCount((c) => c + 1);
    }, delay);

    return () => window.clearTimeout(id);
  }, [typedCount, reducedMotion, totalChars, heading.length]);

  const headingVisible = heading.slice(0, Math.min(typedCount, heading.length));
  const bodyStart = heading.length;
  const bodyVisible =
    typedCount > bodyStart
      ? body.slice(0, Math.min(typedCount - bodyStart, body.length))
      : "";

  const typingHeading = typedCount < heading.length;
  const typingBody = typedCount >= heading.length && typedCount < totalChars;
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
      ariaLabel={sectionAriaLabel}
      parallaxScroll={parallaxScroll}>
      <div className="flex min-h-[400px] min-w-0 flex-col justify-start gap-6 text-left">
        <span
          className={`w-fit rounded-full border border-brand-accent/40 bg-brand-accent/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-brand-paper transition-all duration-500 ease-out ${
            badgeIn ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}>
          {eyebrow}
        </span>

        <h1 className="text-4xl font-bold leading-tight text-brand-paper md:text-5xl">
          <span className="sr-only">{heading}</span>
          <span aria-hidden="true">
            {headingVisible}
            {typingHeading ? typingCursor("h-[36px] md:h-[48px]") : null}
          </span>
        </h1>

        <p className="max-w-2xl text-lg leading-relaxed text-brand-paper/90">
          <span className="sr-only">{body}</span>
          <span aria-hidden="true">
            {bodyVisible}
            {typingBody ? typingCursor("h-[20px]") : null}
          </span>
        </p>

        <div
          className={`flex flex-row flex-wrap items-center gap-4 transition-opacity duration-700 ${
            showCtas ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={!showCtas}>
          <Link
            href={primaryCta.href}
            tabIndex={showCtas ? 0 : -1}
            className="rounded-lg bg-brand-accent px-6 py-3 text-sm font-semibold text-brand-ink shadow-[0_0_24px_rgba(251,146,60,0.35)] transition hover:bg-brand-accent-hover">
            {primaryCta.label}
          </Link>
          <Link
            href={secondaryCta.href}
            tabIndex={showCtas ? 0 : -1}
            className="rounded-lg border border-brand-border bg-brand-paper/10 px-6 py-3 text-sm font-semibold text-brand-paper backdrop-blur-sm transition hover:border-brand-accent/50 hover:bg-brand-paper/20">
            {secondaryCta.label}
          </Link>
        </div>
      </div>
    </HeroTypingBgShell>
  );
}
