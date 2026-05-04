import ColorRevealSection from "@/components/sections/ColorRevealSection";
import CoreServicesShowcase from "@/components/sections/CoreServicesShowcase";
import HeroCreamSplit from "@/components/sections/HeroCreamSplit";
import PricingSection from "@/components/sections/PricingSection";
import SkillsShowcase from "@/components/sections/SkillsShowcase";
import siteContent from "@/data/site-content.json";

export default function Home() {
  return (
    <div className="flex flex-col">
      <div className="bg-brand-canvas">
        <HeroCreamSplit />
        <ColorRevealSection lines={siteContent.homepage.revealLines} />
      </div>

      <div className="mt-16 flex w-full flex-col gap-16 px-6 md:px-10">
        <CoreServicesShowcase />

        <SkillsShowcase />

        <PricingSection />

        {/* Impact (StatsSection): omitted for now; component unchanged in codebase */}
      </div>
    </div>
  );
}
