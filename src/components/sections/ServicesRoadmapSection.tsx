"use client";

import Image, { StaticImageData } from "next/image";
import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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
  /** Viewport heights of scroll runway per step when pinning (>3 tiles). */
  scrollPinStepVh?: number;
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

const PIN_THRESHOLD = 3;
const VISIBLE_TILES_MD = 3;

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

function RoadmapHeader({
  content,
  headingId,
}: {
  content: ServicesRoadmapContent;
  headingId: string;
}) {
  return (
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
  );
}

function ServiceTile({
  step,
  illustration,
  isActive,
}: {
  step: ServiceStep;
  illustration: StaticImageData;
  isActive: boolean;
}) {
  return (
    <article
      className="flex min-w-0 flex-1 flex-col gap-4"
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
            isActive ? "font-medium text-brand-ink" : "text-brand-muted"
          }`}>
          {step.description}
        </p>
      </div>

      <div
        className={`relative mt-1 aspect-4/3 w-full overflow-hidden rounded-xl border transition-[box-shadow,opacity,border-color] duration-500 ${
          isActive
            ? "border-brand-accent/40 bg-brand-panel-raised cyber-glow-ring opacity-100"
            : "border-brand-border/80 bg-brand-panel/80 opacity-55 shadow-none"
        }`}>
        <Image
          src={illustration}
          alt=""
          fill
          className="object-contain p-3 md:p-4"
          sizes="(min-width: 768px) 33vw, 85vw"
          unoptimized
        />
      </div>
    </article>
  );
}

function ProgressDots({
  count,
  activeIndex,
}: {
  count: number;
  activeIndex: number;
}) {
  return (
    <div
      className="mt-8 flex justify-center gap-2"
      role="tablist"
      aria-label="Service progress">
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          role="tab"
          aria-selected={activeIndex === index}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            activeIndex === index
              ? "w-6 bg-brand-accent"
              : "w-1.5 bg-brand-border"
          }`}
        />
      ))}
    </div>
  );
}

function PinnedServicesCarousel({
  steps,
  scrollProgress,
  activeIndex,
}: {
  steps: ServiceStep[];
  scrollProgress: number;
  activeIndex: number;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxOffset, setMaxOffset] = useState(0);

  const measureTrack = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    setMaxOffset(Math.max(0, track.scrollWidth - viewport.clientWidth));
  }, []);

  useLayoutEffect(() => {
    measureTrack();
  }, [measureTrack, steps.length]);

  useEffect(() => {
    window.addEventListener("resize", measureTrack);
    return () => window.removeEventListener("resize", measureTrack);
  }, [measureTrack]);

  const translateX = -scrollProgress * maxOffset;

  return (
    <div
      ref={viewportRef}
      className="mt-6 w-full overflow-hidden md:mt-8">
      <div
        ref={trackRef}
        className="flex w-max items-start gap-6 will-change-transform lg:gap-8"
        style={{ transform: `translate3d(${translateX}px, 0, 0)` }}>
        {steps.map((step, index) => {
          const illustration = illustrationForKey(step.imageKey);
          const isActive = activeIndex === index;

          return (
            <Fragment key={step.label}>
              {index > 0 ? <FlowArrow /> : null}
              <div className="flex w-[min(85vw,340px)] shrink-0 flex-col md:w-[340px] md:max-w-[340px]">
                <ServiceTile
                  step={step}
                  illustration={illustration}
                  isActive={isActive}
                />
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
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
  const stepCount = content.steps.length;
  const useScrollPin = stepCount > PIN_THRESHOLD;
  const scrollPinStepVh = content.scrollPinStepVh ?? 80;

  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const cycleMs = content.cycleIntervalMs ?? 4000;

  const updateScrollFromPin = useCallback(() => {
    const container = pinContainerRef.current;
    if (!container || stepCount <= 1) return;

    const rect = container.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const scrollableDistance = container.offsetHeight - viewportHeight;

    if (scrollableDistance <= 0) {
      setScrollProgress(0);
      setActiveIndex(0);
      return;
    }

    if (rect.top > 0) {
      setScrollProgress(0);
      setActiveIndex(0);
      return;
    }

    if (rect.bottom <= viewportHeight) {
      setScrollProgress(1);
      setActiveIndex(stepCount - 1);
      return;
    }

    const progress = Math.min(1, Math.max(0, -rect.top / scrollableDistance));
    setScrollProgress(progress);

    const isWide = window.matchMedia("(min-width: 768px)").matches;
    const visibleSlots = isWide
      ? Math.min(VISIBLE_TILES_MD, stepCount)
      : 1;
    const maxFocusIndex = Math.max(0, stepCount - visibleSlots);
    const focusProgress = progress * maxFocusIndex;
    const nextIndex = Math.round(focusProgress);
    setActiveIndex(Math.min(stepCount - 1, nextIndex));
  }, [stepCount]);

  useEffect(() => {
    if (!useScrollPin) return;

    updateScrollFromPin();
    window.addEventListener("scroll", updateScrollFromPin, { passive: true });
    window.addEventListener("resize", updateScrollFromPin);

    return () => {
      window.removeEventListener("scroll", updateScrollFromPin);
      window.removeEventListener("resize", updateScrollFromPin);
    };
  }, [useScrollPin, updateScrollFromPin]);

  useEffect(() => {
    if (useScrollPin || stepCount <= 1) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    const id = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % stepCount);
    }, cycleMs);

    return () => window.clearInterval(id);
  }, [cycleMs, stepCount, useScrollPin]);

  const bgClass =
    variant === "alt"
      ? "bg-gradient-to-b from-brand-sand-mid via-brand-canvas to-brand-sand-mid"
      : "bg-gradient-to-b from-brand-panel via-brand-canvas to-brand-panel";

  if (useScrollPin) {
    const pinHeightVh = stepCount * scrollPinStepVh;

    return (
      <div
        ref={pinContainerRef}
        className="relative left-1/2 w-screen -translate-x-1/2"
        style={{ height: `${pinHeightVh}vh` }}>
        <section
          id={sectionId}
          className={`sticky top-0 flex min-h-dvh scroll-mt-24 flex-col justify-center text-brand-ink ${bgClass}`}
          aria-labelledby={headingId}>
          <div className="mx-auto w-full max-w-6xl px-6 py-10 md:px-10 md:py-12">
            <RoadmapHeader
              content={content}
              headingId={headingId}
            />

            <PinnedServicesCarousel
              steps={content.steps}
              scrollProgress={scrollProgress}
              activeIndex={activeIndex}
            />

            <ProgressDots count={stepCount} activeIndex={activeIndex} />
          </div>
        </section>
      </div>
    );
  }

  return (
    <section
      id={sectionId}
      className={`relative left-1/2 w-screen -translate-x-1/2 scroll-mt-24 text-brand-ink ${bgClass}`}
      aria-labelledby={headingId}>
      <div className="mx-auto w-full max-w-6xl px-6 py-12 md:px-10 md:py-16">
        <RoadmapHeader content={content} headingId={headingId} />

        <div className="mt-6 flex flex-col items-stretch gap-10 md:mt-8 md:flex-row md:items-start md:justify-center md:gap-6 lg:gap-8">
          {content.steps.map((step, index) => {
            const isActive = activeIndex === index;
            const illustration = illustrationForKey(step.imageKey);

            return (
              <Fragment key={step.label}>
                {index > 0 ? <FlowArrow /> : null}
                <div className="flex min-w-0 flex-1 flex-col md:max-w-[340px] lg:max-w-none">
                  <ServiceTile
                    step={step}
                    illustration={illustration}
                    isActive={isActive}
                  />
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
