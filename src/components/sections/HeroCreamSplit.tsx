"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import portfolioIllustration1 from "@/assets/portfolio-illustration-1.svg";
import siteContent from "@/data/site-content.json";

const heading = siteContent.hero.heading;
const subheading = siteContent.hero.subheading;
const quote = siteContent.hero.quote;
const totalChars = heading.length + subheading.length + quote.length;

function charDelay(index: number): number {
  if (index < heading.length) return 22;
  if (index < heading.length + subheading.length) return 12;
  return 18;
}

export default function HeroCreamSplit() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [typedCount, setTypedCount] = useState(0);
  const [artIn, setArtIn] = useState(false);
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
      setArtIn(true);
      setBadgeIn(true);
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
    <section
      className="relative left-1/2 flex min-h-[calc(100vh-5rem)] w-screen -translate-x-1/2 flex-col bg-brand-canvas"
      aria-label="Introduction">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-stretch justify-center gap-10 px-6 py-16 md:flex-row md:items-stretch md:gap-12 lg:gap-16 md:px-10 md:py-20">
        <div className="flex min-h-[400px] min-w-0 flex-1 flex-col justify-start gap-6 text-left">
          <span
            className={`w-fit rounded-full border border-brand-border bg-brand-accent/12 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-brand-ink transition-all duration-500 ease-out ${
              badgeIn ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}>
            Shopify + Fullstack Partner
          </span>

          <h1 className="min-h-[99px] text-4xl font-bold leading-tight text-brand-ink md:min-h-[120px] md:text-5xl">
            <span className="sr-only">{heading}</span>
            <span aria-hidden="true">
              {headingVisible}
              {typingHeading ? typingCursor("h-[36px] md:h-[48px]") : null}
            </span>
          </h1>

          <p className="min-h-[63px] text-lg text-brand-muted md:min-h-[50px]">
            <span className="sr-only">{subheading}</span>
            <span aria-hidden="true">
              {subVisible}
              {typingSub ? typingCursor("h-[20px]") : null}
            </span>
          </p>

          <blockquote className="min-h-[28px] border-l-2 border-brand-accent/55 pl-4 italic text-brand-muted">
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
              className="rounded-lg bg-brand-accent px-6 py-3 text-sm font-semibold text-brand-ink shadow-sm transition hover:bg-brand-accent-hover">
              {siteContent.hero.primaryCta.label}
            </Link>
            <Link
              href={siteContent.hero.secondaryCta.href}
              tabIndex={showCtas ? 0 : -1}
              className="rounded-lg border border-brand-border bg-brand-paper-strong/90 px-6 py-3 text-sm font-semibold text-brand-ink transition hover:border-brand-muted-light hover:bg-brand-paper-strong">
              {siteContent.hero.secondaryCta.label}
            </Link>
          </div>
        </div>

        <div
          className={`flex w-full shrink-0 items-start justify-start transition-all duration-700 ease-out md:min-h-[400px] md:max-w-md md:flex-1 lg:max-w-lg ${
            artIn
              ? "translate-x-0 opacity-100"
              : "translate-x-16 opacity-0 md:translate-x-24"
          }`}>
          <div className="relative aspect-square w-full max-w-[min(100%,20rem)] md:max-w-sm lg:max-w-md">
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
      </div>
    </section>
  );
}
