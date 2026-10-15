import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StoryList } from "@/components/site/story-list";
import { hrefFor, type Locale } from "@/lib/public-locale";
import type { PublicArticleSummary } from "@/types/public-content";

export function StoryArchive({ title, articles, total, page, pageSize, path, locale, description }: {
  title: string; articles: PublicArticleSummary[]; total: number; page: number; pageSize: number;
  path: string; locale: Locale; description?: string;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageHref = (number: number) => hrefFor(`${path}${path.includes("?") ? "&" : "?"}page=${number}`, locale);
  return <main className="site-shell flex-1 py-7 pb-16">
    <nav className="mb-5 text-sm text-slate-500" aria-label="Breadcrumb"><Link href={hrefFor("/", locale)} className="hover:text-blue-600">{locale === "km" ? "ទំព័រដើម" : "Home"}</Link><span className="mx-2">/</span><span className="text-slate-900 dark:text-white">{title}</span></nav>
    <div className="mb-7 border-b border-slate-200 pb-5 dark:border-slate-800"><h1 className="text-3xl font-extrabold tracking-tight text-[#101d48] dark:text-white">{title}</h1>{description ? <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}</div>
    {articles.length ? <StoryList articles={articles} locale={locale} /> : <div className="rounded-lg border border-slate-200 p-12 text-center text-slate-500 dark:border-slate-800">{locale === "km" ? "មិនមានព័ត៌មានទេ" : "No stories found"}</div>}
    {totalPages > 1 ? <nav className="mt-8 flex items-center justify-center gap-4 text-sm" aria-label="Pagination">
      {page > 1 ? <Link href={pageHref(page - 1)} className="inline-flex items-center gap-1 rounded-md border px-3 py-2 hover:border-blue-500"><ChevronLeft className="size-4" />Previous</Link> : null}
      <span>Page {page} of {totalPages}</span>
      {page < totalPages ? <Link href={pageHref(page + 1)} className="inline-flex items-center gap-1 rounded-md border px-3 py-2 hover:border-blue-500">Next<ChevronRight className="size-4" /></Link> : null}
    </nav> : null}
  </main>;
}
