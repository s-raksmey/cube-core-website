import Link from "next/link";
import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { articleHref, articleText, categoryName, type Locale } from "@/lib/public-locale";
import type { PublicArticleSummary } from "@/types/public-content";

export function StoryList({ articles, locale }: { articles: PublicArticleSummary[]; locale: Locale }) {
  return <div className="divide-y divide-slate-200 dark:divide-slate-800">{articles.map((article) => {
    const text = articleText(article, locale);
    return <article key={article.id} className="grid gap-4 py-5 sm:grid-cols-[minmax(180px,30%)_1fr] sm:gap-6">
      <Link href={articleHref(article, locale)} className="relative block aspect-video overflow-hidden rounded-md bg-slate-800">
        {article.featuredImageUrl ? <Image src={article.featuredImageUrl} alt="" fill unoptimized sizes="(max-width: 640px) 100vw, 30vw" className="object-cover transition-transform duration-300 hover:scale-105" /> : <span className="absolute inset-0 bg-gradient-to-br from-blue-950 to-indigo-600" />}
      </Link>
      <div className="flex min-w-0 flex-col justify-center">
        <span className="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-300">{categoryName(article.category, locale)}</span>
        <Link href={articleHref(article, locale)} className="mt-2 text-lg font-bold leading-snug text-slate-950 hover:text-blue-600 dark:text-white sm:text-xl">{text.title}</Link>
        {text.summary ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{text.summary}</p> : null}
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"><CalendarDays className="size-3.5" />{new Date(article.publishedAt).toLocaleDateString(locale === "km" ? "km-KH" : "en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
      </div>
    </article>;
  })}</div>;
}
