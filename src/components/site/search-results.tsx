import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Filter, Search, X } from "lucide-react";
import { articleHref, articleText, categoryName, hrefFor, type Locale } from "@/lib/public-locale";
import type { PublicArticleSummary, PublicCategory } from "@/types/public-content";

export function SearchResults({ query, category, categories, articles, total, page, pageSize, locale, error }: {
  query: string; category: string; categories: PublicCategory[];
  articles: PublicArticleSummary[]; total: number; page: number; pageSize: number;
  locale: Locale; error?: string;
}) {
  const title = locale === "km" ? "លទ្ធផលស្វែងរក" : "Search Results";
  const selected = categories.find((item) => item.slug === category);
  const pageHref = (next: number) => hrefFor(`/search?${new URLSearchParams({ q: query, ...(category ? { category } : {}), page: String(next) })}`, locale);
  return <main className="min-h-screen flex-1 bg-slate-50 dark:bg-slate-950">
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
        <form action={hrefFor("/search", locale)} method="get">
          <div className="relative mb-6">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input key={query} type="search" name="q" defaultValue={query} maxLength={160} aria-label={title} placeholder={locale === "km" ? "ស្វែងរកព័ត៌មាន..." : "Search articles..."} className="w-full rounded-xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900" />
          </div>
          <details open={Boolean(category)} className="group">
            <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"><Filter className="size-4" />{locale === "km" ? "តម្រង" : "Filters"}</summary>
            <div className="mt-4 flex flex-wrap items-end gap-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <label className="grid min-w-48 flex-1 gap-2 text-sm font-medium">{locale === "km" ? "ប្រភេទ" : "Category"}
                <select name="category" defaultValue={category} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800">
                  <option value="">{locale === "km" ? "គ្រប់ប្រភេទ" : "All Categories"}</option>
                  {categories.map((item) => <option key={item.id} value={item.slug}>{categoryName(item, locale)}</option>)}
                </select>
              </label>
              <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">{locale === "km" ? "ស្វែងរក" : "Search"}</button>
            </div>
          </details>
          <button type="submit" className="sr-only">{title}</button>
        </form>
        {selected ? <Link href={hrefFor(`/search?q=${encodeURIComponent(query)}`, locale)} className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">{categoryName(selected, locale)}<X className="size-3" /></Link> : null}
      </div>
      {query && !error ? <p role="status" className="mb-6 text-slate-600 dark:text-slate-400">{locale === "km" ? `លទ្ធផល ${total} សម្រាប់ “${query}”` : `${total} results for "${query}"`}</p> : null}
      {error ? <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-800">{error}</div> : articles.length ? <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => {
          const text = articleText(article, locale);
          return <article key={article.id} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <Link href={articleHref(article, locale)}>
              {article.featuredImageUrl ? <div className="relative h-48 overflow-hidden">
                <Image src={article.featuredImageUrl} alt="" fill unoptimized sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 400px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                {article.isBreaking ? <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">{locale === "km" ? "ព័ត៌មានទាន់ហេតុការណ៍" : "BREAKING"}</span> : null}
                {article.isFeatured ? <span className="absolute right-3 top-3 rounded-full bg-blue-500 px-2 py-1 text-xs font-bold text-white">{locale === "km" ? "ព័ត៌មានលេចធ្លោ" : "FEATURED"}</span> : null}
              </div> : null}
              <div className="p-6">
                <div className="mb-3 flex flex-wrap items-center gap-2"><span className="text-xs font-semibold uppercase tracking-wide text-blue-600">{categoryName(article.category, locale)}</span><span className="text-slate-300">•</span><time dateTime={article.publishedAt} className="flex items-center gap-1 text-xs text-slate-500"><Clock className="size-3" />{new Date(article.publishedAt).toLocaleDateString(locale === "km" ? "km-KH" : "en-US", { month: "short", day: "numeric", year: "numeric" })}</time></div>
                <h2 className="mb-3 line-clamp-2 font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white">{text.title}</h2>
                {text.summary ? <p className="mb-4 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">{text.summary}</p> : null}
                <div className="flex items-center justify-between text-xs text-slate-500"><span>{article.viewCount} {locale === "km" ? "ដង" : "views"}</span><ArrowRight className="size-3 transition-transform group-hover:translate-x-1" /></div>
              </div>
            </Link>
          </article>;
        })}
      </div> : <div className="py-12 text-center"><Search className="mx-auto mb-4 size-16 text-slate-400" /><h2 className="mb-2 text-xl font-medium text-slate-900 dark:text-white">{query ? (locale === "km" ? "មិនមានលទ្ធផល" : "No results found") : (locale === "km" ? "ចាប់ផ្តើមស្វែងរក" : "Start searching")}</h2><p className="text-slate-600 dark:text-slate-400">{locale === "km" ? "បញ្ចូលពាក្យស្វែងរក ដើម្បីស្វែងរកព័ត៌មាន។" : query ? "Try adjusting your search terms or filters" : "Enter a search term to find articles, content, and more"}</p>{category ? <Link href={hrefFor(`/search?q=${encodeURIComponent(query)}`, locale)} className="mt-6 inline-block font-medium text-blue-600">{locale === "km" ? "សម្អាតតម្រង" : "Clear all filters"}</Link> : null}</div>}
      {!error && total > pageSize ? <nav aria-label="Search pagination" className="flex justify-center gap-4 pt-8">
        {page > 1 ? <Link href={pageHref(page - 1)} className="rounded-lg border px-4 py-2 text-sm">{locale === "km" ? "មុន" : "Previous"}</Link> : null}
        <span className="py-2 text-sm text-slate-500">{page} / {Math.ceil(total / pageSize)}</span>
        {page * pageSize < total ? <Link href={pageHref(page + 1)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">{locale === "km" ? "បន្ទាប់" : "Next"}</Link> : null}
      </nav> : null}
    </div>
  </main>;
}
