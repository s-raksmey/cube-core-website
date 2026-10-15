"use client";

import { articleHref, articleText, type Locale } from "@/lib/public-locale";
import type { PublicArticleSummary } from "@/types/public-content";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function SiteHero({
  name,
  slides,
  locale,
}: {
  name: string;
  slides: PublicArticleSummary[];
  locale: Locale;
}) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % slides.length),
      7000,
    );
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const currentIndex = slides.length ? index % slides.length : 0;
  const article = slides[currentIndex];
  const copy = article ? articleText(article, locale) : null;
  return (
    <section
      className="relative min-h-100 overflow-hidden bg-slate-950 sm:min-h-110 lg:min-h-120"
      aria-label={locale === "km" ? "ព័ត៌មានពិសេស" : "Featured stories"}
    >
      <Image
        key={article?.id ?? "fallback"}
        src={article?.featuredImageUrl ?? "/news-hero.webp"}
        alt=""
        fill
        unoptimized
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-r from-slate-950/90 via-slate-950/70 to-red-950/70" />
      <div className="relative mx-auto flex min-h-100 max-w-[1720px] flex-col justify-center px-4 pb-28 pt-10 text-white sm:min-h-110 sm:px-6 sm:pt-12 lg:min-h-120 lg:px-8 xl:px-10">
        <div
          key={article?.id ?? "fallback"}
          className="min-w-0 max-w-208 motion-safe:animate-[site-slide-in_.55s_ease-out]"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-red-200 sm:mb-4 sm:text-sm">
            {name}
          </p>
          <h1
            className={`line-clamp-2 text-pretty font-extrabold wrap-anywhere ${locale === "km" ? "text-[clamp(1.7rem,3vw,2.75rem)] leading-[1.45]" : "text-[clamp(1.85rem,3vw,3rem)] leading-[1.2]"}`}
          >
            {copy?.title ?? name}
          </h1>
          <p
            className={`mt-4 line-clamp-2 max-w-2xl text-pretty text-white/85 ${locale === "km" ? "text-base leading-8 sm:text-lg" : "text-base leading-7 sm:text-lg"}`}
          >
            {copy?.summary ??
              (locale === "km"
                ? "ព័ត៌មាន និងរឿងរ៉ាវថ្មីៗពីសហគមន៍របស់អ្នក។"
                : "The latest stories and reporting from your community.")}
          </p>
          {article ? (
            <Link
              href={articleHref(article, locale)}
              className="mt-6 inline-flex rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm hover:bg-red-50"
            >
              {locale === "km" ? "អានបន្ត" : "Read story"}
            </Link>
          ) : null}
        </div>
        {slides.length > 1 ? (
          <div className="absolute bottom-6 left-3 z-10 flex items-center gap-4 sm:left-6 lg:left-8 xl:left-10">
            <button
              type="button"
              onClick={() =>
                setIndex(
                  (current) => (current - 1 + slides.length) % slides.length,
                )
              }
              className="grid size-10 place-items-center rounded-full border border-white/30 text-white hover:bg-white/10"
              aria-label="Previous carousel slide"
            >
              <ChevronLeft className="size-5" />
            </button>
            <div className="flex gap-2" aria-label="Carousel slides">
              {slides.map((slide, dot) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setIndex(dot)}
                  className={`h-2.5 rounded-full transition-all ${dot === currentIndex ? "w-8 bg-white" : "w-2.5 bg-white/45 hover:bg-white/70"}`}
                  aria-label={`Go to carousel slide ${dot + 1}`}
                  aria-current={dot === currentIndex ? "true" : undefined}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setIndex((current) => (current + 1) % slides.length)
              }
              className="grid size-10 place-items-center rounded-full border border-white/30 text-white hover:bg-white/10"
              aria-label="Next carousel slide"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
