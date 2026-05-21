import ScrollFade from "@/components/animations/ScrollFade";
import ColorRevealSection from "@/components/sections/ColorRevealSection";
import FaqSection from "@/components/sections/FaqSection";
import ServicesGridSection from "@/components/sections/ServicesGridSection";
import HeroHomeTypingBg from "@/components/sections/HeroHomeTypingBg";
import PricingSection from "@/components/sections/PricingSection";
import SkillsShowcase from "@/components/sections/SkillsShowcase";
import siteContent from "@/data/site-content.json";

export default function Home() {
  return (
    <div className="flex flex-col">
      <div className="bg-brand-canvas">
        <HeroHomeTypingBg />
        <ColorRevealSection lines={siteContent.homepage.revealLines} />
      </div>

      <div className="mt-16 flex w-full flex-col gap-16">
        <ServicesGridSection />

        <div className="flex w-full flex-col gap-16 px-6 md:px-10">
          <SkillsShowcase />

          <PricingSection />

          <ScrollFade className="mx-auto w-full max-w-6xl pb-8">
            <FaqSection />
          </ScrollFade>

          {/* Impact (StatsSection): omitted for now; component unchanged in codebase */}
        </div>
      </div>
    </div>
  );
}
