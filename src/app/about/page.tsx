import ScrollFade from "@/components/animations/ScrollFade";
import siteContent from "@/data/site-content.json";

export default function AboutPage() {
  return (
    <div className="flex w-full flex-col gap-10 px-6 pt-28 md:px-10">
      <ScrollFade className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-brand-ink">{siteContent.about.title}</h1>
        <p className="max-w-4xl text-lg leading-relaxed text-brand-muted">{siteContent.about.intro}</p>
        <p className="max-w-4xl text-lg leading-relaxed text-brand-muted">{siteContent.about.focus}</p>
      </ScrollFade>

      <ScrollFade className="flex flex-col gap-5 cyber-panel rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-brand-ink">What Clients Rely On</h2>
        <div className="flex flex-col gap-3">
          {siteContent.about.highlights.map((highlight) => (
            <p
              key={highlight}
              className="rounded-md border border-brand-border bg-brand-sand px-4 py-3 text-brand-ink"
            >
              {highlight}
            </p>
          ))}
        </div>
      </ScrollFade>
    </div>
  );
}
