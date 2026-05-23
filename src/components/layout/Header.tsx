"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import siteContent from "@/data/site-content.json";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/#services" },
  { label: "Shopify", href: "/#shopify" },
  { label: "Contact", href: "/#contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-brand-border bg-brand-panel-raised/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-row items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="group flex flex-col">
          <span
            className={`text-sm font-semibold uppercase tracking-[0.2em] text-brand-accent transition-colors duration-300 ease-out ${
              isScrolled ? "group-hover:text-brand-accent-secondary" : "group-hover:text-brand-accent-secondary"
            }`}>
            {siteContent.brand.name}
          </span>
          <span
            className={`text-xs text-brand-muted transition-colors duration-300 ease-out ${
              isScrolled ? "group-hover:text-brand-muted-light" : "group-hover:text-brand-paper/85"
            }`}>
            {siteContent.brand.tagline}
          </span>
        </Link>
        <nav className="flex flex-row items-center gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium text-brand-accent transition-colors duration-300 ease-out ${
                isScrolled ? "hover:text-brand-accent-secondary" : "hover:text-brand-paper"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
