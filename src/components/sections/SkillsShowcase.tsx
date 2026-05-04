"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";
import siteContent from "@/data/site-content.json";

type SkillsSection = {
  eyebrow: string;
  title: string;
  intro: string;
  skills: string[];
};

const skillsBlock = siteContent.homepage.skillsSection as SkillsSection;

const breakoutBleed =
  "relative w-screen max-w-[100vw] shrink-0 ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]";

const pillLabelClassName =
  "inline-block whitespace-nowrap rounded-full border border-brand-border bg-brand-paper-strong px-3 py-2 text-center text-xs font-semibold text-brand-ink shadow-sm sm:px-4 sm:py-2.5 sm:text-sm md:px-5 md:py-3 md:text-base";

function entryRotation(index: number) {
  const pattern = [-10, 8, -6, 12, -8, 7, -12, 9, -7, 11, -9, 8, -11, 10];
  return pattern[index % pattern.length] ?? 0;
}

export default function SkillsShowcase() {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const skills = skillsBlock.skills;
  const skillsSignature = skills.join("|");

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const panel = panelRef.current;
    if (!panel) return;

    const list = panel.querySelector<HTMLElement>("[data-skill-list]");
    if (!list) return;

    const pills = list.querySelectorAll<HTMLElement>("[data-skill-pill]");
    if (pills.length === 0) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      pills.forEach((pill) => {
        gsap.set(pill, { clearProps: "all" });
      });
      return;
    }

    let played = false;

    const ctx = gsap.context(() => {
      pills.forEach((pill, i) => {
        gsap.set(pill, {
          opacity: 0,
          y: 96,
          rotation: entryRotation(i),
          transformOrigin: "50% 50%",
          force3D: true,
        });
      });

      const tl = gsap.timeline({ paused: true });

      pills.forEach((pill, i) => {
        tl.to(
          pill,
          {
            opacity: 1,
            y: 0,
            rotation: 0,
            duration: 0.62,
            ease: "back.out(1.35)",
          },
          i * 0.055,
        );
      });

      const playCascade = () => {
        if (played) return;
        played = true;
        tl.restart(true);
      };

      ScrollTrigger.create({
        trigger: list,
        start: "top 88%",
        once: true,
        onEnter: playCascade,
      });

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        requestAnimationFrame(() => {
          if (played) return;
          const r = list.getBoundingClientRect();
          const vh = window.innerHeight;
          if (r.top < vh * 0.92 && r.bottom > 0) {
            playCascade();
          }
        });
      });
    }, panel);

    const refresh = () => ScrollTrigger.refresh();
    requestAnimationFrame(() => {
      requestAnimationFrame(refresh);
    });
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [skillsSignature]);

  return (
    <section
      className={`${breakoutBleed} border-y border-brand-border/60 bg-brand-canvas`}
      aria-labelledby="skills-showcase-heading"
    >
      <div
        ref={panelRef}
        className="relative flex flex-col bg-brand-canvas px-6 py-16 md:px-10 md:py-24"
      >
        <p className="mx-auto mb-6 max-w-2xl rounded-full border border-brand-border bg-brand-accent/12 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink md:text-sm">
          {skillsBlock.eyebrow}
        </p>

        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <h2
            id="skills-showcase-heading"
            className="text-3xl font-bold tracking-tight text-brand-ink md:text-4xl"
          >
            {skillsBlock.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-brand-muted md:text-lg">
            {skillsBlock.intro}
          </p>
        </div>

        <div className="relative z-10 mx-auto mt-4 w-full max-w-5xl flex-1 px-0 pb-2 pt-2 md:mt-6 md:pb-4 md:pt-3">
          <p
            className="pointer-events-none absolute inset-0 flex items-center justify-center text-[clamp(3.5rem,18vw,11rem)] font-bold leading-none tracking-tighter text-brand-ink/6"
            aria-hidden
          >
            Skills
          </p>

          <div
            data-skill-list
            role="list"
            className="relative mx-auto flex min-h-[min(22vh,200px)] w-full max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-3 px-1 py-6 sm:gap-x-2.5 sm:gap-y-3.5 sm:py-7 md:gap-x-3 md:gap-y-4 md:py-8"
          >
            {skills.map((label, i) => (
              <div
                key={`${i}-${label}`}
                role="listitem"
                data-skill-pill
                className="shrink-0 will-change-transform"
              >
                <span className={pillLabelClassName}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
