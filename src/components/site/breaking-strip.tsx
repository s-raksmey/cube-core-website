"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, X } from "lucide-react";
import { articleHref, articleText, type Locale } from "@/lib/public-locale";
import type { PublicArticleSummary } from "@/types/public-content";

export function BreakingStrip({ articles, locale }: { articles: PublicArticleSummary[]; locale: Locale }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (articles.length < 2 || paused || !visible) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % articles.length), 5000);
    return () => window.clearInterval(timer);
  }, [articles.length, paused, visible]);

  if (!visible || !articles.length) return null;
  const currentIndex = index % articles.length;
  const article = articles[currentIndex];

  return <aside className="bg-red-600 text-white" aria-label={locale === "km" ? "ព័ត៌មានបន្ទាន់" : "Breaking News"}>
    <div className="mx-auto flex min-h-12 max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex shrink-0 items-center gap-2"><AlertCircle className="size-4 motion-safe:animate-pulse" aria-hidden="true" /><span className="text-xs font-bold uppercase tracking-wide sm:text-sm">{locale === "km" ? "ព័ត៌មានបន្ទាន់" : "Breaking News"}</span></div>
        <span className="hidden h-4 w-px shrink-0 bg-red-400 sm:block" aria-hidden="true" />
        <Link key={article.id} href={articleHref(article, locale)} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)} className="min-w-0 truncate text-xs hover:underline sm:text-sm">{articleText(article, locale).title}</Link>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {articles.length > 1 ? <div className="hidden items-center gap-1 sm:flex" aria-label="Breaking news stories">{articles.map((item, dot) => <button key={item.id} type="button" onClick={() => setIndex(dot)} className={`size-1.5 rounded-full ${dot === currentIndex ? "bg-white" : "bg-red-400 hover:bg-red-200"}`} aria-label={`Show breaking story ${dot + 1}`} aria-current={dot === currentIndex ? "true" : undefined} />)}</div> : null}
        <button type="button" onClick={() => setVisible(false)} className="rounded p-1 hover:bg-red-700" aria-label="Close breaking news"><X className="size-4" /></button>
      </div>
    </div>
  </aside>;
}
