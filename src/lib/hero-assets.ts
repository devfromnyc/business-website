import type { StaticImageData } from "next/image";
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
import typingBackground from "@/assets/typing.avif";

export const heroBackgroundByKey: Record<string, StaticImageData> = {
  typingBackground,
};

export const heroIllustrationByKey: Record<string, StaticImageData> = {
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

export function resolveHeroBackground(
  key: string | null | undefined,
): StaticImageData | undefined {
  if (!key) return undefined;
  return heroBackgroundByKey[key];
}

export function resolveHeroIllustration(
  key: string | null | undefined,
): StaticImageData | undefined {
  if (!key) return undefined;
  return heroIllustrationByKey[key];
}
