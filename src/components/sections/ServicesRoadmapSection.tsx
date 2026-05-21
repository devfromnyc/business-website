"use client";

import Image, { StaticImageData } from "next/image";
import { Fragment, useEffect, useState } from "react";
import portfolioIllustration12 from "@/assets/portfolio-illustration-12.svg";
import portfolioIllustration13 from "@/assets/portfolio-illustration-13.svg";
import portfolioIllustration14 from "@/assets/portfolio-illustration-14.svg";
import portfolioIllustration15 from "@/assets/portfolio-illustration-15.svg";
import portfolioIllustration16 from "@/assets/portfolio-illustration-16.svg";
import portfolioIllustration17 from "@/assets/portfolio-illustration-17.svg";
import portfolioIllustration18 from "@/assets/portfolio-illustration-18.svg";
import portfolioIllustration19 from "@/assets/portfolio-illustration-19.svg";
import portfolioIllustration20 from "@/assets/portfolio-illustration-20.svg";
import portfolioIllustration21 from "@/assets/portfolio-illustration-21.svg";

export type ParagraphSegment = {
  text: string;
  emphasis?: boolean;
};

export type ServiceStep = {
  label: string;
  description: string;
  imageKey: string;
};

export type ServicesRoadmapContent = {
  eyebrow: string;
  title: string;
  paragraphSegments: ParagraphSegment[];
  steps: ServiceStep[];
  cycleIntervalMs?: number;
};

const illustrationByKey: Record<string, StaticImageData> = {
  portfolioIllustration12,
  portfolioIllustration13,
  portfolioIllustration14,
  portfolioIllustration15,
  portfolioIllustration16,
  portfolioIllustration17,
  portfolioIllustration18,
  portfolioIllustration19,
  portfolioIllustration20,
  portfolioIllustration21,
};

function illustrationForKey(key: string): StaticImageData {
  return illustrationByKey[key] ?? portfolioIllustration13;
}

function FlowArrow() {
  return (
    <span
      className="hidden shrink-0 self-center px-1 pt-16 text-2xl text-brand-muted-light md:inline"
      aria-hidden>
      →
    </span>
  );
}

type ServicesRoadmapSectionProps = {
  content: ServicesRoadmapContent;
  sectionId?: string;
  headingId: string;
  variant?: "default" | "alt";
};

export default function ServicesRoadmapSection({
  content,
  sectionId,
  headingId,
  variant = "default",
}: ServicesRoadmapSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const cycleMs = content.cycleIntervalMs ?? 4000;
  const stepCount = content.steps.length;

  useEffect(() => {
    if (stepCount <= 1) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    const id = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % stepCount);
    }, cycleMs);

    return () => window.clearInterval(id);
  }, [cycleMs, stepCount]);

  const bgClass =
    variant === "alt"
      ? "bg-brand-sand-mid"
      : "bg-brand-paper-strong";

  return (
    <section
      id={sectionId}
      className={`relative left-1/2 w-screen -translate-x-1/2 scroll-mt-24 text-brand-ink ${bgClass}`}
      aria-labelledby={headingId}>
      <div className="mx-auto w-full max-w-6xl px-6 py-12 md:px-10 md:py-16">
        <header className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-accent">
            {content.eyebrow}
          </p>
          <h2
            id={headingId}
            className="text-3xl font-bold tracking-tight text-brand-ink md:text-4xl lg:text-[2.75rem] lg:leading-tight">
            {content.title}
          </h2>
          <p className="text-base leading-relaxed text-brand-muted md:text-lg">
            {content.paragraphSegments.map((segment, index) =>
              segment.emphasis ? (
                <span
                  key={`${segment.text}-${index}`}
                  className="font-semibold text-brand-ink">
                  {segment.text}
                </span>
              ) : (
                <span key={`${segment.text}-${index}`}>{segment.text}</span>
              ),
            )}
          </p>
        </header>

        <div className="mt-12 flex flex-col items-stretch gap-10 md:mt-16 md:flex-row md:items-start md:justify-center md:gap-6 lg:gap-8">
          {content.steps.map((step, index) => {
            const isActive = activeIndex === index;
            const illustration = illustrationForKey(step.imageKey);

            return (
              <Fragment key={step.label}>
                {index > 0 ? <FlowArrow /> : null}
                <article
                  className="flex min-w-0 flex-1 flex-col gap-4 md:max-w-[340px] lg:max-w-none"
                  aria-current={isActive ? "step" : undefined}>
                  <div className="flex flex-col gap-2 transition-colors duration-500">
                    <p
                      className={`font-mono text-[11px] font-medium uppercase tracking-[0.12em] transition-colors duration-500 ${
                        isActive ? "text-brand-ink" : "text-brand-muted-light"
                      }`}>
                      {step.label}
                    </p>
                    <p
                      className={`text-sm leading-snug transition-colors duration-500 md:text-[15px] ${
                        isActive
                          ? "font-medium text-brand-ink"
                          : "text-brand-muted"
                      }`}>
                      {step.description}
                    </p>
                  </div>

                  <div
                    className={`relative mt-1 aspect-4/3 w-full overflow-hidden rounded-xl border transition-[box-shadow,opacity,border-color] duration-500 ${
                      isActive
                        ? "border-brand-accent/40 bg-brand-paper opacity-100 shadow-[0_0_0_1px_rgb(251_146_60/0.25),0_8px_32px_rgb(251_146_60/0.22)]"
                        : "border-brand-border/80 bg-brand-paper/80 opacity-55 shadow-none"
                    }`}>
                    <Image
                      src={illustration}
                      alt=""
                      fill
                      className="object-contain p-3 md:p-4"
                      sizes="(min-width: 768px) 33vw, 100vw"
                      unoptimized
                    />
                  </div>
                </article>
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
