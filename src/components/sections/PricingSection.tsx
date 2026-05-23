"use client";

import gsap from "gsap";
import Link from "next/link";
import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import ScrollFade from "@/components/animations/ScrollFade";
import ContactForm from "@/components/forms/ContactForm";
import siteContent from "@/data/site-content.json";

type PlanTier = {
  kind: "plan";
  number: string;
  name: string;
  badge: string | null;
  compareAtPrice: string | null;
  price: string;
  pricePeriod: string;
  subtext?: string;
  features: string[];
  cta: { label: string; href: string };
  footnote?: string;
};

type CustomTier = {
  kind: "custom";
  name: string;
  badge: string;
  headline?: string;
  body?: string;
  tags?: string[];
  useCases?: string[];
  howItWorks?: string;
  cta: { label: string; href: string };
  footnote?: string;
};

/** "banner" = plans on top, custom tier full-width below. "grid" = all tiers in one grid row. */
export type PricingCustomTierLayout = "banner" | "grid";

export type PricingSectionContent = {
  eyebrow: string;
  title: string;
  intro: string | null;
  /** Where the custom tier renders. Default: "banner". */
  customTierLayout?: PricingCustomTierLayout;
  footerCta?: {
    title: string;
    description: string;
    label: string;
    href: string;
  };
  tiers: (PlanTier | CustomTier)[];
};

export type PricingSectionProps = {
  content?: PricingSectionContent;
  /** Overrides `content.customTierLayout`. Default: "banner". */
  customTierLayout?: PricingCustomTierLayout;
  headingId?: string;
  contactAnchorId?: string;
};

const DEFAULT_PRICING_CONTENT =
  siteContent.homepage.pricingSection as PricingSectionContent;

const DEFAULT_CUSTOM_TIER_LAYOUT: PricingCustomTierLayout = "banner";

/** GSAP-driven hover lift. Long `sine.inOut` + few pixels = imperceptible motion at the start of the tween. */
const HOVER_LIFT_PX = 8;
const HOVER_DURATION = 0.55;

const CONVERSATION_REVEAL_DURATION = 0.5;

/** Toggle to hide per-card CTAs while keeping links in the DOM. */
const SHOW_PRICING_CTA = true;
const pricingCtaShellClass = SHOW_PRICING_CTA
  ? "mt-8"
  : "mt-8 hidden h-0 overflow-hidden";

function CheckIcon() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-accent">
      <svg
        className="h-2.5 w-2.5 text-brand-ink"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden>
        <path
          d="M2 6l2.5 2.5L10 3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function CustomTierIcon() {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-paper/15 bg-brand-paper/5">
      <svg
        className="h-5 w-5 text-brand-accent"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
    </span>
  );
}

function PlanTierCard({ tier }: { tier: PlanTier }) {
  return (
    <article
      data-pricing-card
      className="group flex min-h-[420px] flex-col rounded-3xl border border-brand-border bg-brand-paper-strong p-6 shadow-lg will-change-transform transition-shadow duration-500 ease-out hover:shadow-xl">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-sand text-sm font-bold text-brand-ink">
            {tier.number}
          </span>
          <h3 className="text-lg font-semibold text-brand-ink">{tier.name}</h3>
        </div>
        {tier.badge ? (
          <span className="shrink-0 rounded-full bg-brand-accent px-2 py-0.5 text-[10px] font-bold uppercase leading-tight tracking-wide text-brand-ink">
            {tier.badge}
          </span>
        ) : null}
      </div>

      <div className="mt-5">
        {tier.subtext?.trim() ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-muted">
            {tier.subtext}
          </p>
        ) : null}
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          {tier.compareAtPrice ? (
            <span className="text-lg text-brand-muted-light line-through">
              {tier.compareAtPrice}
            </span>
          ) : null}
          <span className="text-3xl font-bold text-brand-ink md:text-4xl">
            {tier.price}
          </span>
          {tier.pricePeriod?.trim() ? (
            <span className="text-sm font-medium text-brand-muted">
              {tier.pricePeriod}
            </span>
          ) : null}
        </div>
      </div>

      <ul className="mt-6 flex flex-1 flex-col gap-2.5 text-sm text-brand-muted">
        {tier.features.map((line) => (
          <li key={line} className="flex gap-2.5">
            <CheckIcon />
            <span>{line}</span>
          </li>
        ))}
      </ul>

      <div className={pricingCtaShellClass}>
        <Link
          href={tier.cta.href}
          className="flex w-full items-center justify-center rounded-full bg-brand-accent px-4 py-3 text-center text-sm font-semibold text-brand-ink shadow-md shadow-brand-ink/10 transition hover:bg-brand-accent-hover">
          {tier.cta.label}
        </Link>
      </div>
      {tier.footnote?.trim() ? (
        <p className="mt-3 text-center text-[11px] text-brand-muted-light">
          {tier.footnote}
        </p>
      ) : null}
    </article>
  );
}

