import Image from "next/image";
import siteContent from "@/data/site-content.json";

export default function StatsSection() {
  const { statsSection } = siteContent.homepage;

  return (
    <section className="flex flex-row flex-wrap gap-8 rounded-2xl border border-brand-border bg-brand-panel p-8 shadow-sm md:p-10">
      <div className="flex min-w-[260px] flex-1">
        <Image
          src={statsSection.imageUrl}
          alt="Developer collaborating with business stakeholders"
          width={900}
          height={700}
          className="h-full min-h-72 w-full rounded-xl object-cover"
        />
      </div>
      <div className="flex min-w-[280px] flex-[1.3] flex-col gap-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
          {statsSection.eyebrow}
        </p>
        <h2 className="text-3xl font-bold text-brand-ink">{statsSection.title}</h2>
        <p className="max-w-2xl text-base leading-relaxed text-brand-muted">{statsSection.description}</p>
        <div className="flex flex-row flex-wrap gap-4 pt-1">
          {statsSection.stats.map((stat) => (
            <article
              key={stat.value}
              className="flex min-w-48 flex-1 flex-col rounded-lg border border-brand-border bg-brand-sand p-4"
            >
              <p className="text-3xl font-bold text-brand-accent">{stat.value}</p>
              <p className="text-sm text-brand-muted">{stat.label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
