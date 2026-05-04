import Link from "next/link";
import siteContent from "@/data/site-content.json";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-brand-border bg-brand-ink">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row md:px-10">
        <p className="text-sm text-brand-muted-light">
          {new Date().getFullYear()} {siteContent.brand.name}. All rights reserved.
        </p>
        <div className="flex flex-row items-center gap-4">
          <Link
            href={siteContent.socials.instagram}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-brand-paper/85 transition-colors hover:text-brand-accent"
          >
            Instagram
          </Link>
          <Link
            href={siteContent.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-brand-paper/85 transition-colors hover:text-brand-accent"
          >
            LinkedIn
          </Link>
        </div>
      </div>
    </footer>
  );
}