function CustomTierCard({ tier }: { tier: CustomTier }) {
  return (
    <article
      data-pricing-card
      className="group flex min-h-[420px] flex-col rounded-3xl border border-brand-border bg-brand-ink p-6 shadow-xl shadow-brand-ink/25 will-change-transform transition-shadow duration-500 ease-out hover:shadow-2xl hover:shadow-brand-accent/15">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold text-brand-paper">{tier.name}</h3>
        <span className="shrink-0 rounded-full bg-brand-accent px-2 py-0.5 text-[10px] font-bold uppercase leading-tight tracking-wide text-brand-ink">
          {tier.badge}
        </span>
      </div>
      <div className="mt-6 flex flex-1 flex-col gap-4">
        {tier.headline?.trim() ? (
          <p className="text-2xl font-bold leading-tight text-brand-paper md:text-3xl">
            {tier.headline}
          </p>
        ) : null}
        {tier.body?.trim() ? (
          <p className="text-sm leading-relaxed text-brand-paper/90 md:text-base">
            {tier.body}
          </p>
        ) : null}
        {tier.useCases && tier.useCases.length > 0 ? (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-accent">
              Example programs
            </p>
            <ul className="mt-2 flex flex-col gap-2 text-sm leading-snug text-brand-paper/90">
              {tier.useCases.map((line) => (
                <li key={line} className="flex gap-2">
                  <span
                    className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-accent"
                    aria-hidden
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {tier.howItWorks?.trim() ? (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-accent">
              How it works
            </p>
            <p className="mt-2 text-sm leading-relaxed text-brand-paper/85">
              {tier.howItWorks}
            </p>
          </div>
        ) : null}
      </div>
      <div className={pricingCtaShellClass}>
        <Link
          href={tier.cta.href}
          className="flex w-full items-center justify-center rounded-full bg-brand-accent px-4 py-3 text-center text-sm font-semibold text-brand-ink transition hover:bg-brand-accent-hover">
          {tier.cta.label}
        </Link>
      </div>
      {tier.footnote?.trim() ? (
        <p className="mt-4 text-center text-xs leading-relaxed text-brand-paper/80">
          {tier.footnote}
        </p>
      ) : null}
    </article>
  );
}

function CustomTierBanner({ tier }: { tier: CustomTier }) {
  return (
    <article
      data-pricing-card
      className="group grid gap-8 rounded-3xl border border-brand-border bg-brand-ink p-6 shadow-xl shadow-brand-ink/25 will-change-transform transition-shadow duration-500 ease-out hover:shadow-2xl hover:shadow-brand-accent/15 md:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_auto] lg:items-center lg:gap-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <CustomTierIcon />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-brand-paper">
                {tier.name}
              </h3>
              <span className="rounded-full bg-brand-accent px-2 py-0.5 text-[10px] font-bold uppercase leading-tight tracking-wide text-brand-ink">
                {tier.badge}
              </span>
            </div>
            {tier.body?.trim() ? (
              <p className="mt-1 text-sm text-brand-paper/75">{tier.body}</p>
            ) : null}
          </div>
        </div>

        {tier.headline?.trim() ? (
          <p className="text-2xl font-bold leading-tight text-brand-paper md:text-3xl">
            {tier.headline}
          </p>
        ) : null}

        {tier.tags && tier.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tier.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-brand-paper/15 bg-brand-paper/5 px-3 py-1 text-xs font-medium text-brand-paper/90">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 border-brand-paper/10 lg:border-l lg:pl-10">
        {tier.useCases && tier.useCases.length > 0 ? (
          <ul className="flex flex-col gap-3 text-sm leading-snug text-brand-paper/90">
            {tier.useCases.map((line) => (
              <li key={line} className="flex gap-2.5">
                <CheckIcon />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {tier.howItWorks?.trim() ? (
          <p className="text-sm leading-relaxed text-brand-paper/75">
            {tier.howItWorks}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col items-stretch gap-3 lg:min-w-[220px] lg:items-end lg:text-right">
        <div className={pricingCtaShellClass}>
          <Link
            href={tier.cta.href}
            className="flex w-full items-center justify-center rounded-full border border-brand-paper/25 bg-transparent px-6 py-3 text-center text-sm font-semibold text-brand-paper transition hover:border-brand-accent hover:bg-brand-accent hover:text-brand-ink lg:w-auto">
            {tier.cta.label}
          </Link>
        </div>
        {tier.footnote?.trim() ? (
          <p className="text-xs leading-relaxed text-brand-paper/70 lg:max-w-[220px]">
            {tier.footnote}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function PricingTiersGrid({
  planTiers,
  customTier,
  customTierLayout,
  gridRef,
}: {
  planTiers: PlanTier[];
  customTier: CustomTier | undefined;
  customTierLayout: PricingCustomTierLayout;
  gridRef: RefObject<HTMLDivElement | null>;
}) {
  if (customTierLayout === "grid") {
    return (
      <div
        ref={gridRef}
        className="mx-auto mt-10 grid max-w-6xl gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-4">
        {planTiers.map((tier) => (
          <PlanTierCard key={tier.name} tier={tier} />
        ))}
        {customTier ? <CustomTierCard tier={customTier} /> : null}
      </div>
    );
  }

  return (
    <div
      ref={gridRef}
      className="mx-auto mt-10 flex max-w-6xl flex-col gap-5 lg:mt-12 lg:gap-4">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {planTiers.map((tier) => (
          <PlanTierCard key={tier.name} tier={tier} />
        ))}
      </div>
      {customTier ? <CustomTierBanner tier={customTier} /> : null}
    </div>
  );
}

export default function PricingSection({
  content = DEFAULT_PRICING_CONTENT,
  customTierLayout: customTierLayoutProp,
  headingId = "pricing-heading",
  contactAnchorId = "contact",
}: PricingSectionProps) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [conversationOpen, setConversationOpen] = useState(false);
  const conversationPanelRef = useRef<HTMLDivElement | null>(null);
  const conversationWasOpenRef = useRef(false);

  const customTierLayout =
    customTierLayoutProp ??
    content.customTierLayout ??
    DEFAULT_CUSTOM_TIER_LAYOUT;

  useLayoutEffect(() => {
    const panel = conversationPanelRef.current;
    if (!panel) return;

    if (!conversationOpen && !conversationWasOpenRef.current) {
      panel.style.display = "none";
      return;
    }

    if (conversationOpen) {
      conversationWasOpenRef.current = true;
    }

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      gsap.killTweensOf(panel);
      panel.style.display = conversationOpen ? "block" : "none";
      panel.style.height = "";
      panel.style.opacity = conversationOpen ? "1" : "0";
      return;
    }

    gsap.killTweensOf(panel);

    if (conversationOpen) {
      panel.style.display = "block";
      panel.style.overflow = "hidden";
      const targetHeight = panel.scrollHeight;
      gsap.fromTo(
        panel,
        { height: 0, opacity: 0, y: 16 },
        {
          height: targetHeight,
          opacity: 1,
          y: 0,
          duration: CONVERSATION_REVEAL_DURATION,
          ease: "power2.out",
          onComplete: () => {
            gsap.set(panel, { height: "auto", clearProps: "y" });
          },
        },
      );
      return;
    }

    const startHeight = panel.scrollHeight;
    gsap.fromTo(
      panel,
      { height: startHeight, opacity: 1, y: 0 },
      {
        height: 0,
        opacity: 0,
        y: 8,
        duration: CONVERSATION_REVEAL_DURATION * 0.7,
        ease: "power2.in",
        onComplete: () => {
          panel.style.display = "none";
          gsap.set(panel, { clearProps: "height,opacity,y" });
        },
      },
    );
  }, [conversationOpen]);

  useLayoutEffect(() => {
    const root = gridRef.current;
    if (!root) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const cards = root.querySelectorAll<HTMLElement>("[data-pricing-card]");
    const cleanups: Array<() => void> = [];

    cards.forEach((card) => {
      gsap.set(card, { y: 0 });

      const onEnter = () => {
        gsap.killTweensOf(card);
        gsap.to(card, {
          y: -HOVER_LIFT_PX,
          duration: HOVER_DURATION,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const onLeave = () => {
        gsap.killTweensOf(card);
        gsap.to(card, {
          y: 0,
          duration: HOVER_DURATION * 0.85,
          ease: "power2.in",
          overwrite: "auto",
        });
      };

      card.addEventListener("pointerenter", onEnter);
      card.addEventListener("pointerleave", onLeave);

      cleanups.push(() => {
        card.removeEventListener("pointerenter", onEnter);
        card.removeEventListener("pointerleave", onLeave);
        gsap.killTweensOf(card);
        gsap.set(card, { clearProps: "transform" });
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [customTierLayout, content.tiers]);

  const planTiers = content.tiers.filter(
    (tier): tier is PlanTier => tier.kind === "plan",
  );
  const customTier = content.tiers.find(
    (tier): tier is CustomTier => tier.kind === "custom",
  );

  return (
    <ScrollFade className="w-full">
      <section
        className="rounded-3xl border border-brand-border bg-brand-paper px-5 py-12 shadow-sm md:px-8 md:py-14"
        aria-labelledby={headingId}>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
          {content.eyebrow}
        </p>
        <h2
          id={headingId}
          className="mx-auto mt-3 max-w-[600px] text-center text-3xl font-bold tracking-tight text-brand-ink md:text-4xl">
          {content.title}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-base text-brand-muted md:text-lg">
          {content.intro}
        </p>

        <PricingTiersGrid
          planTiers={planTiers}
          customTier={customTier}
          customTierLayout={customTierLayout}
          gridRef={gridRef}
        />

        {content.footerCta ? (
          <div
            id={contactAnchorId}
            className="mx-auto mt-12 max-w-2xl scroll-mt-24 border-t border-brand-border pt-10 text-center md:mt-14 md:pt-12">
            <h3 className="text-xl font-semibold tracking-tight text-brand-ink md:text-2xl">
              {content.footerCta.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-brand-muted md:text-base">
              {content.footerCta.description}
            </p>
            <button
              type="button"
              onClick={() => setConversationOpen((open) => !open)}
              aria-expanded={conversationOpen}
              aria-controls="pricing-conversation-form"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-accent px-8 py-3.5 text-sm font-semibold text-brand-ink shadow-[0_0_28px_rgba(251,146,60,0.25)] transition hover:bg-brand-accent-hover">
              {content.footerCta.label}
            </button>

            <div
              id="pricing-conversation-form"
              ref={conversationPanelRef}
              className="text-left"
              style={{ display: "none" }}
              aria-hidden={!conversationOpen}>
              <div className="mt-8 flex flex-col gap-6 rounded-xl border border-brand-border bg-brand-paper-strong p-6 text-left shadow-sm md:p-8">
                <h4 className="text-xl font-semibold text-brand-ink md:text-2xl">
                  Get in Touch
                </h4>
                <ContactForm />
                <p className="text-sm text-brand-muted">
                  Prefer direct email?
                  <Link
                    href={`mailto:${siteContent.contact.email}`}
                    className="ml-2 font-medium text-brand-accent underline decoration-brand-accent/50 underline-offset-4 hover:text-brand-accent-hover">
                    {siteContent.contact.email}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </ScrollFade>
  );
}
