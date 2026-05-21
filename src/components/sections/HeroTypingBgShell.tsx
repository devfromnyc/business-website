"use client";

import type { StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

const PARALLAX_SCROLL_FACTOR = 0.28;

export type HeroTypingBgShellProps = {
  backgroundImage: StaticImageData;
  ariaLabel: string;
  /** When true, background image moves subtly on scroll (disabled when `prefers-reduced-motion` is set). */
  parallaxScroll?: boolean;
  children: React.ReactNode;
};

/**
 * Shared full-bleed hero shell: parallax background layer, gradient overlay, content column wrapper.
 */
export default function HeroTypingBgShell({
  backgroundImage,
  ariaLabel,
  parallaxScroll = true,
  children,
}: HeroTypingBgShellProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [bgTranslateY, setBgTranslateY] = useState(0);
  const scrollRaf = useRef<number>(0);

  const parallaxActive = parallaxScroll && !reducedMotion;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!parallaxActive) {
      setBgTranslateY(0);
      return;
    }

    const update = () => {
      scrollRaf.current = 0;
      setBgTranslateY(window.scrollY * PARALLAX_SCROLL_FACTOR);
    };

    const onScroll = () => {
      if (scrollRaf.current !== 0) return;
      scrollRaf.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollRaf.current !== 0) {
        window.cancelAnimationFrame(scrollRaf.current);
        scrollRaf.current = 0;
      }
    };
  }, [parallaxActive]);

  return (
    <section
      className="relative left-1/2 flex min-h-[calc(100vh-5rem)] w-screen -translate-x-1/2 flex-col overflow-hidden"
      aria-label={ariaLabel}>
      <div
        className="pointer-events-none absolute inset-x-0 top-[-18%] bottom-[-18%] -z-20"
        style={{
          backgroundImage: `url(${backgroundImage.src})`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          transform: `translate3d(0, ${bgTranslateY}px, 0)`,
          willChange: parallaxActive ? "transform" : undefined,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(160deg,rgba(2,6,23,0.76)_0%,rgba(15,23,42,0.72)_45%,rgba(2,6,23,0.78)_100%)]"
        aria-hidden
      />
      <div className="relative z-0 mx-auto flex w-full max-w-6xl flex-1 flex-col items-stretch justify-center gap-10 px-6 py-16 md:px-10 md:py-20">
        {children}
      </div>
    </section>
  );
}
