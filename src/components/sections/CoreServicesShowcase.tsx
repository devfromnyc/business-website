"use client";

import Image, { StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import portfolioIllustration2 from "@/assets/portfolio-illustration-2.svg";
import portfolioIllustration9 from "@/assets/portfolio-illustration-9.svg";
import portfolioIllustration5 from "@/assets/portfolio-illustration-5.svg";
import portfolioIllustration7 from "@/assets/portfolio-illustration-7.svg";
import siteContent from "@/data/site-content.json";

const showcaseIllustrations: StaticImageData[] = [
  portfolioIllustration2,
  portfolioIllustration9,
  portfolioIllustration7,
  portfolioIllustration5,
];

export default function CoreServicesShowcase() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const services = siteContent.services.items.slice(0, 4);
  const totalSteps = services.length;
  const activeIndex = Math.min(
    totalSteps - 1,
    Math.max(0, Math.floor(progress * totalSteps)),
  );

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      const scrollDistance = rect.height - viewport;
      const traveled = Math.max(0, -rect.top);
      const next =
        scrollDistance > 0
          ? Math.min(1, Math.max(0, traveled / scrollDistance))
          : 0;
      setProgress(next);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative left-1/2 w-screen -translate-x-1/2 scroll-mt-24"
      style={{ height: "300vh" }}
      aria-label="Core services showcase">
      <div className="sticky top-0 h-screen overflow-hidden bg-brand-panel-raised text-brand-ink">
        <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-center px-6 md:px-10">
          <div className="relative h-80 w-80 md:h-96 md:w-96">
            {services.map((service, index) => {
              const imageAsset =
                showcaseIllustrations[index % showcaseIllustrations.length];
              const isActive = index === activeIndex;

              return (
                <Image
                  key={service.title}
                  src={imageAsset}
                  alt={`${service.title} visual`}
                  fill
                  className={`absolute inset-0 object-contain transition-opacity duration-700 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                  sizes="(min-width: 768px) 24rem, 20rem"
                  unoptimized
                  priority={index === 0}
                />
              );
            })}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 mx-auto w-full max-w-6xl px-6 md:px-10">
          <div className="relative h-full w-full">
            {services.map((service, index) => {
              const isActive = index === activeIndex;
              const isLeft = index % 2 === 0;

              return (
                <article
                  key={service.title}
                  aria-hidden={!isActive}
                  className={`absolute top-1/2 max-w-xs -translate-y-1/2 transition-all duration-500 2xl:max-w-md ${
                    isLeft ? "left-0 text-left" : "right-0 text-left"
                  } ${isActive ? "opacity-100" : "opacity-0"}`}>
                  <h3 className="text-2xl font-bold leading-tight text-brand-ink md:text-3xl">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-lg leading-relaxed text-brand-muted md:text-xl">
                    {service.description}
                  </p>
                </article>
              );
            })}

            <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-row items-center gap-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === activeIndex
                      ? "w-8 bg-brand-accent shadow-[0_0_12px_rgba(251,146,60,0.45)]"
                      : "w-4 bg-brand-border"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
