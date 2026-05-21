"use client";

import { useEffect, useMemo, useState } from "react";

type ColorRevealSectionProps = {
  lines: string[];
};

export default function ColorRevealSection({ lines }: ColorRevealSectionProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("color-reveal");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const sectionHeight = rect.height;
      const traveled = viewportHeight - rect.top;
      const total = viewportHeight + sectionHeight * 0.6;
      const nextProgress = Math.min(1, Math.max(0, traveled / total));
      setProgress(nextProgress);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const opacities = useMemo(
    () =>
      lines.map((_, index) => {
        const revealPoint = index / lines.length;
        const localProgress = (progress - revealPoint) * lines.length * 1.35;
        return Math.min(1, Math.max(0, localProgress));
      }),
    [lines, progress],
  );

  return (
    <section
      id="color-reveal"
      className="relative left-1/2 w-screen -translate-x-1/2 bg-brand-canvas px-6 pb-10 pt-16 md:px-10 md:pb-14 md:pt-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        {lines.map((line, index) => (
          <p
            key={line}
            className="text-3xl font-bold leading-tight md:text-5xl"
            style={{
              color: "var(--brand-ink)",
              opacity: opacities[index],
              transition: "opacity 220ms ease-out",
            }}>
            {line}
          </p>
        ))}
      </div>
    </section>
  );
}
